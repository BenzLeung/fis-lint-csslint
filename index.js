/*
 * fis
 * http://fis.baidu.com/
 */

var CSSLint = require('./node_modules/csslint/lib/csslint-node.js').CSSLint;

(function (fis) {

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

    module.exports = function(content, file, conf){
        var ruleset = filterRules(conf);
        ruleset = gatherRules(conf, ruleset);
        if (typeof conf.ie !== 'undefined' && (!conf.ie)) {
            ruleset = avoidIERules(ruleset);
        }

        var result = CSSLint.verify(content, ruleset);
        var messages = result.messages;

        CSSLint.Util.forEach(messages, function (msg) {
            var output;
            if (msg.rollup) {
                output = 'csslint : ' + '[' + msg.type.toUpperCase() + '] ' + msg.message + ' [' + file.subpath + ']';
            } else {
                output = 'csslint : ' + '[' + msg.type.toUpperCase() + '] ' + msg.message + ' [' + file.subpath + ':' + msg.line + ':' + msg.col + ']';
            }
            fis.log.warning(output);
        });

    };
})(fis);
