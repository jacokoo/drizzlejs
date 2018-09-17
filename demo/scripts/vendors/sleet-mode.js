define('ace/mode/sleet-highlight-rules', ['require', 'exports', 'ace/mode/javascript'], function(require, exports, module) {
    var oop = require('../lib/oop'),
        TextHighlightRules = require("./text_highlight_rules").TextHighlightRules,
        JavaScriptHighlightRules = require('./javascript_highlight_rules').JavaScriptHighlightRules,
        SleetHighlightRules, indent = 0, tagName;

    SleetHighlightRules = function() {
        this.$rules = {
            start: [{
                token: 'comment',
                regex: '^#!\\s*(.*)$',
                next: 'start'
            }, {
                regex: '^\\s*#\\s+(.*)$',
                token: 'comment',
                next: 'start'
            }, {
                token: function(i) {
                    indent = i.length;
                    return 'comment';
                },
                regex: '^(\\s*)#\\.\\s*$',
                next: 'comment-block'
            }, {
                regex: '(\\s*)([.#])?(?:[\\w$@_-]+)$',
                token: function(i, t) {
                    return t ? 'entity.other.attribute-name.sleet' : 'entity.name.tag.sleet';
                },
                next: 'start'
            }, {
                regex: '(\\s*)([.#])?([\\w$@_-]+)',
                token: function(i, t, tag) {
                    tagName = t ? 'div' : tag;
                    indent = i.length
                    return t ? 'entity.other.attribute-name.sleet' : 'entity.name.tag.sleet';
                },
                next: 'tag'
            }, {
                regex: '\\|(.*)$',
                token: 'text',
                next: 'start'
            }, {
                regex: '(\\s*)\\|.\\s*$',
                token: function(i) {
                    indent = i.length;
                    return 'text';
                },
                next: 'text-block'
            }],

            tag: [{
                regex: '([.#])?([\\w$@_-]+)$',
                token: function(t, tag) {
                    tagName = t ? 'div' : tag;
                    return t ? 'entity.other.attribute-name.sleet' : 'entity.name.tag.sleet';
                },
                next: 'start'
            }, {
                regex: '([.#])?([\\w$@_-]+)',
                token: function(t, tag) {
                    tagName = t ? 'div' : tag;
                    return t ? 'entity.other.attribute-name.sleet' : 'entity.name.tag.sleet';
                },
                next: 'tag'
            }, {
                regex: '\\(',
                token: 'punctuation.definition.attribute.start.sleet',
                next: 'attribute'
            }, {
                regex: '\\s*[:>+]\\s*',
                token: 'punctuation.definition.tag.inline.sleet',
                next: 'tag'
            }, {
                regex: '\\s*\\.\\s*$',
                token: function() {
                    return 'text';
                },
                next: 'text-block'
            }, {
                regex: ' .*$',
                token: 'text',
                next: 'start'
            }],

            attribute: [{
                regex: '(\'[^\']+\'|\"[^\"]+\"|[\\w$@_.-]+),?\\s*',
                token: 'entity.other.attribute-name.sleet',
                next: 'attribute'
            }, {
                regex: '(\\s*[=+]\\s*)(\'[^\']*\'|\"[^\"]*\"|[\\w$@_.-]*)(,?\\s*)',
                token: ['punctuation.definition.attribute.equals.sleet', 'string.quoted.sleet', 'punctuation.definition.attribute.equals.sleet'],
                next: 'attribute'
            }, {
                regex: '\\)$',
                token: 'punctuation.definition.attribute.end.sleet',
                next: 'start'
            }, {
                regex: '\\)',
                token: 'punctuation.definition.attribute.end.sleet',
                next: 'tag'
            }],

            'text-block': [{
                regex: '^\\s*$',
                token: 'text',
                next: 'text-block'
            }, {
                regex: '^(\\s*)',
                token: function(i) {
                    if (i.length > indent && tagName === 'script') {
                        this.next = 'js-start';
                        return 'source.js.embedded.sleet'
                    }

                    if (i.length > indent) {
                        this.next = 'text-block';
                        return 'text';
                    }
                    this.next = 'start';
                    return 'text';
                }
            }],

            'comment-block': [{
                token: function(i, value) {
                    if (i.length > indent || value.trim().length === 0) {
                        this.next = '';
                        return 'comment';
                    }
                    this.next = 'start';
                    return 'text';
                },
                regex: '^(\\s*)(.*)$'
            }]
        };

        this.embedRules(JavaScriptHighlightRules, "js-", [{
            token: "text",
            regex: ".$",
            next: "start"
        }]);
    };


    oop.inherits(SleetHighlightRules, TextHighlightRules);
    exports.SleetHighlightRules = SleetHighlightRules;
});

define('ace/mode/sleet', function(require, exports) {
    var oop = require("../lib/oop"),
        TextMode = require("./text").Mode,
        rules = require('./sleet-highlight-rules').SleetHighlightRules, Mode;

    Mode = function() {
        this.HighlightRules = rules;
    };

    oop.inherits(Mode, TextMode);
    exports.Mode = Mode;
});
