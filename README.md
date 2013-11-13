fis-lint-csslint
================

A lint plugin for [fis](http://fis.baidu.com/) to validate css file.

Depend on [CSSLint](http://csslint.net/ "CSSLint") ([Github](https://github.com/stubbornella/csslint "CSSLint on Github")).

[FIS](http://fis.baidu.com/) 插件，用于CSS语法校验。

基于 [CSSLint](http://csslint.net/ "CSSLint") ([Github](https://github.com/stubbornella/csslint "CSSLint on Github"))。

## 用法 ##

```javascript
//设置css后缀的文件使用fis-lint-csslint插件校验
fis.config.set('modules.lint.css', 'csslint');
//设置less后缀的文件使用fis-lint-csslint插件校验
fis.config.set('modules.lint.less', 'csslint');

//设置fis-lint-csslint插件的校验规则：
fis.config.set('settings.lint.csslint', {
    /**
     * 报告为“WARNING”的规则ID列表，支持数组或以“,”分隔的字符串
     */
    warnings : ["rule1", "rule2", ...],

    /**
     * 报告为“ERROR”的规则ID列表，支持数组或以“,”分隔的字符串
     */
    errors   : ["rule1", "rule2", ...],

    /**
     * 若ie值为false，则忽略所有与IE兼容性相关的校验规则
     */
    ie       : false,

    /**
     * 要忽略的规则ID列表，支持数组或以“,”分隔的字符串
     */
    ignore   : ["rule1", "rule2", ...]
});
```


## 校验规则 ##

支持的校验规则以及对应规则ID（Rule ID）请参考：

[https://github.com/stubbornella/csslint/wiki/Rules](https://github.com/stubbornella/csslint/wiki/Rules)

