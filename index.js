/*
 * fis
 * http://fis.baidu.com/
 */

var CSSLint = require('csslint').CSSLint;

/**
 * Returns a ruleset object based on the CLI options.
 * @param options {Object} The CLI options.
 * @param ruleset {Object} The Ruleset to gather.
 * @return {Object} A ruleset object.
 */
function gatherRules(options, ruleset){
    var warnings = options.rules || options.warnings,
        errors = options.errors;

    if (warnings){
        ruleset = ruleset || {};
        if (typeof warnings === 'string') {
            warnings = warnings.split(",");
        }
        warnings.forEach(function(value){
            ruleset[value] = 1;
        });
    }

    if (errors){
        ruleset = ruleset || {};
        if (typeof errors === 'string') {
            errors = errors.split(",");
        }
        errors.forEach(function(value){
            ruleset[value] = 2;
        });
    }

    return ruleset;
}

/**
 * Filters out rules using the ignore command line option.
 * @param options {Object} the CLI options
 * @return {Object} A ruleset object.
 */
function filterRules(options) {
    var ignore = options.ignore,
        ruleset = CSSLint.getRuleset();

    if (ignore) {
        if (typeof ignore === 'string') {
            ignore = ignore.split(",");
        }
        ignore.forEach(function(value){
            ruleset[value] = 0;
        });
    }

    return ruleset;
}

/**
 * 删除与IE有关的规则
 * @param ruleset {Object}
 * @return {object} A ruleset object.
 */
function avoidIERules(ruleset) {
    var rules = CSSLint.getRules();
    ruleset = ruleset || CSSLint.getRuleset();

    CSSLint.Util.forEach(rules, function(rule) {
        if (rule.browsers.indexOf('IE', 0) >= 0) {
            ruleset[rule.id] = 0;
        }
    });

    return ruleset;
}

function deleteIgnoreBlock(content) {
    var ignoreBlock = /(\/\*\s*csslint ignore\s*:\s*start)(.*\n)+?(\/\*\s*csslint ignore\s*:\s*end\s*\*\/)/igm;
    return content.replace(ignoreBlock, '');
}

module.exports = function(content, file, conf){
    if (!content) {
        return;
    }
    var ruleset = filterRules(conf);
    ruleset = gatherRules(conf, ruleset);
    if (typeof conf.ie !== 'undefined' && (!conf.ie)) {
        ruleset = avoidIERules(ruleset);
    }
    if (conf.smartyIgnore) {
        var smartyRegexp = conf.smartyRegexp || /\{%.+?%\}/gm;
        content = content.replace(smartyRegexp, '');
    }
    content = deleteIgnoreBlock(content);

    var result = CSSLint.verify(content, ruleset);
    var messages = result.messages;

    CSSLint.Util.forEach(messages, function (msg) {
        switch(msg.type){
            case 'error':
                fis.log.error(msg.message);
                break;
            default :
                var path = file.subpath;
                if(!msg.rollup){
                    path += ':' + msg.line + ':' + msg.col;
                }
                fis.log.warning(msg.message + ' [' + path + ']');
                break;
        }
    });

};

module.exports.defaultOptions = {
    ignore : [
        'underscore-property-hack',
        'star-property-hack',
        'unique-headings'
    ]
};