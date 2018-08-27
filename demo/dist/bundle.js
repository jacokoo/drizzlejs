(function (drizzlejs,fs,path) {
    'use strict';

    fs = fs && fs.hasOwnProperty('default') ? fs['default'] : fs;
    path = path && path.hasOwnProperty('default') ? path['default'] : path;

    var KV = drizzlejs.factory.KV,
        SN = drizzlejs.factory.SN,
        C = drizzlejs.factory.C,
        TX = drizzlejs.factory.TX;

    var template = new drizzlejs.ModuleTemplate([]);
    var templateNodes = function templateNodes() {
        var o1 = SN('div', null, KV('class', 'brand-title'));
        var o2 = SN('span', null, KV('style', 'font-weight: 400;'));
        var o3 = TX('D');
        var o4 = SN('span');
        var o5 = TX('rizzle');
        var o6 = SN('div', null, KV('class', 'header'));
        var o7 = SN('ul', null, KV('class', 'header-nav'));
        var o8 = SN('li', null, KV('class', 'header-nav-item active'));
        var o9 = SN('a', null, KV('href', '#/guide'));
        var o10 = TX('开始使用');
        var o11 = SN('li', null, KV('class', 'header-nav-item'));
        var o12 = SN('a', null, KV('href', '#/repl'));
        var o13 = TX('在线试用');
        var o14 = SN('li', null, KV('class', 'header-nav-item'));
        var o15 = SN('a', null, KV('href', '#/demos'));
        var o16 = TX('示例集合');
        C(o2, o3);
        C(o4, o5);
        C(o1, o2, o4);
        C(o9, o10);
        C(o8, o9);
        C(o12, o13);
        C(o11, o12);
        C(o15, o16);
        C(o14, o15);
        C(o7, o8, o11, o14);
        C(o6, o7);
        return [o1, o6];
    };
    template.creator = templateNodes;
    var _app_header = { template: template };

    var EV = drizzlejs.factory.EV,
        AT = drizzlejs.factory.AT,
        SV = drizzlejs.factory.SV,
        NSA = drizzlejs.factory.NSA,
        DV = drizzlejs.factory.DV,
        NDA = drizzlejs.factory.NDA,
        KV$1 = drizzlejs.factory.KV,
        DN = drizzlejs.factory.DN,
        C$1 = drizzlejs.factory.C,
        SN$1 = drizzlejs.factory.SN,
        RG = drizzlejs.factory.RG;

    var template$1 = new drizzlejs.ModuleTemplate(['closeWhenMenuClicked']);
    var templateNodes$1 = function templateNodes() {
        var o1 = DN('div', 'dropdown', KV$1('class', 'dropdown'));
        EV(o1, 'click', 'clickIt', NDA('event'), NDA('this'));
        var o2 = SN$1('div', null, KV$1('class', 'dropdown-trigger'));
        var o3 = RG('trigger');
        var o4 = SN$1('button', null, KV$1('class', 'button'));
        var o5 = SN$1('span', null, KV$1('class', 'icon is-small'));
        var o6 = SN$1('svg', null, KV$1('viewBox', '0 0 129 129'), KV$1('enable-background', 'new 0 0 129 129'));
        var o7 = SN$1('g');
        var o8 = SN$1('path', null, KV$1('d', 'm121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z'));
        var o9 = SN$1('div', null, KV$1('class', 'dropdown-menu'));
        var o10 = SN$1('div', 'content', KV$1('class', 'dropdown-content'));
        var o11 = RG();
        C$1(o7, o8);
        C$1(o6, o7);
        C$1(o5, o6);
        C$1(o4, o5);
        C$1(o3, o4);
        C$1(o2, o3);
        C$1(o10, o11);
        C$1(o9, o10);
        C$1(o1, o2, o9);
        return [o1];
    };
    template$1.creator = templateNodes$1;
    var _c_dropdown = {
        store: { models: { closeWhenMenuClicked: function closeWhenMenuClicked() {
                    return false;
                } } },
        events: {
            clickIt: function clickIt(e, it) {
                var _this = this;

                var closeIt = this.get('closeWhenMenuClicked');
                e.stopPropagation();
                if (!this.dropdownHandler) {
                    this.dropdownHandler = function (ee) {
                        if (closeIt && ee && _this.ids.content.contains(ee.target)) return;
                        it.classList.remove('is-active');
                        document.removeEventListener('click', _this.dropdownHandler);
                        _this.dropdownHandler = null;
                        _this.fire('hide');
                    };
                    it.classList.add('is-active');
                    document.addEventListener('click', this.dropdownHandler, false);
                    this.fire('show');
                    return;
                }
                this.dropdownHandler(e);
            }
        },
        beforeDestroy: function beforeDestroy() {
            if (this.dropdownHandler) this.dropdownHandler();
        },

        template: template$1
    };

    var CO = drizzlejs.factory.CO,
        H = drizzlejs.factory.H,
        SV$1 = drizzlejs.factory.SV,
        AC = drizzlejs.factory.AC,
        AT$1 = drizzlejs.factory.AT,
        NSA$1 = drizzlejs.factory.NSA,
        DV$1 = drizzlejs.factory.DV,
        NDA$1 = drizzlejs.factory.NDA,
        KV$2 = drizzlejs.factory.KV,
        DN$1 = drizzlejs.factory.DN,
        C$2 = drizzlejs.factory.C;

    var template$2 = new drizzlejs.ViewTemplate();
    var templateNodes$2 = function templateNodes() {
        var o1 = DN$1('div', 'editor', KV$2('class', 'code-editor'));
        CO(o1, 'ace-editor', H('options'), H('code'));
        AC(o1, 'codeChange', 'update', NDA$1('event'));

        return [o1];
    };

    template$2.creator = templateNodes$2;

    var _view_editor = {
        state: {
            options: {
                fontFamily: 'Inconsolata, monospace',
                fontSize: '13px',
                showPrintMargin: false,
                mode: 'ace/mode/sleet',
                theme: 'ace/theme/xcode'
            }
        },
        template: template$2
    };

    var BD = drizzlejs.factory.BD,
        REF = drizzlejs.factory.REF;

    var template$3 = new drizzlejs.ModuleTemplate(['code']);
    var templateNodes$3 = function templateNodes() {
        var o1 = REF('view-editor', []);
        BD(o1, 'code', 'code');
        return [o1];
    };
    template$3.creator = templateNodes$3;
    var _code_editor = {
        items: { views: ['view-editor'] },
        store: {
            models: { code: function code() {
                    return '';
                } },
            actions: {
                update: function update(_ref) {
                    var detail = _ref.detail;

                    this.fire('change', { code: detail });
                }
            }
        },
        template: template$3,
        _loadedItems: { 'view-editor': _view_editor }
    };

    var KV$3 = drizzlejs.factory.KV,
        SN$2 = drizzlejs.factory.SN,
        C$3 = drizzlejs.factory.C,
        DA = drizzlejs.factory.DA,
        HH = drizzlejs.factory.HH,
        DV$2 = drizzlejs.factory.DV,
        SV$2 = drizzlejs.factory.SV,
        AC$1 = drizzlejs.factory.AC,
        AT$2 = drizzlejs.factory.AT,
        NSA$2 = drizzlejs.factory.NSA,
        NDA$2 = drizzlejs.factory.NDA,
        DN$2 = drizzlejs.factory.DN,
        EV$1 = drizzlejs.factory.EV,
        REF$1 = drizzlejs.factory.REF,
        H$1 = drizzlejs.factory.H,
        TX$1 = drizzlejs.factory.TX,
        BD$1 = drizzlejs.factory.BD,
        IFC = drizzlejs.factory.IFC,
        EACH = drizzlejs.factory.EACH;

    var template$4 = new drizzlejs.ViewTemplate();
    var templateNodes$4 = function templateNodes() {
        var o1 = SN$2('div', 'tabs', KV$3('class', 'tabs'));
        var o2 = SN$2('ul');
        var o4 = function o4() {
            var o5 = DN$2('li');
            DA(o5, 'class', HH('if', DV$2('i'), DV$2('eq'), DV$2('current'), SV$2('is-active')));
            AC$1(o5, 'click', 'active', NDA$2('i'));
            var o6 = SN$2('a');
            var o8 = REF$1('c-dropdown', [['closeWhenMenuClicked', true]]);
            EV$1(o8, 'show', 'onShow');
            EV$1(o8, 'hide', 'onHide');
            var o9 = SN$2('span', null, KV$3('region', 'trigger'));
            var o10 = TX$1(H$1('tab'), '.sleet');
            var o11 = SN$2('div', null, KV$3('class', 'dropdown-item'));
            var o12 = SN$2('div', null, KV$3('class', 'field has-addons'));
            var o13 = SN$2('div', null, KV$3('class', 'control'));
            var o14 = DN$2('input', null, KV$3('class', 'input rename'));
            BD$1(o14, 'value', 'name');
            var o15 = SN$2('div', null, KV$3('class', 'control'));
            var o16 = SN$2('span', null, KV$3('class', 'button is-static'));
            var o17 = TX$1('.sleet');
            var o18 = SN$2('div', null, KV$3('class', 'control'));
            var o19 = DN$2('span', null, KV$3('class', 'button'));
            AC$1(o19, 'click', 'rename', NDA$2('tabs'), NDA$2('name'), NDA$2('i'));
            var o20 = TX$1('重命名');
            var o21 = SN$2('span', null, KV$3('a', '1'));
            var o22 = TX$1(H$1('tab'), '.sleet');
            var o7 = IFC([DV$2('haveDropdown')], o8, o21);
            var o23 = SN$2('span', null, KV$3('class', 'delete is-small'));

            C$3(o9, o10);
            C$3(o13, o14);
            C$3(o16, o17);
            C$3(o15, o16);
            C$3(o19, o20);
            C$3(o18, o19);
            C$3(o12, o13, o15, o18);
            C$3(o11, o12);
            C$3(o8, o9, o11);
            C$3(o21, o22);
            C$3(o6, o7, o23);
            C$3(o5, o6);
            return o5;
        };
        var o3 = EACH(['tabs', 'as', 'tab', 'i'], o4);

        C$3(o2, o3);
        C$3(o1, o2);

        return [o1];
    };

    template$4.creator = templateNodes$4;

    var _view_tab = {
        computed: {
            haveDropdown: function haveDropdown(_ref) {
                var tab = _ref.tab,
                    i = _ref.i,
                    current = _ref.current;

                return i === current && tab !== 'index';
            }
        },
        events: {
            onShow: function onShow() {
                this.ids.tabs.style.overflow = 'unset';
            },
            onHide: function onHide() {
                this.ids.tabs.style.overflow = '';
            }
        },
        actions: {
            rename: function rename(cb, tabs, name, i) {
                if (tabs[i] === name) {
                    this.set({ name: '' });
                    return;
                }
                if (tabs.indexOf(name) !== -1) {
                    console.log('already exists');
                    return;
                }
                if (name.indexOf('.') !== -1) {
                    console.log('can not have extension');
                    return;
                }
                if (name.indexOf('-') === -1) {
                    console.log('should have at least one dash(-)');
                    return;
                }
                this.set({ name: '' });
                cb(name);
            }
        },
        template: template$4
    };

    var BD$2 = drizzlejs.factory.BD,
        REF$2 = drizzlejs.factory.REF;

    var template$5 = new drizzlejs.ModuleTemplate(['tabs']);
    var templateNodes$5 = function templateNodes() {
        var o1 = REF$2('view-tab', []);
        BD$2(o1, 'tabs', 'tabs');
        BD$2(o1, 'current', 'current');
        return [o1];
    };
    template$5.creator = templateNodes$5;
    var _file_tab = {
        items: {
            views: ['view-tab'],
            modules: { 'c-dropdown': 'component/dropdown' }
        },
        store: {
            models: {
                tabs: function tabs() {
                    return [];
                },
                current: function current() {
                    return 0;
                }
            },
            actions: {
                active: function active(index) {
                    var _get = this.get(),
                        tabs = _get.tabs,
                        current = _get.current;

                    if (current === index) return;
                    this.set({ current: index });
                    this.fire('change', {
                        from: tabs[current],
                        to: tabs[index]
                    });
                },
                rename: function rename(name) {
                    var _get2 = this.get(),
                        tabs = _get2.tabs,
                        current = _get2.current;

                    var old = tabs[current];
                    tabs[current] = name;
                    this.set({ tabs: tabs });
                    this.fire('rename', {
                        old: old,
                        name: name
                    });
                }
            }
        },
        template: template$5,
        _loadedItems: {
            'view-tab': _view_tab,
            'component/dropdown': _c_dropdown
        }
    };

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
    }

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var parser = function () {
      /*
       * Generated by PEG.js 0.8.0.
       *
       * http://pegjs.majda.cz/
       */

      function peg$subclass(child, parent) {
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
      }

      function SyntaxError(message, expected, found, offset, line, column) {
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.offset = offset;
        this.line = line;
        this.column = column;

        this.name = "SyntaxError";
      }

      peg$subclass(SyntaxError, Error);

      function parse(input) {
        var options = arguments.length > 1 ? arguments[1] : {},
            peg$FAILED = {},
            peg$startRuleFunctions = { start: peg$parsestart },
            peg$startRuleFunction = peg$parsestart,
            peg$c0 = peg$FAILED,
            peg$c1 = null,
            peg$c3 = function peg$c3(declare, nodes) {
          return { nodes: nodes || [], indent: IDT_TOK, declaration: declare };
        },
            peg$c4 = "#!",
            peg$c5 = { type: "literal", value: "#!", description: "\"#!\"" },
            peg$c6 = void 0,
            peg$c7 = "=",
            peg$c8 = { type: "literal", value: "=", description: "\"=\"" },
            peg$c9 = function peg$c9(i) {
          return i;
        },
            peg$c10 = function peg$c10(kv) {
          return kv;
        },
            peg$c11 = function peg$c11(name, ext, attr) {
          return new Declaration(name, ext, attr);
        },
            peg$c12 = { type: "any", description: "any character" },
            peg$c13 = function peg$c13(key, value) {
          return { key: key, value: value };
        },
            peg$c14 = function peg$c14(node) {
          return node;
        },
            peg$c15 = function peg$c15(start, rest) {
          return rest.unshift(start) && rest;
        },
            peg$c16 = function peg$c16(p, c) {
          p.children = c;
          return p;
        },
            peg$c17 = function peg$c17(tag) {
          return parents.push(tag) && tag;
        },
            peg$c18 = function peg$c18(indent) {
          return indent === parent().indent + 1 ? true : parents.pop() && false;
        },
            peg$c19 = function peg$c19(indent, node) {
          return node;
        },
            peg$c20 = /^[:><+]/,
            peg$c21 = { type: "class", value: "[:><+]", description: "[:><+]" },
            peg$c22 = function peg$c22(c, node) {
          node.inlineChar = c;
          return node;
        },
            peg$c23 = function peg$c23() {
          IDT = 0;
        },
            peg$c24 = function peg$c24(indent) {
          return IDT = indent || 0;
        },
            peg$c25 = function peg$c25(body, text) {
          body.text = text || [];
          return body;
        },
            peg$c26 = function peg$c26(ns, name, clazz, id, clazz2) {
          return name || clazz.length > 0 || id || clazz2.length > 0;
        },
            peg$c27 = function peg$c27(ns, name, clazz, id, clazz2, attrs) {
          return new Tag(IDT, name, ns, clazz.concat(clazz2), id, attrs);
        },
            peg$c28 = "|",
            peg$c29 = { type: "literal", value: "|", description: "\"|\"" },
            peg$c30 = function peg$c30(attrs) {
          return new Tag(IDT, '|', null, null, null, attrs);
        },
            peg$c31 = "#",
            peg$c32 = { type: "literal", value: "#", description: "\"#\"" },
            peg$c33 = function peg$c33() {
          return new Tag(IDT, '#');
        },
            peg$c34 = ":",
            peg$c35 = { type: "literal", value: ":", description: "\":\"" },
            peg$c36 = function peg$c36(name) {
          return name;
        },
            peg$c37 = ".",
            peg$c38 = { type: "literal", value: ".", description: "\".\"" },
            peg$c39 = function peg$c39(text) {
          return text;
        },
            peg$c40 = function peg$c40(text) {
          return [text];
        },
            peg$c41 = function peg$c41(l) {
          return l;
        },
            peg$c42 = function peg$c42(first, rest) {
          return rest.unshift(first) && rest;
        },
            peg$c43 = { type: "other", description: "Tag text line" },
            peg$c44 = function peg$c44(indent) {
          if (IDT_TOK === null) {
            IDT_TOK = indent.indexOf('\t') < 0 ? indent : '\t';
          }
          return indent.length >= (IDT + 1) * IDT_TOK.length;
        },
            peg$c45 = function peg$c45(indent, text) {
          return indent.slice((IDT + 1) * IDT_TOK.length) + text;
        },
            peg$c46 = function peg$c46(w) {
          return w;
        },
            peg$c47 = function peg$c47(ws) {
          return ws.slice((IDT + 1) * IDT_TOK.length);
        },
            peg$c48 = function peg$c48(group) {
          return group;
        },
            peg$c49 = "(",
            peg$c50 = { type: "literal", value: "(", description: "\"(\"" },
            peg$c51 = ")",
            peg$c52 = { type: "literal", value: ")", description: "\")\"" },
            peg$c53 = function peg$c53(attrs, settings) {
          return new Attribute.Group(attrs, settings);
        },
            peg$c54 = function peg$c54(attrs, indent) {
          return (indent || '').length === IDT * IDT_TOK.length;
        },
            peg$c55 = function peg$c55(attrs, indent, settings) {
          return new Attribute.Group(attrs, settings);
        },
            peg$c56 = function peg$c56(al) {
          return al;
        },
            peg$c57 = function peg$c57(start, rest) {
          for (var i = 0; i < rest.length; i++) {
            start = start.concat(rest[i]);
          }
          return start;
        },
            peg$c58 = function peg$c58(indent) {
          if (IDT_TOK === null) {
            IDT_TOK = indent.indexOf('\t') < 0 ? indent : '\t';
          }
          return indent.length === (IDT + 1) * IDT_TOK.length;
        },
            peg$c59 = function peg$c59(indent, pairs) {
          return pairs;
        },
            peg$c60 = ",",
            peg$c61 = { type: "literal", value: ",", description: "\",\"" },
            peg$c62 = function peg$c62(pair) {
          return pair;
        },
            peg$c63 = function peg$c63(v) {
          return v;
        },
            peg$c64 = function peg$c64(ns, key, value) {
          return new Attribute(key, value, ns);
        },
            peg$c65 = function peg$c65(value) {
          return new Attribute(null, value);
        },
            peg$c66 = "&",
            peg$c67 = { type: "literal", value: "&", description: "\"&\"" },
            peg$c68 = /^[#a-zA-Z0-9]/,
            peg$c69 = { type: "class", value: "[#a-zA-Z0-9]", description: "[#a-zA-Z0-9]" },
            peg$c70 = ";",
            peg$c71 = { type: "literal", value: ";", description: "\";\"" },
            peg$c72 = function peg$c72(c) {
          return c;
        },
            peg$c73 = function peg$c73(name, attrs) {
          return new Attribute.Setting(name, attrs);
        },
            peg$c74 = "+",
            peg$c75 = { type: "literal", value: "+", description: "\"+\"" },
            peg$c76 = function peg$c76(n) {
          return n;
        },
            peg$c77 = function peg$c77(str) {
          return new Attribute.Quoted(str);
        },
            peg$c78 = function peg$c78(n) {
          return new Attribute.Number(n);
        },
            peg$c79 = function peg$c79(b) {
          return new Attribute.Boolean(b);
        },
            peg$c80 = function peg$c80(name, attrs) {
          return new Attribute.Helper(name, attrs);
        },
            peg$c81 = function peg$c81(i) {
          return new Attribute.Identifier(i);
        },
            peg$c82 = { type: "other", description: "Blank line" },
            peg$c83 = { type: "other", description: "Text to end of line" },
            peg$c84 = function peg$c84() {
          return text();
        },
            peg$c85 = { type: "other", description: "Identifier" },
            peg$c86 = /^[a-zA-Z$@_]/,
            peg$c87 = { type: "class", value: "[a-zA-Z$@_]", description: "[a-zA-Z$@_]" },
            peg$c88 = /^[a-zA-Z0-9$_\-]/,
            peg$c89 = { type: "class", value: "[a-zA-Z0-9$_\\-]", description: "[a-zA-Z0-9$_\\-]" },
            peg$c90 = function peg$c90(start, rest) {
          return start + rest;
        },
            peg$c91 = { type: "other", description: "End of line" },
            peg$c92 = "\n",
            peg$c93 = { type: "literal", value: "\n", description: "\"\\n\"" },
            peg$c94 = "\r",
            peg$c95 = { type: "literal", value: "\r", description: "\"\\r\"" },
            peg$c96 = "\r\n",
            peg$c97 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
            peg$c98 = { type: "other", description: "Whitespace" },
            peg$c99 = "\t",
            peg$c100 = { type: "literal", value: "\t", description: "\"\\t\"" },
            peg$c101 = " ",
            peg$c102 = { type: "literal", value: " ", description: "\" \"" },
            peg$c103 = "\x0B",
            peg$c104 = { type: "literal", value: "\x0B", description: "\"\\x0B\"" },
            peg$c105 = "\f",
            peg$c106 = { type: "literal", value: "\f", description: "\"\\f\"" },
            peg$c107 = { type: "other", description: "Indents" },
            peg$c108 = function peg$c108(spaces) {
          if (IDT_TOK === null) IDT_TOK = spaces;
          return spaces.length % IDT_TOK.length === 0;
        },
            peg$c109 = function peg$c109(spaces) {
          return spaces.length / IDT_TOK.length;
        },
            peg$c110 = function peg$c110(tabs) {
          if (IDT_TOK === null) IDT_TOK = '\t';
          return IDT_TOK === '\t';
        },
            peg$c111 = function peg$c111(tabs) {
          return tabs.length;
        },
            peg$c112 = { type: "other", description: "Quoted string" },
            peg$c113 = "\"",
            peg$c114 = { type: "literal", value: "\"", description: "\"\\\"\"" },
            peg$c115 = function peg$c115(chars) {
          return chars;
        },
            peg$c116 = "'",
            peg$c117 = { type: "literal", value: "'", description: "\"'\"" },
            peg$c118 = { type: "other", description: "Double quoted string char" },
            peg$c119 = "\\",
            peg$c120 = { type: "literal", value: "\\", description: "\"\\\\\"" },
            peg$c121 = function peg$c121() {
          return text();
        },
            peg$c122 = function peg$c122(char) {
          return char;
        },
            peg$c123 = { type: "other", description: "Single quoted string char" },
            peg$c124 = { type: "other", description: "Escaped char" },
            peg$c125 = "0",
            peg$c126 = { type: "literal", value: "0", description: "\"0\"" },
            peg$c127 = /^[0-9]/,
            peg$c128 = { type: "class", value: "[0-9]", description: "[0-9]" },
            peg$c129 = function peg$c129() {
          return '\0';
        },
            peg$c130 = /^[nfrt]/,
            peg$c131 = { type: "class", value: "[nfrt]", description: "[nfrt]" },
            peg$c132 = function peg$c132(c) {
          return '\\' + c;
        },
            peg$c133 = "b",
            peg$c134 = { type: "literal", value: "b", description: "\"b\"" },
            peg$c135 = function peg$c135() {
          return '\x0B';
        },
            peg$c136 = "true",
            peg$c137 = { type: "literal", value: "true", description: "\"true\"" },
            peg$c138 = function peg$c138() {
          return true;
        },
            peg$c139 = "false",
            peg$c140 = { type: "literal", value: "false", description: "\"false\"" },
            peg$c141 = function peg$c141() {
          return false;
        },
            peg$c142 = /^[+\-]/,
            peg$c143 = { type: "class", value: "[+\\-]", description: "[+\\-]" },
            peg$c144 = function peg$c144(sign, n) {
          return sign === '-' ? -n : n;
        },
            peg$c145 = "0x",
            peg$c146 = { type: "literal", value: "0x", description: "\"0x\"" },
            peg$c147 = /^[0-9a-f]/i,
            peg$c148 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
            peg$c149 = function peg$c149() {
          return parseInt(text(), 16);
        },
            peg$c150 = /^[0-7]/,
            peg$c151 = { type: "class", value: "[0-7]", description: "[0-7]" },
            peg$c152 = function peg$c152() {
          return parseInt(text(), 8);
        },
            peg$c153 = function peg$c153() {
          return parseFloat(text());
        },
            peg$c154 = /^[1-9]/,
            peg$c155 = { type: "class", value: "[1-9]", description: "[1-9]" },
            peg$c156 = "e",
            peg$c157 = { type: "literal", value: "e", description: "\"e\"" },
            peg$currPos = 0,
            peg$reportedPos = 0,
            peg$cachedPos = 0,
            peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
            peg$maxFailPos = 0,
            peg$maxFailExpected = [],
            peg$silentFails = 0,
            peg$result;

        if ("startRule" in options) {
          if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
          }

          peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }

        function text() {
          return input.substring(peg$reportedPos, peg$currPos);
        }

        function peg$computePosDetails(pos) {
          function advance(details, startPos, endPos) {
            var p, ch;

            for (p = startPos; p < endPos; p++) {
              ch = input.charAt(p);
              if (ch === "\n") {
                if (!details.seenCR) {
                  details.line++;
                }
                details.column = 1;
                details.seenCR = false;
              } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                details.line++;
                details.column = 1;
                details.seenCR = true;
              } else {
                details.column++;
                details.seenCR = false;
              }
            }
          }

          if (peg$cachedPos !== pos) {
            if (peg$cachedPos > pos) {
              peg$cachedPos = 0;
              peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
            }
            advance(peg$cachedPosDetails, peg$cachedPos, pos);
            peg$cachedPos = pos;
          }

          return peg$cachedPosDetails;
        }

        function peg$fail(expected) {
          if (peg$currPos < peg$maxFailPos) {
            return;
          }

          if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
          }

          peg$maxFailExpected.push(expected);
        }

        function peg$buildException(message, expected, pos) {
          function cleanupExpected(expected) {
            var i = 1;

            expected.sort(function (a, b) {
              if (a.description < b.description) {
                return -1;
              } else if (a.description > b.description) {
                return 1;
              } else {
                return 0;
              }
            });

            while (i < expected.length) {
              if (expected[i - 1] === expected[i]) {
                expected.splice(i, 1);
              } else {
                i++;
              }
            }
          }

          function buildMessage(expected, found) {
            function stringEscape(s) {
              function hex(ch) {
                return ch.charCodeAt(0).toString(16).toUpperCase();
              }

              return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\x08/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
                return '\\x0' + hex(ch);
              }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
                return '\\x' + hex(ch);
              }).replace(/[\u0180-\u0FFF]/g, function (ch) {
                return "\\u0" + hex(ch);
              }).replace(/[\u1080-\uFFFF]/g, function (ch) {
                return "\\u" + hex(ch);
              });
            }

            var expectedDescs = new Array(expected.length),
                expectedDesc,
                foundDesc,
                i;

            for (i = 0; i < expected.length; i++) {
              expectedDescs[i] = expected[i].description;
            }

            expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " or " + expectedDescs[expected.length - 1] : expectedDescs[0];

            foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

            return "Expected " + expectedDesc + " but " + foundDesc + " found.";
          }

          var posDetails = peg$computePosDetails(pos),
              found = pos < input.length ? input.charAt(pos) : null;

          if (expected !== null) {
            cleanupExpected(expected);
          }

          return new SyntaxError(message !== null ? message : buildMessage(expected, found), expected, found, pos, posDetails.line, posDetails.column);
        }

        function peg$parsestart() {
          var s0, s1, s2, s3, s4, s5, s6;

          s0 = peg$currPos;
          s1 = peg$parsedeclare_line();
          if (s1 === peg$FAILED) {
            s1 = peg$c1;
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseblank_line();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseblank_line();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsenodes();
              if (s3 === peg$FAILED) {
                s3 = peg$c1;
              }
              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parseblank_line();
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parseblank_line();
                }
                if (s4 !== peg$FAILED) {
                  s5 = [];
                  s6 = peg$parse_();
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parse_();
                  }
                  if (s5 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c3(s1, s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsedeclare_line() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c4) {
            s1 = peg$c4;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c5);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parse_();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parse_();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseidentifier();
              if (s3 !== peg$FAILED) {
                s4 = peg$currPos;
                s5 = [];
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parse_();
                  }
                } else {
                  s5 = peg$c0;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseidentifier();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$currPos;
                    peg$silentFails++;
                    s8 = peg$currPos;
                    s9 = [];
                    s10 = peg$parse_();
                    while (s10 !== peg$FAILED) {
                      s9.push(s10);
                      s10 = peg$parse_();
                    }
                    if (s9 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 61) {
                        s10 = peg$c7;
                        peg$currPos++;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c8);
                        }
                      }
                      if (s10 !== peg$FAILED) {
                        s9 = [s9, s10];
                        s8 = s9;
                      } else {
                        peg$currPos = s8;
                        s8 = peg$c0;
                      }
                    } else {
                      peg$currPos = s8;
                      s8 = peg$c0;
                    }
                    peg$silentFails--;
                    if (s8 === peg$FAILED) {
                      s7 = peg$c6;
                    } else {
                      peg$currPos = s7;
                      s7 = peg$c0;
                    }
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s4;
                      s5 = peg$c9(s6);
                      s4 = s5;
                    } else {
                      peg$currPos = s4;
                      s4 = peg$c0;
                    }
                  } else {
                    peg$currPos = s4;
                    s4 = peg$c0;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$c0;
                }
                if (s4 === peg$FAILED) {
                  s4 = peg$c1;
                }
                if (s4 !== peg$FAILED) {
                  s5 = [];
                  s6 = peg$currPos;
                  s7 = [];
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      s8 = peg$parse_();
                    }
                  } else {
                    s7 = peg$c0;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsekey_value_pair();
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s6;
                      s7 = peg$c10(s8);
                      s6 = s7;
                    } else {
                      peg$currPos = s6;
                      s6 = peg$c0;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$c0;
                  }
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$currPos;
                    s7 = [];
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      while (s8 !== peg$FAILED) {
                        s7.push(s8);
                        s8 = peg$parse_();
                      }
                    } else {
                      s7 = peg$c0;
                    }
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parsekey_value_pair();
                      if (s8 !== peg$FAILED) {
                        peg$reportedPos = s6;
                        s7 = peg$c10(s8);
                        s6 = s7;
                      } else {
                        peg$currPos = s6;
                        s6 = peg$c0;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$c0;
                    }
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseeol();
                    if (s6 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c11(s3, s4, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsekey_value_pair() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

          s0 = peg$currPos;
          s1 = peg$parseidentifier();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parse_();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parse_();
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s3 = peg$c7;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c8);
                }
              }
              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parse_();
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parse_();
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$currPos;
                  s6 = [];
                  s7 = peg$currPos;
                  s8 = peg$currPos;
                  peg$silentFails++;
                  s9 = peg$parse_();
                  if (s9 === peg$FAILED) {
                    s9 = peg$parseeol();
                  }
                  peg$silentFails--;
                  if (s9 === peg$FAILED) {
                    s8 = peg$c6;
                  } else {
                    peg$currPos = s8;
                    s8 = peg$c0;
                  }
                  if (s8 !== peg$FAILED) {
                    if (input.length > peg$currPos) {
                      s9 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c12);
                      }
                    }
                    if (s9 !== peg$FAILED) {
                      s8 = [s8, s9];
                      s7 = s8;
                    } else {
                      peg$currPos = s7;
                      s7 = peg$c0;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$c0;
                  }
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$currPos;
                    s8 = peg$currPos;
                    peg$silentFails++;
                    s9 = peg$parse_();
                    if (s9 === peg$FAILED) {
                      s9 = peg$parseeol();
                    }
                    peg$silentFails--;
                    if (s9 === peg$FAILED) {
                      s8 = peg$c6;
                    } else {
                      peg$currPos = s8;
                      s8 = peg$c0;
                    }
                    if (s8 !== peg$FAILED) {
                      if (input.length > peg$currPos) {
                        s9 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c12);
                        }
                      }
                      if (s9 !== peg$FAILED) {
                        s8 = [s8, s9];
                        s7 = s8;
                      } else {
                        peg$currPos = s7;
                        s7 = peg$c0;
                      }
                    } else {
                      peg$currPos = s7;
                      s7 = peg$c0;
                    }
                  }
                  if (s6 !== peg$FAILED) {
                    s6 = input.substring(s5, peg$currPos);
                  }
                  s5 = s6;
                  if (s5 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c13(s1, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsenodes() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          s1 = peg$parsenode();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parsenode_sep();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsenode();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s3;
                s4 = peg$c14(s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parsenode_sep();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsenode();
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s3;
                  s4 = peg$c14(s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c15(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsenode() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          s1 = peg$parsenode_parent();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsenode_child();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsenode_child();
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c16(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsenode_parent() {
          var s0, s1;

          s0 = peg$currPos;
          s1 = peg$parsetag();
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c17(s1);
          }
          s0 = s1;

          return s0;
        }

        function peg$parsenode_child() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = peg$parsenode_sep();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsenode_indent();
            if (s2 !== peg$FAILED) {
              peg$reportedPos = peg$currPos;
              s3 = peg$c18(s2);
              if (s3) {
                s3 = peg$c6;
              } else {
                s3 = peg$c0;
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parsenode();
                if (s4 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c19(s2, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 === peg$FAILED) {
              s1 = peg$c1;
            }
            if (s1 !== peg$FAILED) {
              if (peg$c20.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c21);
                }
              }
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    s4 = peg$parse_();
                  }
                } else {
                  s3 = peg$c0;
                }
                if (s3 !== peg$FAILED) {
                  s4 = peg$parsenode();
                  if (s4 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c22(s2, s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }

          return s0;
        }

        function peg$parsenode_sep() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parse_();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_();
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseeol();
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parseblank_line();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseblank_line();
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c23();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsenode_indent() {
          var s0, s1;

          s0 = peg$currPos;
          s1 = peg$parseidt();
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c24(s1);
          }
          s0 = s1;

          return s0;
        }

        function peg$parsetag() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$parsetag_body();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsetag_text();
            if (s2 === peg$FAILED) {
              s2 = peg$c1;
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c25(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsetag_body() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8;

          s0 = peg$currPos;
          s1 = peg$parsenode_indent();
          if (s1 === peg$FAILED) {
            s1 = peg$c1;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsenamespace();
            if (s2 === peg$FAILED) {
              s2 = peg$c1;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseidentifier();
              if (s3 === peg$FAILED) {
                s3 = peg$c1;
              }
              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parsetag_class();
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parsetag_class();
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsetag_id();
                  if (s5 === peg$FAILED) {
                    s5 = peg$c1;
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = [];
                    s7 = peg$parsetag_class();
                    while (s7 !== peg$FAILED) {
                      s6.push(s7);
                      s7 = peg$parsetag_class();
                    }
                    if (s6 !== peg$FAILED) {
                      peg$reportedPos = peg$currPos;
                      s7 = peg$c26(s2, s3, s4, s5, s6);
                      if (s7) {
                        s7 = peg$c6;
                      } else {
                        s7 = peg$c0;
                      }
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parseattr_groups();
                        if (s8 === peg$FAILED) {
                          s8 = peg$c1;
                        }
                        if (s8 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c27(s2, s3, s4, s5, s6, s8);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 124) {
              s1 = peg$c28;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c29);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseattr_groups();
              if (s2 === peg$FAILED) {
                s2 = peg$c1;
              }
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c30(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 35) {
                s1 = peg$c31;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c32);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c33();
              }
              s0 = s1;
            }
          }

          return s0;
        }

        function peg$parsenamespace() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = peg$parseidentifier();
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s2 = peg$c34;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c35);
              }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              peg$silentFails++;
              s4 = peg$parse_();
              peg$silentFails--;
              if (s4 === peg$FAILED) {
                s3 = peg$c6;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c36(s1);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsetag_class() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 46) {
            s1 = peg$c37;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c38);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseidentifier();
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c36(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsetag_id() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 35) {
            s1 = peg$c31;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c32);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseidentifier();
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c36(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsetag_text() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parse_();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_();
          }
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s2 = peg$c37;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c38);
              }
            }
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parse_();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parse_();
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseeol();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsetag_text_lines();
                  if (s5 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c39(s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
              s2 = peg$currPos;
              peg$silentFails++;
              s3 = peg$currPos;
              if (peg$c20.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c21);
                }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
              peg$silentFails--;
              if (s3 === peg$FAILED) {
                s2 = peg$c6;
              } else {
                peg$currPos = s2;
                s2 = peg$c0;
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parsetext_to_end();
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c40(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }

          return s0;
        }

        function peg$parsetag_text_lines() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          s1 = peg$parsettl();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parseeol();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsettl();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s3;
                s4 = peg$c41(s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parseeol();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsettl();
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s3;
                  s4 = peg$c41(s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c42(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsettl() {
          var s0, s1, s2, s3, s4, s5;

          peg$silentFails++;
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = [];
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parse_();
            }
          } else {
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            s2 = input.substring(s1, peg$currPos);
          }
          s1 = s2;
          if (s1 !== peg$FAILED) {
            peg$reportedPos = peg$currPos;
            s2 = peg$c44(s1);
            if (s2) {
              s2 = peg$c6;
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsetext_to_end();
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c45(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$currPos;
            s3 = [];
            s4 = peg$parse_();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parse_();
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              peg$silentFails++;
              s5 = peg$parseeol();
              peg$silentFails--;
              if (s5 !== peg$FAILED) {
                peg$currPos = s4;
                s4 = peg$c6;
              } else {
                s4 = peg$c0;
              }
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s2;
                s3 = peg$c46(s3);
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$c0;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              s2 = input.substring(s1, peg$currPos);
            }
            s1 = s2;
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c47(s1);
            }
            s0 = s1;
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c43);
            }
          }

          return s0;
        }

        function peg$parseattr_groups() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          s1 = peg$parseattr_group();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = [];
            s5 = peg$parse_();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parse_();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseattr_group();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s3;
                s4 = peg$c48(s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = [];
              s5 = peg$parse_();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parse_();
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parseattr_group();
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s3;
                  s4 = peg$c48(s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c15(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parseattr_group() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parse_();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_();
          }
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s2 = peg$c49;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c50);
              }
            }
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parse_();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parse_();
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseattr_pairs();
                if (s4 !== peg$FAILED) {
                  s5 = [];
                  s6 = peg$parse_();
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parse_();
                  }
                  if (s5 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s6 = peg$c51;
                      peg$currPos++;
                    } else {
                      s6 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c52);
                      }
                    }
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parseattr_settings();
                      if (s7 === peg$FAILED) {
                        s7 = peg$c1;
                      }
                      if (s7 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c53(s4, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parse_();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parse_();
            }
            if (s1 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 40) {
                s2 = peg$c49;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c50);
                }
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parseeol();
                if (s3 !== peg$FAILED) {
                  s4 = peg$parseattr_lines();
                  if (s4 !== peg$FAILED) {
                    s5 = [];
                    s6 = peg$parse_();
                    while (s6 !== peg$FAILED) {
                      s5.push(s6);
                      s6 = peg$parse_();
                    }
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parseeol();
                      if (s6 !== peg$FAILED) {
                        s7 = peg$currPos;
                        s8 = [];
                        s9 = peg$parse_();
                        while (s9 !== peg$FAILED) {
                          s8.push(s9);
                          s9 = peg$parse_();
                        }
                        if (s8 !== peg$FAILED) {
                          s8 = input.substring(s7, peg$currPos);
                        }
                        s7 = s8;
                        if (s7 !== peg$FAILED) {
                          peg$reportedPos = peg$currPos;
                          s8 = peg$c54(s4, s7);
                          if (s8) {
                            s8 = peg$c6;
                          } else {
                            s8 = peg$c0;
                          }
                          if (s8 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 41) {
                              s9 = peg$c51;
                              peg$currPos++;
                            } else {
                              s9 = peg$FAILED;
                              if (peg$silentFails === 0) {
                                peg$fail(peg$c52);
                              }
                            }
                            if (s9 !== peg$FAILED) {
                              s10 = peg$parseattr_settings();
                              if (s10 === peg$FAILED) {
                                s10 = peg$c1;
                              }
                              if (s10 !== peg$FAILED) {
                                peg$reportedPos = s0;
                                s1 = peg$c55(s4, s7, s10);
                                s0 = s1;
                              } else {
                                peg$currPos = s0;
                                s0 = peg$c0;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }

          return s0;
        }

        function peg$parseattr_lines() {
          var s0, s1, s2, s3, s4, s5, s6;

          s0 = peg$currPos;
          s1 = peg$parseattr_line();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = [];
            s5 = peg$parse_();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parse_();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseeol();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseattr_line();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s3;
                  s4 = peg$c56(s6);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = [];
              s5 = peg$parse_();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parse_();
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parseeol();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseattr_line();
                  if (s6 !== peg$FAILED) {
                    peg$reportedPos = s3;
                    s4 = peg$c56(s6);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c57(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parseattr_line() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = [];
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parse_();
            }
          } else {
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            s2 = input.substring(s1, peg$currPos);
          }
          s1 = s2;
          if (s1 !== peg$FAILED) {
            peg$reportedPos = peg$currPos;
            s2 = peg$c58(s1);
            if (s2) {
              s2 = peg$c6;
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseattr_pairs();
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c59(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parseattr_pairs() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parseattr_pair();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = [];
            s5 = peg$parse_();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parse_();
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s5 = peg$c60;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c61);
                }
              }
              if (s5 === peg$FAILED) {
                s5 = peg$c1;
              }
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parse_();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parse_();
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseattr_pair();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s3;
                    s4 = peg$c62(s7);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = [];
              s5 = peg$parse_();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parse_();
              }
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s5 = peg$c60;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c61);
                  }
                }
                if (s5 === peg$FAILED) {
                  s5 = peg$c1;
                }
                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$parse_();
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parse_();
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseattr_pair();
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s3;
                      s4 = peg$c62(s7);
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$c0;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c15(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parseattr_pair() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parsenamespace();
          if (s1 === peg$FAILED) {
            s1 = peg$c1;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseattr_key();
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              s4 = [];
              s5 = peg$parse_();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parse_();
              }
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 61) {
                  s5 = peg$c7;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c8);
                  }
                }
                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$parse_();
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parse_();
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseattr_values();
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s3;
                      s4 = peg$c63(s7);
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$c0;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c64(s1, s2, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = [];
            s3 = peg$parse_();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parse_();
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseattr_values();
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s1;
                s2 = peg$c63(s3);
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$c0;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c0;
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c65(s1);
            }
            s0 = s1;
          }

          return s0;
        }

        function peg$parseattr_settings() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parse_();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_();
          }
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 38) {
              s2 = peg$c66;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c67);
              }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              peg$silentFails++;
              s4 = peg$currPos;
              s5 = [];
              if (peg$c68.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c69);
                }
              }
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                if (peg$c68.test(input.charAt(peg$currPos))) {
                  s6 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c69);
                  }
                }
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 59) {
                  s6 = peg$c70;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c71);
                  }
                }
                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c0;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
              peg$silentFails--;
              if (s4 === peg$FAILED) {
                s3 = peg$c6;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parse_();
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parse_();
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseidentifier();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 40) {
                      s7 = peg$c49;
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c50);
                      }
                    }
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parseattr_pairs();
                      if (s8 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                          s9 = peg$c51;
                          peg$currPos++;
                        } else {
                          s9 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c52);
                          }
                        }
                        if (s9 !== peg$FAILED) {
                          peg$reportedPos = s6;
                          s7 = peg$c72(s8);
                          s6 = s7;
                        } else {
                          peg$currPos = s6;
                          s6 = peg$c0;
                        }
                      } else {
                        peg$currPos = s6;
                        s6 = peg$c0;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$c0;
                    }
                    if (s6 === peg$FAILED) {
                      s6 = peg$c1;
                    }
                    if (s6 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c73(s5, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parseattr_key() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parseeol();
          if (s4 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s4 = peg$c7;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }
            if (s4 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s4 = peg$c51;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c52);
                }
              }
              if (s4 === peg$FAILED) {
                s4 = peg$parse_();
              }
            }
          }
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = peg$c6;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c12);
              }
            }
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$currPos;
              s3 = peg$currPos;
              peg$silentFails++;
              s4 = peg$parseeol();
              if (s4 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 61) {
                  s4 = peg$c7;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c8);
                  }
                }
                if (s4 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s4 = peg$c51;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c52);
                    }
                  }
                  if (s4 === peg$FAILED) {
                    s4 = peg$parse_();
                  }
                }
              }
              peg$silentFails--;
              if (s4 === peg$FAILED) {
                s3 = peg$c6;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
              if (s3 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c12);
                  }
                }
                if (s4 !== peg$FAILED) {
                  s3 = [s3, s4];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$c0;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c0;
              }
            }
          } else {
            s1 = peg$c0;
          }
          if (s1 !== peg$FAILED) {
            s1 = input.substring(s0, peg$currPos);
          }
          s0 = s1;

          return s0;
        }

        function peg$parseattr_values() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parseattr_value();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = [];
            s5 = peg$parse_();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parse_();
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 43) {
                s5 = peg$c74;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c75);
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parse_();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parse_();
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseattr_value();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s3;
                    s4 = peg$c76(s7);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = [];
              s5 = peg$parse_();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parse_();
              }
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 43) {
                  s5 = peg$c74;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c75);
                  }
                }
                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$parse_();
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parse_();
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseattr_value();
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s3;
                      s4 = peg$c76(s7);
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$c0;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c15(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parseattr_value() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          s1 = peg$parsequoted_string();
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c77(s1);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parsenumber();
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c78(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseboolean();
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c79(s1);
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                s2 = peg$parseidentifier();
                if (s2 !== peg$FAILED) {
                  s2 = input.substring(s1, peg$currPos);
                }
                s1 = s2;
                if (s1 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 40) {
                    s2 = peg$c49;
                    peg$currPos++;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c50);
                    }
                  }
                  if (s2 !== peg$FAILED) {
                    s3 = peg$parseattr_pairs();
                    if (s3 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 41) {
                        s4 = peg$c51;
                        peg$currPos++;
                      } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c52);
                        }
                      }
                      if (s4 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c80(s1, s3);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = peg$currPos;
                  s2 = [];
                  s3 = peg$currPos;
                  s4 = peg$currPos;
                  peg$silentFails++;
                  s5 = peg$parseeol();
                  if (s5 === peg$FAILED) {
                    s5 = peg$parse_();
                    if (s5 === peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 41) {
                        s5 = peg$c51;
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c52);
                        }
                      }
                      if (s5 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 43) {
                          s5 = peg$c74;
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c75);
                          }
                        }
                      }
                    }
                  }
                  peg$silentFails--;
                  if (s5 === peg$FAILED) {
                    s4 = peg$c6;
                  } else {
                    peg$currPos = s4;
                    s4 = peg$c0;
                  }
                  if (s4 !== peg$FAILED) {
                    if (input.length > peg$currPos) {
                      s5 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c12);
                      }
                    }
                    if (s5 !== peg$FAILED) {
                      s4 = [s4, s5];
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$c0;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                  if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                      s2.push(s3);
                      s3 = peg$currPos;
                      s4 = peg$currPos;
                      peg$silentFails++;
                      s5 = peg$parseeol();
                      if (s5 === peg$FAILED) {
                        s5 = peg$parse_();
                        if (s5 === peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 41) {
                            s5 = peg$c51;
                            peg$currPos++;
                          } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$c52);
                            }
                          }
                          if (s5 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 43) {
                              s5 = peg$c74;
                              peg$currPos++;
                            } else {
                              s5 = peg$FAILED;
                              if (peg$silentFails === 0) {
                                peg$fail(peg$c75);
                              }
                            }
                          }
                        }
                      }
                      peg$silentFails--;
                      if (s5 === peg$FAILED) {
                        s4 = peg$c6;
                      } else {
                        peg$currPos = s4;
                        s4 = peg$c0;
                      }
                      if (s4 !== peg$FAILED) {
                        if (input.length > peg$currPos) {
                          s5 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c12);
                          }
                        }
                        if (s5 !== peg$FAILED) {
                          s4 = [s4, s5];
                          s3 = s4;
                        } else {
                          peg$currPos = s3;
                          s3 = peg$c0;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$c0;
                      }
                    }
                  } else {
                    s2 = peg$c0;
                  }
                  if (s2 !== peg$FAILED) {
                    s2 = input.substring(s1, peg$currPos);
                  }
                  s1 = s2;
                  if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c81(s1);
                  }
                  s0 = s1;
                }
              }
            }
          }

          return s0;
        }

        function peg$parseblank_line() {
          var s0, s1, s2;

          peg$silentFails++;
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parse_();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_();
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseeol();
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c82);
            }
          }

          return s0;
        }

        function peg$parsetext_to_end() {
          var s0, s1, s2, s3, s4;

          peg$silentFails++;
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parseeol();
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = peg$c6;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c12);
              }
            }
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$currPos;
              s3 = peg$currPos;
              peg$silentFails++;
              s4 = peg$parseeol();
              peg$silentFails--;
              if (s4 === peg$FAILED) {
                s3 = peg$c6;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
              if (s3 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c12);
                  }
                }
                if (s4 !== peg$FAILED) {
                  s3 = [s3, s4];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$c0;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c0;
              }
            }
          } else {
            s1 = peg$c0;
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c84();
          }
          s0 = s1;
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c83);
            }
          }

          return s0;
        }

        function peg$parseidentifier() {
          var s0, s1, s2, s3, s4;

          peg$silentFails++;
          s0 = peg$currPos;
          if (peg$c86.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c87);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = [];
            if (peg$c88.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c89);
              }
            }
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c88.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c89);
                }
              }
            }
            if (s3 !== peg$FAILED) {
              s3 = input.substring(s2, peg$currPos);
            }
            s2 = s3;
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c90(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c85);
            }
          }

          return s0;
        }

        function peg$parseeol() {
          var s0;

          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 10) {
            s0 = peg$c92;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c93);
            }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 13) {
              s0 = peg$c94;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c95);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c96) {
                s0 = peg$c96;
                peg$currPos += 2;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c97);
                }
              }
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            if (peg$silentFails === 0) {
              peg$fail(peg$c91);
            }
          }

          return s0;
        }

        function peg$parse_() {
          var s0;

          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 9) {
            s0 = peg$c99;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c100);
            }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 32) {
              s0 = peg$c101;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c102);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 11) {
                s0 = peg$c103;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c104);
                }
              }
              if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 12) {
                  s0 = peg$c105;
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c106);
                  }
                }
              }
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            if (peg$silentFails === 0) {
              peg$fail(peg$c98);
            }
          }

          return s0;
        }

        function peg$parseidt() {
          var s0, s1, s2, s3;

          peg$silentFails++;
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = [];
          if (input.charCodeAt(peg$currPos) === 32) {
            s3 = peg$c101;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c102);
            }
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (input.charCodeAt(peg$currPos) === 32) {
                s3 = peg$c101;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c102);
                }
              }
            }
          } else {
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            s2 = input.substring(s1, peg$currPos);
          }
          s1 = s2;
          if (s1 !== peg$FAILED) {
            peg$reportedPos = peg$currPos;
            s2 = peg$c108(s1);
            if (s2) {
              s2 = peg$c6;
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c109(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = [];
            if (input.charCodeAt(peg$currPos) === 9) {
              s3 = peg$c99;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c100);
              }
            }
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (input.charCodeAt(peg$currPos) === 9) {
                  s3 = peg$c99;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c100);
                  }
                }
              }
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              s2 = input.substring(s1, peg$currPos);
            }
            s1 = s2;
            if (s1 !== peg$FAILED) {
              peg$reportedPos = peg$currPos;
              s2 = peg$c110(s1);
              if (s2) {
                s2 = peg$c6;
              } else {
                s2 = peg$c0;
              }
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c111(s1);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c107);
            }
          }

          return s0;
        }

        function peg$parsequoted_string() {
          var s0, s1, s2, s3, s4;

          peg$silentFails++;
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c113;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c114);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = [];
            s4 = peg$parsedqs();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parsedqs();
            }
            if (s3 !== peg$FAILED) {
              s3 = input.substring(s2, peg$currPos);
            }
            s2 = s3;
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 34) {
                s3 = peg$c113;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c114);
                }
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c115(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 39) {
              s1 = peg$c116;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c117);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$currPos;
              s3 = [];
              s4 = peg$parsesqs();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parsesqs();
              }
              if (s3 !== peg$FAILED) {
                s3 = input.substring(s2, peg$currPos);
              }
              s2 = s3;
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 39) {
                  s3 = peg$c116;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c117);
                  }
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c115(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c112);
            }
          }

          return s0;
        }

        function peg$parsedqs() {
          var s0, s1, s2;

          peg$silentFails++;
          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 34) {
            s2 = peg$c113;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c114);
            }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 92) {
              s2 = peg$c119;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c120);
              }
            }
            if (s2 === peg$FAILED) {
              s2 = peg$parseeol();
            }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = peg$c6;
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
          if (s1 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c12);
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c121();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s1 = peg$c119;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c120);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseec();
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c122(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c118);
            }
          }

          return s0;
        }

        function peg$parsesqs() {
          var s0, s1, s2;

          peg$silentFails++;
          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 39) {
            s2 = peg$c116;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c117);
            }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 92) {
              s2 = peg$c119;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c120);
              }
            }
            if (s2 === peg$FAILED) {
              s2 = peg$parseeol();
            }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = peg$c6;
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
          if (s1 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c12);
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c121();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s1 = peg$c119;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c120);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseec();
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c122(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c123);
            }
          }

          return s0;
        }

        function peg$parseec() {
          var s0, s1, s2, s3;

          peg$silentFails++;
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 48) {
            s1 = peg$c125;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c126);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            peg$silentFails++;
            if (peg$c127.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c128);
              }
            }
            peg$silentFails--;
            if (s3 === peg$FAILED) {
              s2 = peg$c6;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c129();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s0 = peg$c113;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c114);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 39) {
                s0 = peg$c116;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c117);
                }
              }
              if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 92) {
                  s0 = peg$c119;
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c120);
                  }
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (peg$c130.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c131);
                    }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c132(s1);
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 98) {
                      s1 = peg$c133;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c134);
                      }
                    }
                    if (s1 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c135();
                    }
                    s0 = s1;
                  }
                }
              }
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c124);
            }
          }

          return s0;
        }

        function peg$parseboolean() {
          var s0, s1;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 4) === peg$c136) {
            s1 = peg$c136;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c137);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c138();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c139) {
              s1 = peg$c139;
              peg$currPos += 5;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c140);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c141();
            }
            s0 = s1;
          }

          return s0;
        }

        function peg$parsenumber() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (peg$c142.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c143);
            }
          }
          if (s1 === peg$FAILED) {
            s1 = peg$c1;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsenumber_def();
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c144(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        function peg$parsenumber_def() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2).toLowerCase() === peg$c145) {
            s1 = input.substr(peg$currPos, 2);
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c146);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c147.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c148);
              }
            }
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c147.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c148);
                  }
                }
              }
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c149();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 48) {
              s1 = peg$c125;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c126);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              if (peg$c150.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c151);
                }
              }
              if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  if (peg$c150.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c151);
                    }
                  }
                }
              } else {
                s2 = peg$c0;
              }
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c152();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseint();
              if (s1 === peg$FAILED) {
                s1 = peg$c1;
              }
              if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 46) {
                  s2 = peg$c37;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c38);
                  }
                }
                if (s2 !== peg$FAILED) {
                  s3 = [];
                  if (peg$c127.test(input.charAt(peg$currPos))) {
                    s4 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c128);
                    }
                  }
                  if (s4 !== peg$FAILED) {
                    while (s4 !== peg$FAILED) {
                      s3.push(s4);
                      if (peg$c127.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c128);
                        }
                      }
                    }
                  } else {
                    s3 = peg$c0;
                  }
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parseexponent();
                    if (s4 === peg$FAILED) {
                      s4 = peg$c1;
                    }
                    if (s4 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c153();
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseint();
                if (s1 !== peg$FAILED) {
                  s2 = peg$parseexponent();
                  if (s2 === peg$FAILED) {
                    s2 = peg$c1;
                  }
                  if (s2 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c153();
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              }
            }
          }

          return s0;
        }

        function peg$parseint() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          if (peg$c154.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c155);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c127.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c128);
              }
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (peg$c127.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c128);
                }
              }
            }
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 48) {
              s0 = peg$c125;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c126);
              }
            }
          }

          return s0;
        }

        function peg$parseexponent() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 1).toLowerCase() === peg$c156) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c157);
            }
          }
          if (s1 !== peg$FAILED) {
            if (peg$c142.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c143);
              }
            }
            if (s2 === peg$FAILED) {
              s2 = peg$c1;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseint();
              if (s3 !== peg$FAILED) {
                s1 = [s1, s2, s3];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }

          return s0;
        }

        var IDT = 0,
            IDT_TOK = null,
            Tag = options.Tag,
            Declaration = options.Declaration,
            Attribute = options.Attribute,
            parents = [],
            parent = function parent() {
          return parents[parents.length - 1];
        };

        peg$result = peg$startRuleFunction();

        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
          return peg$result;
        } else {
          if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail({ type: "end", description: "end of input" });
          }

          throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
        }
      }

      return {
        SyntaxError: SyntaxError,
        parse: parse
      };
    }();

    var tag = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var Tag = exports.Tag = function () {
            function Tag(indent, name, namespace, dots, hash, groups) {
                _classCallCheck(this, Tag);

                this._indent = indent;
                this._name = name;
                this._namespace = namespace || '';
                this._dots = dots || [];
                this._hash = hash || '';

                this._children = [];
                this._inlineChar = '';
                this._inlines = [];
                this._attributeGroups = null;

                if (groups) {
                    var gs = groups.filter(function (g) {
                        return !!g.setting;
                    });
                    if (gs.length < groups.length) {
                        gs.push(groups.filter(function (g) {
                            return !g.setting;
                        }).reduce(function (acc, item) {
                            return acc.merge(item) && acc;
                        }));
                    }
                    this._attributeGroups = gs;
                }
            }

            _createClass(Tag, [{
                key: 'type',
                get: function get() {
                    return 'tag';
                }
            }, {
                key: 'indent',
                get: function get() {
                    return this._indent;
                }
            }, {
                key: 'name',
                get: function get() {
                    return this._name;
                }
            }, {
                key: 'namespace',
                get: function get() {
                    return this._namespace;
                }
            }, {
                key: 'hash',
                get: function get() {
                    return this._hash;
                }
            }, {
                key: 'dots',
                get: function get() {
                    return this._dots;
                }
            }, {
                key: 'attributeGroups',
                get: function get() {
                    return this._attributeGroups;
                }
            }, {
                key: 'text',
                get: function get() {
                    return this._text || [];
                },
                set: function set(t) {
                    this._text = t || [];
                }
            }, {
                key: 'inlineChar',
                get: function get() {
                    return this._inlineChar;
                },
                set: function set(inlineChar) {
                    this._inlineChar = inlineChar;
                }
            }, {
                key: 'children',
                get: function get() {
                    return this._children;
                },
                set: function set(children) {
                    if (children.length === 1 && children[0].inlineChar) {
                        var child = children[0];
                        this._inlines = child._inlines ? children.concat(child._inlines) : children;
                        child._inlines = [];
                    } else {
                        this._children = children;
                    }
                }
            }, {
                key: 'inlines',
                get: function get() {
                    return this._inlines;
                }
            }, {
                key: 'parent',
                get: function get() {
                    return this._parent;
                },
                set: function set(parent) {
                    this._parent = parent;
                }
            }, {
                key: 'firstAttribute',
                get: function get() {
                    if (!this._attributeGroups || this._attributeGroups.length < 1) return null;
                    return this._attributeGroups[0].attributes[0];
                }
            }]);

            return Tag;
        }();
    });

    unwrapExports(tag);
    var tag_1 = tag.Tag;

    var declaration = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var Declaration = exports.Declaration = function () {
            function Declaration(name, ext, pairs) {
                var _this = this;

                _classCallCheck(this, Declaration);

                this._name = name;
                this._options = {};
                this._extension = ext;

                pairs.map(function (item) {
                    return _this._options[item.key] = item.value;
                });
            }

            _createClass(Declaration, [{
                key: "option",
                value: function option(key) {
                    return this._options[key];
                }
            }, {
                key: "name",
                get: function get() {
                    return this._name;
                }
            }, {
                key: "extension",
                get: function get() {
                    return this._extension;
                }
            }]);

            return Declaration;
        }();
    });

    unwrapExports(declaration);
    var declaration_1 = declaration.Declaration;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    var inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };

    var possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };

    var attribute = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var Attribute = exports.Attribute = function () {
            function Attribute(name, value, namespace) {
                _classCallCheck(this, Attribute);

                this._name = name;
                this._value = value;
                this._namespace = namespace || '';
            }

            _createClass(Attribute, [{
                key: 'type',
                get: function get$$1() {
                    return 'attribute';
                }
            }, {
                key: 'name',
                get: function get$$1() {
                    return this._name;
                }
            }, {
                key: 'value',
                get: function get$$1() {
                    return this._value;
                }
            }, {
                key: 'namespace',
                get: function get$$1() {
                    return this._namespace;
                }
            }, {
                key: 'minor',
                get: function get$$1() {
                    if (!this._name && this._value.length === 1 && this._value[0].minor === 'identifier') {
                        return this._value[0].value;
                    }
                    return null;
                }
            }, {
                key: 'major',
                set: function set$$1(m) {
                    this._major = m;
                    this._value.forEach(function (v) {
                        return v.major = m;
                    }); // eslint-disable-line no-param-reassign
                },
                get: function get$$1() {
                    return this._major;
                }
            }]);

            return Attribute;
        }();

        var AttributeContainer = function () {
            function AttributeContainer(attributes, major) {
                _classCallCheck(this, AttributeContainer);

                this._attributes = attributes;
                attributes.forEach(function (attr) {
                    return attr.major = major;
                }); // eslint-disable-line no-param-reassign
            }

            _createClass(AttributeContainer, [{
                key: 'attributes',
                get: function get$$1() {
                    return this._attributes;
                }
            }]);

            return AttributeContainer;
        }();

        Attribute.Setting = function (_AttributeContainer) {
            _inherits(Settings, _AttributeContainer);

            function Settings(name, attributes) {
                _classCallCheck(this, Settings);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Settings).call(this, attributes, 'setting'));

                _this._name = name;
                return _this;
            }

            _createClass(Settings, [{
                key: 'type',
                get: function get$$1() {
                    return 'setting';
                }
            }, {
                key: 'name',
                get: function get$$1() {
                    return this._name;
                }
            }]);

            return Settings;
        }(AttributeContainer);

        function _merge(target, source) {
            source.forEach(function (item) {
                var attr = target.find(function (i) {
                    return i.name && i.name === item.name;
                });
                attr ? attr._value = attr._value.concat(item._value) : target.push(item);
            });
            return target;
        }

        Attribute.Group = function (_AttributeContainer2) {
            _inherits(Group, _AttributeContainer2);

            function Group(attributes, setting) {
                _classCallCheck(this, Group);

                var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this, _merge([], attributes)));

                _this2._setting = setting;
                return _this2;
            }

            _createClass(Group, [{
                key: 'merge',
                value: function merge(group) {
                    if (group.setting) return false;
                    _merge(this._attributes, group._attributes);
                    return true;
                }
            }, {
                key: 'type',
                get: function get$$1() {
                    return 'group';
                }
            }, {
                key: 'setting',
                get: function get$$1() {
                    return this._setting;
                }
            }]);

            return Group;
        }(AttributeContainer);

        var Value = function () {
            function Value() {
                _classCallCheck(this, Value);
            }

            _createClass(Value, [{
                key: 'type',
                get: function get$$1() {
                    return 'value';
                }
            }, {
                key: 'minor',
                get: function get$$1() {
                    return this._minor;
                }
            }, {
                key: 'value',
                get: function get$$1() {
                    return this._value;
                }
            }, {
                key: 'major',
                get: function get$$1() {
                    return this._major;
                },
                set: function set$$1(m) {
                    this._major = m;
                }
            }]);

            return Value;
        }();

        Attribute.Quoted = function (_Value) {
            _inherits(Quoted, _Value);

            function Quoted(value) {
                _classCallCheck(this, Quoted);

                var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Quoted).call(this));

                _this3._value = value;
                _this3._minor = 'quoted';
                return _this3;
            }

            return Quoted;
        }(Value);

        Attribute.Number = function (_Value2) {
            _inherits(Number, _Value2);

            function Number(value) {
                _classCallCheck(this, Number);

                var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Number).call(this));

                _this4._value = value;
                _this4._minor = 'number';
                return _this4;
            }

            return Number;
        }(Value);

        Attribute.Boolean = function (_Value3) {
            _inherits(Boolean, _Value3);

            function Boolean(value) {
                _classCallCheck(this, Boolean);

                var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Boolean).call(this));

                _this5._value = value;
                _this5._minor = 'boolean';
                return _this5;
            }

            return Boolean;
        }(Value);

        Attribute.Identifier = function (_Value4) {
            _inherits(Identifier, _Value4);

            function Identifier(value) {
                _classCallCheck(this, Identifier);

                var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Identifier).call(this));

                _this6._value = value;
                _this6._minor = 'identifier';
                return _this6;
            }

            return Identifier;
        }(Value);

        Attribute.Helper = function (_Value5) {
            _inherits(Helper, _Value5);

            function Helper(name, attributes) {
                _classCallCheck(this, Helper);

                var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Helper).call(this));

                _this7._value = '';
                _this7._attributes = attributes;
                _this7._minor = 'helper';
                _this7._name = name;

                attributes.forEach(function (attr) {
                    return attr.major = 'helper';
                }); // eslint-disable-line no-param-reassign
                return _this7;
            }

            _createClass(Helper, [{
                key: 'name',
                get: function get$$1() {
                    return this._name;
                }
            }, {
                key: 'attributes',
                get: function get$$1() {
                    return this._attributes;
                }
            }]);

            return Helper;
        }(Value);
    });

    unwrapExports(attribute);
    var attribute_1 = attribute.Attribute;

    var tag$2 = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.TagCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var TagCompiler = exports.TagCompiler = function () {
            function TagCompiler() {
                _classCallCheck(this, TagCompiler);
            }

            _createClass(TagCompiler, [{
                key: 'walk',
                value: function walk(context, tag) {
                    var ctx = context;
                    var haveInlineChild = false;
                    tag.children.forEach(function (item) {
                        return context.sub(item);
                    });

                    tag.inlines.forEach(function (item, i) {
                        if (item.inlineChar === '>' || item.inlineChar === ':') {
                            ctx = ctx.sub(item, -1);
                            haveInlineChild = true;
                        } else if (item.inlineChar === '+') {
                            ctx = ctx.parent.sub(item, -1);
                        } else if (item.inlineChar === '<' && haveInlineChild) {
                            ctx = ctx.parent.parent.sub(item, ctx.parent.parent === context ? -1 : 0);
                            haveInlineChild = false;
                        } else {
                            throw new Error('Invalid inline char: ' + item.inlineChar + ' in Tag: ' + item.name);
                        }

                        if (i === tag.length) item.children.forEach(function (ii) {
                            return ctx.sub(ii);
                        });
                    });
                }
            }, {
                key: 'compile',
                value: function compile(context, tag) {
                    this.tagOpen(context, tag);
                    this.content(context, tag);
                    this.tagClose(context, tag);
                }
            }, {
                key: 'tagOpen',
                value: function tagOpen(context, tag) {
                    this.openStart(context, tag);
                    this.openEnd(context, tag);
                }
            }, {
                key: 'openStart',
                value: function openStart(context, tag) {
                    this.startIndent(context, tag);
                    this.tagStart(context, tag);
                    this.attributes(context, tag);
                }
            }, {
                key: 'startIndent',
                value: function startIndent(context, tag) {
                    if (!tag.inlineChar) context.eol().indent();
                }
            }, {
                key: 'tagName',
                value: function tagName(context, tag) {
                    var name = tag.name || 'div';
                    return tag.namespace ? tag.namespace + ':' + name : name;
                }
            }, {
                key: 'tagStart',
                value: function tagStart(context, tag) {
                    context.push('<').push(this.tagName(context, tag));
                }
            }, {
                key: 'attributes',
                value: function attributes(context, tag) {
                    var note = context.getNote('attribute');
                    this.hashDots(context, tag, note);

                    tag.attributeGroups && tag.attributeGroups.forEach(function (group) {
                        context.getCompiler(group).compile(context, group, tag, note);
                    });

                    note.each(function (key, value) {
                        return context.push(value === null ? ' ' + key : ' ' + key + '="' + value + '"');
                    });
                    note.clear();
                }
            }, {
                key: 'hashDots',
                value: function hashDots(context, tag, note) {
                    if (!tag.hash && tag.dots.length === 0) return;

                    var attributes = [];
                    if (tag.hash) {
                        var value = [new attribute.Attribute.Quoted(tag.hash)];
                        attributes.push(new attribute.Attribute('id', value));
                    }

                    if (tag.dots.length > 0) {
                        var _value = tag.dots.map(function (item) {
                            return new attribute.Attribute.Quoted(item);
                        });
                        attributes.push(new attribute.Attribute('class', _value));
                    }

                    var group = new attribute.Attribute.Group(attributes);
                    context.getCompiler(group).compile(context, group, tag, note);
                }
            }, {
                key: 'openEnd',
                value: function openEnd(context, tag) {
                    context.push(this.selfClosing(context, tag) ? '/>' : '>');
                }
            }, {
                key: 'selfClosing',
                value: function selfClosing() {
                    return false;
                }
            }, {
                key: 'content',
                value: function content(context, tag) {
                    this.text(context, tag);
                    context.compileChildren();
                }
            }, {
                key: 'text',
                value: function text(context, tag) {
                    var ctx = context;
                    if (tag.text.length === 0) return;

                    if (tag.text.length === 1) {
                        ctx.push(tag.text[0]);
                        return;
                    }

                    var indented = ctx.parent.containsIndent;
                    var idt = tag.inlineChar ? 1 : 0;
                    tag.text.forEach(function (item) {
                        if (!item) {
                            ctx.eol();
                            return;
                        }
                        ctx.eol().indent(idt + 1).push(item);
                    });
                    ctx.eol().indent(idt);
                    ctx.parent.containsIndent = indented;
                }
            }, {
                key: 'tagClose',
                value: function tagClose(context, tag) {
                    if (this.selfClosing(context, tag)) return;
                    if (context.containsIndent && tag.inlines.length === 0) {
                        context.eol().indent();
                    }

                    this.closeStart(context, tag);
                    this.closeEnd(context, tag);
                }
            }, {
                key: 'closeStart',
                value: function closeStart(context, tag) {
                    context.push('</').push(this.tagName(context, tag));
                }
            }, {
                key: 'closeEnd',
                value: function closeEnd(context) {
                    context.push('>');
                }
            }]);

            return TagCompiler;
        }();
    });

    unwrapExports(tag$2);
    var tag_1$1 = tag$2.TagCompiler;

    var group = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var GroupCompiler = exports.GroupCompiler = function () {
            function GroupCompiler() {
                _classCallCheck(this, GroupCompiler);
            }

            _createClass(GroupCompiler, [{
                key: "compile",
                value: function compile(context, group, tag, note) {
                    if (group.setting) {
                        context.getCompiler(group.setting).compile(context, group, tag, note);
                        return;
                    }
                    group.attributes.forEach(function (attr) {
                        context.getCompiler(attr).compile(context, attr, group, tag, note);
                    });
                }
            }]);

            return GroupCompiler;
        }();
    });

    unwrapExports(group);
    var group_1 = group.GroupCompiler;

    var attribute$2 = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var AttributeCompiler = exports.AttributeCompiler = function () {
            function AttributeCompiler() {
                var joiner = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
                var booleanAttribute = arguments[1];

                _classCallCheck(this, AttributeCompiler);

                this._joiner = joiner;
                this._booleanAttribute = booleanAttribute;
            }

            _createClass(AttributeCompiler, [{
                key: 'compile',
                value: function compile(context, attribute, group, tag, note) {
                    var value = this.getValue(context, attribute.value, attribute, group, tag);
                    var name = attribute.name;

                    if (this._booleanAttribute) {
                        name = name || value;
                        note.set(name, null);
                        return;
                    }

                    if (!name) name = value;
                    if (note.get(name)) value = note.get(name) + this.joiner + value;
                    note.set(name, value);
                }
            }, {
                key: 'getValue',
                value: function getValue(context, value, attribute, group, tag) {
                    if (!value) return null;
                    return value.map(function (v) {
                        return context.getCompiler(v).compile(context, v, attribute, group, tag);
                    }).join(this.joiner);
                }
            }, {
                key: 'joiner',
                get: function get() {
                    return this._joiner;
                }
            }]);

            return AttributeCompiler;
        }();
    });

    unwrapExports(attribute$2);
    var attribute_1$1 = attribute$2.AttributeCompiler;

    var value = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var ValueCompiler = exports.ValueCompiler = function () {
            function ValueCompiler() {
                _classCallCheck(this, ValueCompiler);
            }

            _createClass(ValueCompiler, [{
                key: "compile",
                value: function compile(context, value) {
                    return value.value;
                }
            }]);

            return ValueCompiler;
        }();
    });

    unwrapExports(value);
    var value_1 = value.ValueCompiler;

    var setting = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var SettingCompiler = exports.SettingCompiler = function () {
            function SettingCompiler() {
                _classCallCheck(this, SettingCompiler);
            }

            _createClass(SettingCompiler, [{
                key: "compile",
                value: function compile(context, group, tag, note) {
                    group.attributes.forEach(function (attr) {
                        context.getCompiler(attr).compile(context, attr, group, tag, note);
                    });
                }
            }]);

            return SettingCompiler;
        }();
    });

    unwrapExports(setting);
    var setting_1 = setting.SettingCompiler;

    var textTag = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.TextTagCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        var escapeHtml = function escapeHtml(string) {
            return string.replace(/[&<>"'`=\/]/g, function (s) {
                return map[s];
            });
        };

        var TextTagCompiler = exports.TextTagCompiler = function (_TagCompiler) {
            _inherits(TextTagCompiler, _TagCompiler);

            function TextTagCompiler() {
                _classCallCheck(this, TextTagCompiler);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(TextTagCompiler).apply(this, arguments));
            }

            _createClass(TextTagCompiler, [{
                key: 'compile',
                value: function compile(context, tag) {
                    if (tag.text.length === 0) return;

                    var escape = tag.firstAttribute;
                    escape && (escape = escape.value[0].value === 'escape');

                    context.eol();
                    tag.text.forEach(function (item) {
                        if (!item) {
                            context.eol();
                            return;
                        }
                        context.indent().push(escape ? escapeHtml(item) : item).eol();
                    });
                    context.pop();
                }
            }]);

            return TextTagCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(textTag);
    var textTag_1 = textTag.TextTagCompiler;

    var comment = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.CommentCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var CommentCompiler = exports.CommentCompiler = function (_TagCompiler) {
            _inherits(CommentCompiler, _TagCompiler);

            function CommentCompiler() {
                _classCallCheck(this, CommentCompiler);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(CommentCompiler).apply(this, arguments));
            }

            _createClass(CommentCompiler, [{
                key: 'tagStart',
                value: function tagStart(context, tag) {
                    context.push('<!--');
                    if (tag.text.length === 1) context.push(' ');
                }
            }, {
                key: 'openEnd',
                value: function openEnd() {}
            }, {
                key: 'closeStart',
                value: function closeStart(context, tag) {
                    if (tag.text.length === 1) context.push(' ');
                    context.push('-->');
                }
            }, {
                key: 'closeEnd',
                value: function closeEnd() {}
            }]);

            return CommentCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(comment);
    var comment_1 = comment.CommentCompiler;

    var emptyTag = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.EmptyTagCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var EmptyTagCompiler = exports.EmptyTagCompiler = function (_TagCompiler) {
            _inherits(EmptyTagCompiler, _TagCompiler);

            function EmptyTagCompiler() {
                _classCallCheck(this, EmptyTagCompiler);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(EmptyTagCompiler).apply(this, arguments));
            }

            _createClass(EmptyTagCompiler, [{
                key: 'selfClosing',
                value: function selfClosing() {
                    return true;
                }
            }, {
                key: 'content',
                value: function content() {}
            }]);

            return EmptyTagCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(emptyTag);
    var emptyTag_1 = emptyTag.EmptyTagCompiler;

    var ieif = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.IeifCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var IeifCompiler = exports.IeifCompiler = function (_TagCompiler) {
            _inherits(IeifCompiler, _TagCompiler);

            function IeifCompiler(closeIt) {
                _classCallCheck(this, IeifCompiler);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IeifCompiler).call(this));

                _this.closeIt = closeIt;
                return _this;
            }

            _createClass(IeifCompiler, [{
                key: 'tagStart',
                value: function tagStart(context) {
                    context.push('<!--[if ');
                }
            }, {
                key: 'openEnd',
                value: function openEnd(context) {
                    context.push(this.closeIt ? ']><!-->' : ']>');
                }
            }, {
                key: 'attributes',
                value: function attributes(context, tag) {
                    if (!tag.attributeGroups || tag.attributeGroups.length < 1) return;

                    var attr = tag.attributeGroups[0].attributes[0];
                    context.push(attr && attr.value[0].value);
                }
            }, {
                key: 'closeStart',
                value: function closeStart() {}
            }, {
                key: 'closeEnd',
                value: function closeEnd(context) {
                    context.push(this.closeIt ? '<!--<![endif]-->' : '<![endif]-->');
                }
            }]);

            return IeifCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(ieif);
    var ieif_1 = ieif.IeifCompiler;

    var doctype = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.DoctypeCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var TYPES = {
            html: '<!DOCTYPE html>',
            xml: '<?xml version="1.0" encoding="utf-8" ?>',
            transitional: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"' + ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
            strict: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ' + '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
            frameset: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" ' + '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
            1.1: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" ' + '"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
            basic: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" ' + '"http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
            mobile: '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" ' + '"http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'
        };

        var DoctypeCompiler = exports.DoctypeCompiler = function (_TagCompiler) {
            _inherits(DoctypeCompiler, _TagCompiler);

            function DoctypeCompiler() {
                _classCallCheck(this, DoctypeCompiler);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(DoctypeCompiler).apply(this, arguments));
            }

            _createClass(DoctypeCompiler, [{
                key: 'compile',
                value: function compile(context, tag) {
                    var type = 'html';
                    this.startIndent(context, tag);
                    if (tag.attributeGroups && tag.attributeGroups.length > 0) {
                        var value = tag.attributeGroups[0].attributes[0].value[0];
                        if (value.minor === 'quoted') {
                            context.push('<!DOCTYPE ' + value.value + '>');
                            return;
                        }
                        type = value.value;
                    }
                    context.push(TYPES[type]);
                }
            }]);

            return DoctypeCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(doctype);
    var doctype_1 = doctype.DoctypeCompiler;

    var echo = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.EchoCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var EchoCompiler = exports.EchoCompiler = function (_TagCompiler) {
            _inherits(EchoCompiler, _TagCompiler);

            function EchoCompiler() {
                _classCallCheck(this, EchoCompiler);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(EchoCompiler).apply(this, arguments));
            }

            _createClass(EchoCompiler, [{
                key: 'compile',
                value: function compile(context, tag) {
                    if (!tag.attributeGroups) return;
                    this.startIndent(context, tag);

                    var result = tag.attributeGroups.map(function (item) {
                        return item.attributes.map(function (a) {
                            return a.value.map(function (v) {
                                return v.value;
                            }).join('');
                        }).join('');
                    });
                    context.push(result.join(''));
                }
            }]);

            return EchoCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(echo);
    var echo_1 = echo.EchoCompiler;

    var mixinDef = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.MixinDefinitionCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var MixinDefinitionCompiler = exports.MixinDefinitionCompiler = function (_TagCompiler) {
            _inherits(MixinDefinitionCompiler, _TagCompiler);

            function MixinDefinitionCompiler() {
                _classCallCheck(this, MixinDefinitionCompiler);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(MixinDefinitionCompiler).apply(this, arguments));
            }

            _createClass(MixinDefinitionCompiler, [{
                key: 'compile',
                value: function compile(context, tag) {
                    if (!tag.hash) {
                        throw new Error('Hash property is required for block definition. eg. @mixin#name');
                    }

                    if (tag.indent !== 0) {
                        throw new Error('Block definition must be placed in top level(the indent of it must be 0)');
                    }

                    var ctx = context.sub(tag, -2);
                    ctx.compileChildren();
                    var result = ctx.getOutput(true);
                    var group = tag.attributeGroups && tag.attributeGroups[0];
                    var replacement = {};

                    group.attributes.forEach(function (item) {
                        var value = context.getCompiler(item).getValue(context, item.value, item, group, tag);
                        item.name ? replacement[item.name] = value : replacement[value] = null;
                    });

                    context.root.getNote('mixin').set(tag.hash, { result: result, replacement: replacement });
                }
            }]);

            return MixinDefinitionCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(mixinDef);
    var mixinDef_1 = mixinDef.MixinDefinitionCompiler;

    var mixinRef = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.MixinReferenceCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var MixinReferenceCompiler = exports.MixinReferenceCompiler = function (_TagCompiler) {
            _inherits(MixinReferenceCompiler, _TagCompiler);

            function MixinReferenceCompiler() {
                _classCallCheck(this, MixinReferenceCompiler);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(MixinReferenceCompiler).apply(this, arguments));
            }

            _createClass(MixinReferenceCompiler, [{
                key: 'compile',
                value: function compile(context, tag) {
                    if (!tag.hash) {
                        throw new Error('Hash property is required for block reference. eg. block#name');
                    }

                    var def = context.root.getNote('mixin').get(tag.hash);
                    this.startIndent(context, tag);
                    var indent = context.last(1);
                    var replacement = {};
                    var keys = Object.keys(def.replacement);
                    keys.forEach(function (item) {
                        return replacement[item] = def.replacement[item];
                    });

                    if (tag.attributeGroups) {
                        (function () {
                            var group = tag.attributeGroups[0];
                            group.attributes.forEach(function (item) {
                                if (!item.name) return;
                                if (!replacement.hasOwnProperty(item.name)) return;

                                replacement[item.name] = context.getCompiler(item).getValue(context, item.value, item, group, tag);
                            });
                        })();
                    }

                    def.result.forEach(function (item) {
                        if (item.indexOf('$') > -1) {
                            context.push(keys.reduce(function (acc, k) {
                                return acc.replace(new RegExp('\\$' + k, 'g'), replacement[k]);
                            }, item));
                            return;
                        }

                        context.push(item);
                        if (item === '\n') context.push(indent);
                    });
                }
            }]);

            return MixinReferenceCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(mixinRef);
    var mixinRef_1 = mixinRef.MixinReferenceCompiler;

    var include = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.IncludeCompiler = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        var fs$$1 = _interopRequireWildcard(fs);

        var path$$1 = _interopRequireWildcard(path);

        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }newObj.default = obj;return newObj;
            }
        }

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var IncludeCompiler = exports.IncludeCompiler = function (_TagCompiler) {
            _inherits(IncludeCompiler, _TagCompiler);

            function IncludeCompiler() {
                _classCallCheck(this, IncludeCompiler);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(IncludeCompiler).apply(this, arguments));
            }

            _createClass(IncludeCompiler, [{
                key: 'compile',
                value: function compile(context, tag$$1) {
                    var ctx = context;
                    var file = tag$$1.attributeGroups[0].attributes[0].value[0].value;
                    var dir = ctx.options.filename || path$$1.resolve('.');
                    if (fs$$1.statSync(dir).isFile()) dir = path$$1.dirname(dir);
                    file = path$$1.resolve(dir, file);

                    var code = fs$$1.readFileSync(file, 'utf8');

                    var _parse = (0, parser.parse)(code, { Tag: tag.Tag, Declaration: declaration.Declaration, Attribute: attribute.Attribute });

                    var nodes = _parse.nodes;

                    nodes.forEach(function (node) {
                        return ctx.sub(node, -1);
                    });

                    ctx.compileChildren();
                    ctx.parent.containsIndent = ctx.containsIndent;
                }
            }]);

            return IncludeCompiler;
        }(tag$2.TagCompiler);
    });

    unwrapExports(include);
    var include_1 = include.IncludeCompiler;

    var context = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.Context = undefined;

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var compilers = {
            tag: new tag$2.TagCompiler(),
            group: new group.GroupCompiler(),
            attribute: new attribute$2.AttributeCompiler(),
            value: new value.ValueCompiler(),
            setting: new setting.SettingCompiler(),

            'attribute.class': new attribute$2.AttributeCompiler(' '),
            'tag.|': new textTag.TextTagCompiler(),
            'tag.#': new comment.CommentCompiler(),
            'tag.br': new emptyTag.EmptyTagCompiler(),
            'tag.ieif': new ieif.IeifCompiler(),
            'tag.@ieif': new ieif.IeifCompiler(true),
            'tag.doctype': new doctype.DoctypeCompiler(),
            'tag.echo': new echo.EchoCompiler(),
            'tag.@mixin': new mixinDef.MixinDefinitionCompiler(),
            'tag.mixin': new mixinRef.MixinReferenceCompiler(),
            'tag.@include': new include.IncludeCompiler()
        };

        var emptyTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

        emptyTags.forEach(function (item) {
            return compilers['tag.' + item] = new emptyTag.EmptyTagCompiler();
        });

        var booleanAttribute = ['disabled', 'checked', 'readonly', 'required', 'selected', 'sortable'];

        booleanAttribute.forEach(function (item) {
            return compilers['attribute.' + item] = new attribute$2.AttributeCompiler('', true);
        });

        var _getCompiler = function _getCompiler(others, item) {
            var name = item.type;
            var compiler = compilers['' + name];

            if (item.major) {
                name = name + '.' + item.major;
                if (others[name]) compiler = others[name];else if (compilers[name]) compiler = compilers[name];
            }

            if (item.minor) {
                name = name + '.' + item.minor;
                if (others[name]) compiler = others[name];else if (compilers[name]) compiler = compilers[name];
            }

            if (item.name) {
                name = name + '.' + item.name;
                if (others[name]) compiler = others[name];else if (compilers[name]) compiler = compilers[name];
            }

            if (item.namespace) {
                name = name + '.' + item.namespace;
                if (others[name]) compiler = others[name];else if (compilers[name]) compiler = compilers[name];
            }

            return compiler;
        };

        var Note = function () {
            function Note(context, name) {
                _classCallCheck(this, Note);

                this._note = {};
                this._noteNames = [];
                this._context = context;
                this._name = name;
            }

            _createClass(Note, [{
                key: 'get',
                value: function get(name) {
                    return this._note[name];
                }
            }, {
                key: 'set',
                value: function set(name, value$$1) {
                    if (!this._note.hasOwnProperty(name)) this._noteNames.push(name);
                    this._note[name] = value$$1;
                }
            }, {
                key: 'each',
                value: function each(fn) {
                    var _this = this;

                    this._noteNames.forEach(function (key) {
                        return fn(key, _this._note[key]);
                    });
                }
            }, {
                key: 'clear',
                value: function clear() {
                    delete this._context._notes[this._name];
                }
            }]);

            return Note;
        }();

        var Context = exports.Context = function () {
            function Context(options, tag$$1) {
                var indentToken = arguments.length <= 2 || arguments[2] === undefined ? '    ' : arguments[2];
                var indent = arguments.length <= 3 || arguments[3] === undefined ? -1 : arguments[3];
                var parent = arguments[4];

                _classCallCheck(this, Context);

                this._options = options;
                this._tag = tag$$1;
                this._parent = parent;
                this._indentToken = indentToken;
                this._newlineToken = options.newlineToken || '\n';
                this._indent = indent;
                this._children = [];
                this._notes = {};
                this._result = [];

                if (!parent) {
                    this._compilers = {};
                }
            }

            _createClass(Context, [{
                key: 'sub',
                value: function sub(tag$$1) {
                    var idt = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

                    if (!tag$$1 instanceof tag.Tag) {
                        throw new Error('Tag is required to create a sub context');
                    }

                    var ctx = new Context(this._options, tag$$1, this._indentToken, idt + this._indent + 1, this);
                    this._children.push(ctx);

                    ctx.compiler = this.getCompiler(tag$$1);
                    ctx.compiler.walk(ctx, tag$$1);

                    return ctx;
                }
            }, {
                key: 'registerCompiler',
                value: function registerCompiler(name, compiler) {
                    this.root._compilers[name] = compiler;
                }
            }, {
                key: 'getCompiler',
                value: function getCompiler(item) {
                    return _getCompiler(this.root._compilers, item);
                }
            }, {
                key: 'getNote',
                value: function getNote(name) {
                    if (!this._notes[name]) this._notes[name] = new Note(this, name);
                    return this._notes[name];
                }
            }, {
                key: 'push',
                value: function push(text) {
                    this._result.push(text);
                    return this;
                }
            }, {
                key: 'pop',
                value: function pop() {
                    this._result.pop();
                    return this;
                }
            }, {
                key: 'eol',
                value: function eol() {
                    this._result.push(this._newlineToken);
                    return this;
                }
            }, {
                key: 'last',
                value: function last(length) {
                    return this._result.slice(-length);
                }
            }, {
                key: 'indent',
                value: function indent() {
                    var delta = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                    var i = 0;
                    var idt = '';

                    for (; i < this._indent + delta; i++) {
                        idt += this._indentToken;
                    }
                    this._result.push(idt);

                    if (this.parent) this.parent.containsIndent = true;
                    return this;
                }
            }, {
                key: 'mergeUp',
                value: function mergeUp() {
                    if (this._parent) this._parent._result = this._parent._result.concat(this._result);
                }
            }, {
                key: 'doCompile',
                value: function doCompile(tags) {
                    var _this2 = this;

                    if (!this._parent && tags) {
                        tags.forEach(function (item) {
                            return _this2.sub(item);
                        });
                    }
                    if (this._compiler) {
                        this._compiler.compile(this, this._tag);
                        this.mergeUp();
                    } else {
                        this.compileChildren();
                    }
                }
            }, {
                key: 'compileChildren',
                value: function compileChildren() {
                    this._children.forEach(function (item) {
                        return item.doCompile();
                    });
                }
            }, {
                key: 'getOutput',
                value: function getOutput(noJoin) {
                    if (this._result[0] === this._newlineToken) this._result.shift();
                    if (!this._parent && this._result.slice(-1)[0] !== this._newlineToken) this.eol();
                    return noJoin ? this._result : this._result.join('');
                }
            }, {
                key: 'root',
                get: function get() {
                    var r = this;
                    while (r.parent) {
                        r = r.parent;
                    }return r;
                }
            }, {
                key: 'options',
                get: function get() {
                    return this._options;
                }
            }, {
                key: 'parent',
                get: function get() {
                    return this._parent;
                }
            }, {
                key: 'compiler',
                get: function get() {
                    return this._compiler;
                },
                set: function set(compiler) {
                    this._compiler = compiler;
                }
            }, {
                key: 'containsIndent',
                get: function get() {
                    return this._containsIndent;
                },
                set: function set(ci) {
                    this._containsIndent = ci;
                }
            }]);

            return Context;
        }();
    });

    unwrapExports(context);
    var context_1 = context.Context;

    var sleet = createCommonjsModule(function (module, exports) {

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.compile = compile;

        var parser$$1 = _interopRequireWildcard(parser);

        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }newObj.default = obj;return newObj;
            }
        }

        function compile(input) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            try {
                var result = parser$$1.parse(input, { Tag: tag.Tag, Declaration: declaration.Declaration, Attribute: attribute.Attribute });
                var context$$1 = new context.Context(options, null, options.indentToken || result.indent);
                var extension = null;

                if (result.declaration) {
                    var name = result.declaration.name;

                    extension = result.declaration.extension;

                    if (options[name] && options[name].overrideContext) {
                        options[name].overrideContext(context$$1, options, result.declaration);
                    } else if (name.slice(0, 6) === 'sleet-') {
                        var mod = commonjsRequire(name);
                        mod.overrideContext(context$$1, options, result.declaration);
                        extension || (extension = mod.getDefaultExtension());
                    } else if (name !== 'sleet') {
                        var _mod = commonjsRequire('sleet-' + name);
                        _mod.overrideContext(context$$1, options, result.declaration);
                        extension || (extension = _mod.getDefaultExtension());
                    }
                }

                context$$1.doCompile(result.nodes);
                return { content: context$$1.getOutput(), extension: extension || options.extension || 'html' };
            } catch (e) {
                if (e instanceof parser$$1.SyntaxError) {
                    throw new Error(e.message + ' [line: ' + e.line + ', column: ' + e.column + ']');
                } else {
                    throw e;
                }
            }
        }
    });

    unwrapExports(sleet);
    var sleet_1 = sleet.compile;

    var KV$4 = drizzlejs.factory.KV,
        SN$3 = drizzlejs.factory.SN,
        C$4 = drizzlejs.factory.C,
        RG$1 = drizzlejs.factory.RG,
        AC$2 = drizzlejs.factory.AC,
        AT$3 = drizzlejs.factory.AT,
        SV$3 = drizzlejs.factory.SV,
        NSA$3 = drizzlejs.factory.NSA,
        DV$3 = drizzlejs.factory.DV,
        NDA$3 = drizzlejs.factory.NDA,
        DN$3 = drizzlejs.factory.DN,
        TX$2 = drizzlejs.factory.TX,
        IFC$1 = drizzlejs.factory.IFC;

    var template$6 = new drizzlejs.ViewTemplate();
    var templateNodes$6 = function templateNodes() {
        var o1 = SN$3('div', null, KV$4('class', 'showcase'));
        var o2 = RG$1('showcase');
        var o4 = DN$3('div');
        AC$2(o4, 'click', 'run', NDA$3('files'), NDA$3('json'));
        var o5 = SN$3('div', null, KV$4('class', 'is-overlay has-background-dark run-overlay'));
        var o6 = SN$3('p', null, KV$4('class', 'click-to-run has-text-centered is-size-1 has-text-white'));
        var o7 = TX$2('点击运行');
        var o3 = IFC$1([DV$3('changed')], o4);

        C$4(o1, o2);
        C$4(o6, o7);
        C$4(o4, o5, o6);

        return [o1, o3];
    };
    var id = 0;
    var transform = function transform(code) {
        var es6 = sleet_1(code, { 'drizzle': window['sleet-drizzle'] }).content;
        var es5 = Babel.transform(es6, { presets: ['es2015'] });
        return eval('(function(exports, require) {' + es5.code + '\nreturn exports.default })({}, require1)');
    };

    template$6.creator = templateNodes$6;

    var _view_show = {
        updated: function updated() {
            var item = this.regions.showcase.item;

            if (!item) return;
            item.set(JSON.parse(this.get('json')));
        },

        actions: {
            run: function run(cb, files, json) {
                try {
                    var mods = Object.keys(files).reduce(function (acc, item) {
                        acc[item] = transform(files[item]);
                        return acc;
                    }, {});
                    var idx = mods.index;
                    delete mods.index;
                    idx._loadedItems = mods;
                    var opt = this._module._items;
                    delete opt['_mod' + id];
                    var name = '_mod' + ++id;
                    if (!idx.cycles) idx.cycles = [];
                    idx.cycles.push({
                        updated: function updated() {
                            console.log('updated', this.get());
                        }
                    });
                    opt[name] = {
                        options: idx,
                        loader: this.app.createLoader('index')
                    };
                    this.regions.showcase.show(name, JSON.parse(json));
                    cb({ changed: false });
                } catch (e) {
                    console.log(e);
                }
            }
        },
        template: template$6
    };

    var CO$1 = drizzlejs.factory.CO,
        H$2 = drizzlejs.factory.H,
        SV$4 = drizzlejs.factory.SV,
        AC$3 = drizzlejs.factory.AC,
        AT$4 = drizzlejs.factory.AT,
        NSA$4 = drizzlejs.factory.NSA,
        DV$4 = drizzlejs.factory.DV,
        NDA$4 = drizzlejs.factory.NDA,
        KV$5 = drizzlejs.factory.KV,
        DN$4 = drizzlejs.factory.DN,
        C$5 = drizzlejs.factory.C;

    var template$7 = new drizzlejs.ViewTemplate();
    var templateNodes$7 = function templateNodes() {
        var o1 = DN$4('div', 'editor', KV$5('class', 'code-editor'));
        CO$1(o1, 'ace-editor', H$2('options'), H$2('json'));
        AC$3(o1, 'codeChange', 'updateJson', NDA$4('event'));

        return [o1];
    };

    template$7.creator = templateNodes$7;

    var _view_json = {
        state: {
            options: {
                fontFamily: 'Inconsolata, monospace',
                fontSize: '13px',
                showPrintMargin: false,
                mode: 'ace/mode/json',
                theme: 'ace/theme/xcode'
            }
        },
        template: template$7
    };

    var index = '#! drizzle\n\nmodule(name) > view-a(name)\n\nscript.\n    export default {\n        items: { views: [\'view-a\'] },\n        store: {\n            models: {\n                name: () => \'\'\n            }\n        }\n    }\n';

    var view = '#! drizzle\n\nview\n    input.input(bind:value=name)\n    h3 > echo(\'hello \' name \'!\')\nscript.\n    export default {\n    }\n';

    var json = '{\n    "name": "world"\n}';

    var hw = {
        code: 'hello-world',
        name: 'Hello World',
        files: { index: index, 'view-a': view },
        json: json
    };

    var index$1 = '#! drizzle\n\nmodule(names) > view-a(names)\n\nscript.\n    export default {\n        items: { views: [\'view-a\'] },\n        store: {\n            models: {\n                names: () => []\n            }\n        }\n    }\n';

    var view$1 = '#! drizzle\n\nview\n    .control\n        label(class=\'checkbox\') > input(type=\'checkbox\' bind:group=names value=\'a\') + echo(\'A checked\')\n        label(class=\'checkbox\') > input(type=\'checkbox\' bind:group=names value=\'b\') + echo(\'B checked\')\n        label(class=\'checkbox\') > input(type=\'checkbox\' bind:group=names value=\'c\') + echo(\'C checked\')\n    h3 > echo(\'hello \' names \'!\')\nscript.\n    export default {\n    }\n';

    var json$1 = '{\n    "names": ["a", "b", "c"]\n}';

    var bg = {
        code: 'bind-group',
        name: 'Group binding',
        files: { index: index$1, 'view-a': view$1 },
        json: json$1
    };

    var _examples;
    var KV$6 = drizzlejs.factory.KV,
        SN$4 = drizzlejs.factory.SN,
        C$6 = drizzlejs.factory.C,
        BD$3 = drizzlejs.factory.BD,
        AC$4 = drizzlejs.factory.AC,
        AT$5 = drizzlejs.factory.AT,
        SV$5 = drizzlejs.factory.SV,
        NSA$5 = drizzlejs.factory.NSA,
        DV$5 = drizzlejs.factory.DV,
        NDA$5 = drizzlejs.factory.NDA,
        REF$3 = drizzlejs.factory.REF,
        TX$3 = drizzlejs.factory.TX;

    var template$8 = new drizzlejs.ModuleTemplate([]);
    var templateNodes$8 = function templateNodes() {
        var o1 = SN$4('div', null, KV$6('class', 'main-content'));
        var o2 = SN$4('div', null, KV$6('class', 'tile is-ancestor h100'));
        var o3 = SN$4('div', null, KV$6('class', 'tile is-6 is-parent br'));
        var o4 = SN$4('div', null, KV$6('class', 'tile is-child editor is-12'));
        var o5 = REF$3('file-tab', []);
        BD$3(o5, 'tabs', 'tabs');
        AC$4(o5, 'change', 'switchFile', NDA$5('event'));
        AC$4(o5, 'rename', 'renameFile', NDA$5('event'));
        var o6 = REF$3('code-editor', []);
        BD$3(o6, 'code', 'code');
        AC$4(o6, 'change', 'updateCode', NDA$5('event'));
        var o7 = SN$4('div', null, KV$6('class', 'operators'));
        var o8 = REF$3('c-dropdown', []);
        var o9 = SN$4('div', null, KV$6('d', '2'), KV$6('class', 'dropdown-item'));
        var o10 = SN$4('p');
        var o11 = TX$3('abc');
        var o12 = SN$4('div', null, KV$6('class', 'tile is-6 is-vertical'));
        var o13 = SN$4('div', null, KV$6('class', 'tile is-parent'));
        var o14 = SN$4('div', null, KV$6('class', 'tile is-child is-relative'));
        var o15 = REF$3('view-show', []);
        BD$3(o15, 'files', 'files');
        BD$3(o15, 'json', 'json');
        BD$3(o15, 'changed', 'changed');
        var o16 = SN$4('div', null, KV$6('class', 'tile is-parent bt'));
        var o17 = SN$4('div', null, KV$6('class', 'tile is-child editor'));
        var o18 = REF$3('view-json', []);
        BD$3(o18, 'json', 'json');
        C$6(o10, o11);
        C$6(o9, o10);
        C$6(o8, o9);
        C$6(o7, o8);
        C$6(o4, o5, o6, o7);
        C$6(o3, o4);
        C$6(o14, o15);
        C$6(o13, o14);
        C$6(o17, o18);
        C$6(o16, o17);
        C$6(o12, o13, o16);
        C$6(o2, o3, o12);
        C$6(o1, o2);
        return [o1];
    };
    var examples = (_examples = {}, defineProperty(_examples, hw.code, hw), defineProperty(_examples, bg.code, bg), _examples);
    template$8.creator = templateNodes$8;
    var _repl_app = {
        items: {
            views: ['view-json', 'view-show'],
            modules: {
                'file-tab': 'repl/tab',
                'code-editor': 'repl/editor',
                'c-dropdown': 'component/dropdown'
            }
        },
        routes: { '/:code': { action: 'changeExample' } },
        store: {
            models: {
                files: function files() {
                    return {};
                },
                current: function current() {
                    return 'index';
                },
                json: function json() {
                    return '';
                },
                changed: function changed() {
                    return true;
                }
            },
            actions: {
                switchFile: function switchFile(_ref) {
                    var from = _ref.from,
                        to = _ref.to;

                    this.set({ current: to });
                },
                updateCode: function updateCode(_ref2) {
                    var code = _ref2.code;

                    var files = this.get('files');
                    try {
                        sleet_1(code, { 'drizzle': window['sleet-drizzle'] }).content;
                    } catch (e) {
                        console.log(e);
                    }
                    files[this.get('current')] = code;
                    this.set({
                        files: files,
                        changed: true
                    });
                },
                updateJson: function updateJson(_ref3) {
                    var detail = _ref3.detail;

                    this.set({ json: detail });
                },
                renameFile: function renameFile(_ref4) {
                    var name = _ref4.name,
                        old = _ref4.old;

                    var _get = this.get(),
                        files = _get.files,
                        current = _get.current;

                    files[name] = files[old];
                    delete files[old];
                    var c = current === old ? name : current;
                    this.set({
                        files: files,
                        current: c
                    });
                },
                run: function run(_ref5) {
                    var changed = _ref5.changed;

                    this.set({ changed: changed });
                },
                changeExample: function changeExample(_ref6) {
                    var code = _ref6.code;

                    console.log(code);
                    if (!code || !examples[code]) code = 'hello-world';
                    var c = examples[code];
                    this.set({
                        files: c.files,
                        json: c.json
                    });
                }
            }
        },
        computed: {
            tabs: function tabs(_ref7) {
                var files = _ref7.files;

                return Object.keys(files);
            },
            code: function code(_ref8) {
                var files = _ref8.files,
                    current = _ref8.current;

                return files[current];
            }
        },
        template: template$8,
        _loadedItems: {
            'view-json': _view_json,
            'view-show': _view_show,
            'repl/tab': _file_tab,
            'repl/editor': _code_editor,
            'component/dropdown': _c_dropdown
        }
    };

    var KV$7 = drizzlejs.factory.KV,
        SN$5 = drizzlejs.factory.SN,
        C$7 = drizzlejs.factory.C,
        TX$4 = drizzlejs.factory.TX;

    var template$9 = new drizzlejs.ModuleTemplate([]);
    var templateNodes$9 = function templateNodes() {
        var o1 = SN$5('div', null, KV$7('class', 'sidebar'));
        var o2 = SN$5('ul', null, KV$7('class', 'menu-list1'));
        var o3 = SN$5('li', null, KV$7('class', 'menu-item1 active'));
        var o4 = SN$5('a');
        var o5 = TX$4('hello');
        var o6 = SN$5('li', null, KV$7('class', 'menu-item1'));
        var o7 = SN$5('a');
        var o8 = TX$4('hello');
        var o9 = SN$5('li', null, KV$7('class', 'menu-item1'));
        var o10 = SN$5('a');
        var o11 = TX$4('hello');
        C$7(o4, o5);
        C$7(o3, o4);
        C$7(o7, o8);
        C$7(o6, o7);
        C$7(o10, o11);
        C$7(o9, o10);
        C$7(o2, o3, o6, o9);
        C$7(o1, o2);
        return [o1];
    };
    template$9.creator = templateNodes$9;
    var _app_menu = { template: template$9 };

    var KV$8 = drizzlejs.factory.KV,
        SN$6 = drizzlejs.factory.SN,
        C$8 = drizzlejs.factory.C,
        H$3 = drizzlejs.factory.H,
        TX$5 = drizzlejs.factory.TX,
        DV$6 = drizzlejs.factory.DV,
        SV$6 = drizzlejs.factory.SV,
        HH$1 = drizzlejs.factory.HH,
        DA$1 = drizzlejs.factory.DA,
        DN$5 = drizzlejs.factory.DN,
        AC$5 = drizzlejs.factory.AC,
        AT$6 = drizzlejs.factory.AT,
        NSA$6 = drizzlejs.factory.NSA,
        NDA$6 = drizzlejs.factory.NDA,
        IFC$2 = drizzlejs.factory.IFC;

    var template$a = new drizzlejs.ViewTemplate();
    var templateNodes$a = function templateNodes() {
        var o1 = SN$6('footer', null, KV$8('class', 'footer'));
        var o2 = SN$6('span', null, KV$8('class', 'todo-count'));
        var o3 = SN$6('strong');
        var o4 = TX$5(H$3('remaining'));
        var o5 = TX$5(HH$1('if', DV$6('remaining'), DV$6('eq'), SV$6(1), SV$6(' item left'), SV$6(' items left')));
        var o6 = SN$6('ul', null, KV$8('class', 'filters'));
        var o7 = SN$6('li');
        var o8 = DN$5('a', null, KV$8('href', '#/todos/all'));
        DA$1(o8, 'class', HH$1('if', DV$6('filter'), DV$6('eq'), SV$6('all'), SV$6('selected')));
        var o9 = TX$5('All');
        var o10 = SN$6('li');
        var o11 = DN$5('a', null, KV$8('href', '#/todos/active'));
        DA$1(o11, 'class', HH$1('if', DV$6('filter'), DV$6('eq'), SV$6('active'), SV$6('selected')));
        var o12 = TX$5('Active');
        var o13 = SN$6('li');
        var o14 = DN$5('a', null, KV$8('href', '#/todos/completed'));
        DA$1(o14, 'class', HH$1('if', DV$6('filter'), DV$6('eq'), SV$6('completed'), SV$6('selected')));
        var o15 = TX$5('Completed');
        var o17 = DN$5('button', null, KV$8('class', 'clear-completed'));
        AC$5(o17, 'click', 'clearCompleted');
        var o18 = TX$5('Clear completed');
        var o16 = IFC$2([DV$6('haveCompleted')], o17);

        C$8(o3, o4);
        C$8(o2, o3, o5);
        C$8(o8, o9);
        C$8(o7, o8);
        C$8(o11, o12);
        C$8(o10, o11);
        C$8(o14, o15);
        C$8(o13, o14);
        C$8(o6, o7, o10, o13);
        C$8(o17, o18);
        C$8(o1, o2, o6, o16);

        return [o1];
    };

    template$a.creator = templateNodes$a;

    var _todo_footer = {
        computed: {
            remaining: function remaining(_ref) {
                var todos = _ref.todos;

                return todos.filter(function (it) {
                    return !it.completed;
                }).length;
            },
            haveCompleted: function haveCompleted(_ref2) {
                var todos = _ref2.todos;

                return todos.some(function (it) {
                    return !!it.completed;
                });
            }
        },
        template: template$a
    };

    var KV$9 = drizzlejs.factory.KV,
        SN$7 = drizzlejs.factory.SN,
        C$9 = drizzlejs.factory.C,
        DA$2 = drizzlejs.factory.DA,
        H$4 = drizzlejs.factory.H,
        SV$7 = drizzlejs.factory.SV,
        AC$6 = drizzlejs.factory.AC,
        AT$7 = drizzlejs.factory.AT,
        NSA$7 = drizzlejs.factory.NSA,
        DV$7 = drizzlejs.factory.DV,
        NDA$7 = drizzlejs.factory.NDA,
        DN$6 = drizzlejs.factory.DN,
        HH$2 = drizzlejs.factory.HH,
        EV$2 = drizzlejs.factory.EV,
        TX$6 = drizzlejs.factory.TX,
        BD$4 = drizzlejs.factory.BD,
        EACH$1 = drizzlejs.factory.EACH,
        IFC$3 = drizzlejs.factory.IFC;

    var template$b = new drizzlejs.ViewTemplate();
    var templateNodes$b = function templateNodes() {
        var o2 = SN$7('section', null, KV$9('class', 'main'));
        var o3 = DN$6('input', null, KV$9('type', 'checkbox'), KV$9('id', 'toggle-all'), KV$9('class', 'toggle-all'));
        DA$2(o3, 'checked', H$4('allDone'));
        AC$6(o3, 'change', 'toggleAll', AT$7('completed', DV$7('this.checked')));
        var o4 = SN$7('label', null, KV$9('for', 'toggle-all'));
        var o5 = SN$7('ul', null, KV$9('class', 'todo-list'));
        var o7 = function o7() {
            var o8 = DN$6('li');
            DA$2(o8, 'class', HH$2('if', DV$7('todo.completed'), SV$7('completed')), HH$2('if', DV$7('todo'), DV$7('eq'), DV$7('editing'), SV$7('editing')));
            var o9 = SN$7('div', null, KV$9('class', 'view'));
            var o10 = DN$6('input', null, KV$9('type', 'checkbox'), KV$9('class', 'toggle'));
            DA$2(o10, 'checked', H$4('todo.completed'));
            AC$6(o10, 'change', 'toggle', AT$7('id', DV$7('todo.id')), AT$7('checked', DV$7('this.checked')));
            var o11 = DN$6('label');
            EV$2(o11, 'dblclick', 'edit', NDA$7('todo'));
            var o12 = TX$6(H$4('todo.name'));
            var o13 = DN$6('button', null, KV$9('class', 'destroy'));
            AC$6(o13, 'click', 'remove', AT$7('id', DV$7('todo.id')));
            var o14 = DN$6('input', null, KV$9('class', 'edit'));
            BD$4(o14, 'value', 'todo.name');
            AC$6(o14, 'blur', 'commitEdit', NDA$7('todo.id'), NDA$7('this.value'), NSA$7('blur'));
            AC$6(o14, 'enter', 'commitEdit', NDA$7('todo.id'), NDA$7('this.value'), NSA$7('enter'));
            AC$6(o14, 'escape', 'revertEdit', NDA$7('todo'), NDA$7('nameCache'));

            C$9(o11, o12);
            C$9(o9, o10, o11, o13);
            C$9(o8, o9, o14);
            return o8;
        };
        var o6 = EACH$1(['filtered', 'as', 'todo'], o7);
        var o1 = IFC$3([DV$7('todos.length')], o2);

        C$9(o5, o6);
        C$9(o2, o3, o4, o5);

        return [o1];
    };

    template$b.creator = templateNodes$b;

    var _todo_list = {
        computed: {
            allDone: function allDone(_ref) {
                var todos = _ref.todos;

                return !todos.some(function (it) {
                    return !it.completed;
                });
            },
            filtered: function filtered(_ref2) {
                var todos = _ref2.todos,
                    filter = _ref2.filter;

                if (filter === 'completed') return todos.filter(function (it) {
                    return it.completed;
                });
                if (filter === 'active') return todos.filter(function (it) {
                    return !it.completed;
                });
                return todos;
            }
        },
        events: {
            edit: function edit(todo) {
                this.set({
                    nameCache: todo.name,
                    editing: todo
                });
            }
        },
        actions: {
            revertEdit: function revertEdit(cb, todo, cached) {
                console.log(todo, cached);
                this.set({
                    editing: false,
                    nameCache: false
                });
                cb({
                    id: todo.id,
                    name: cached
                });
            },
            commitEdit: function commitEdit(cb, id, name, type) {
                console.log('commit', id, name, type);
                this.set({
                    nameCache: false,
                    editing: false
                });
                cb({
                    id: id,
                    name: name
                });
            }
        },
        template: template$b
    };

    var KV$a = drizzlejs.factory.KV,
        AC$7 = drizzlejs.factory.AC,
        AT$8 = drizzlejs.factory.AT,
        SV$8 = drizzlejs.factory.SV,
        NSA$8 = drizzlejs.factory.NSA,
        DV$8 = drizzlejs.factory.DV,
        NDA$8 = drizzlejs.factory.NDA,
        DN$7 = drizzlejs.factory.DN,
        C$a = drizzlejs.factory.C;

    var template$c = new drizzlejs.ViewTemplate();
    var templateNodes$c = function templateNodes() {
        var o1 = DN$7('input', 'create', KV$a('placeholder', 'What needs to be done?'), KV$a('class', 'new-todo'));
        AC$7(o1, 'enter', 'newTodo', AT$8('name', DV$8('this.value')));

        return [o1];
    };

    template$c.creator = templateNodes$c;

    var _create_todo = {
        actions: {
            newTodo: function newTodo(cb, payload) {
                if (!payload.name) return;
                this.ids.create.value = '';
                cb(payload);
            }
        },
        template: template$c
    };

    var KV$b = drizzlejs.factory.KV,
        SN$8 = drizzlejs.factory.SN,
        C$b = drizzlejs.factory.C,
        TX$7 = drizzlejs.factory.TX,
        REF$4 = drizzlejs.factory.REF,
        BD$5 = drizzlejs.factory.BD;

    var template$d = new drizzlejs.ModuleTemplate(['todos']);
    var templateNodes$d = function templateNodes() {
        var o1 = SN$8('div', null, KV$b('class', 'todoapp-container'));
        var o2 = SN$8('section', null, KV$b('class', 'todoapp'));
        var o3 = SN$8('header', null, KV$b('class', 'header'));
        var o4 = SN$8('h1');
        var o5 = TX$7('todos');
        var o6 = REF$4('create-todo', []);
        var o7 = REF$4('todo-list', []);
        BD$5(o7, 'todos', 'todos');
        BD$5(o7, 'filter', 'filter');
        var o8 = REF$4('todo-footer', []);
        BD$5(o8, 'todos', 'todos');
        BD$5(o8, 'filter', 'filter');
        C$b(o4, o5);
        C$b(o3, o4, o6);
        C$b(o2, o3, o7, o8);
        C$b(o1, o2);
        return [o1];
    };
    var id$1 = 0;
    template$d.creator = templateNodes$d;
    var _todo_app = {
        items: {
            views: ['create-todo', 'todo-list', 'todo-footer']
        },
        routes: { '/:filter': { action: 'updateFilter' } },
        store: {
            models: {
                todos: {
                    data: function data() {
                        return [{
                            name: 'task 1',
                            completed: true,
                            id: id$1++
                        }, {
                            name: 'task 2',
                            id: id$1++
                        }];
                    }
                },
                filter: { data: function data() {
                        return 'all';
                    } }
            },
            actions: {
                newTodo: function newTodo(payload) {
                    this.set({ todos: this.get('todos').concat([Object.assign(payload, { id: id$1++ })]) });
                },
                toggleAll: function toggleAll(payload) {
                    this.set({ todos: this.get('todos').map(function (it) {
                            return Object.assign(it, payload);
                        }) });
                },
                toggle: function toggle(_ref) {
                    var id = _ref.id,
                        checked = _ref.checked;

                    var todos = this.get('todos');
                    todos.find(function (it) {
                        return it.id === id;
                    }).completed = checked;
                    this.set({ todos: todos });
                },
                remove: function remove(item) {
                    this.set({ todos: this.get('todos').filter(function (it) {
                            return it.id !== item.id;
                        }) });
                },
                update: function update(_ref2) {
                    var id = _ref2.id,
                        name = _ref2.name;

                    console.log('update', id, name);
                    var todos = this.get('todos');
                    todos.find(function (it) {
                        return it.id === id;
                    }).name = name;
                    this.set({ todos: todos });
                },
                commitEdit: function commitEdit(payload) {
                    this.dispatch('update', payload);
                },
                revertEdit: function revertEdit(payload) {
                    this.dispatch('update', payload);
                },
                clearCompleted: function clearCompleted(payload) {
                    this.set({ todos: this.get('todos').filter(function (it) {
                            return !it.completed;
                        }) });
                },
                updateFilter: function updateFilter(payload) {
                    if (payload.filter !== 'completed' && payload.filter !== 'active') payload.filter = 'all';
                    this.set(payload);
                }
            }
        },
        template: template$d,
        _loadedItems: {
            'create-todo': _create_todo,
            'todo-list': _todo_list,
            'todo-footer': _todo_footer
        }
    };

    var REF$5 = drizzlejs.factory.REF,
        RG$2 = drizzlejs.factory.RG;

    var template$e = new drizzlejs.ModuleTemplate([]);
    var templateNodes$e = function templateNodes() {
        var o1 = REF$5('app-header', []);
        var o2 = RG$2();
        return [o1, o2];
    };
    template$e.creator = templateNodes$e;
    var _viewport = {
        items: {
            modules: {
                'todo-app': 'todos',
                'app-menu': 'main/menu',
                'repl-app': 'repl',
                'app-header': 'main/header'
            }
        },
        routes: {
            '/todos1': 'todo-app',
            '/repl': 'repl-app'
        },
        template: template$e,
        _loadedItems: {
            'todos': _todo_app,
            'main/menu': _app_menu,
            'repl': _repl_app,
            'main/header': _app_header
        }
    };

    function delay(fn, time) {
        var timeout = void 0;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(fn, time);
        };
    }

    function editor(node) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var code = arguments[2];

        var editor = ace.edit(node, options);
        var current = code;
        editor.setValue(code, -1);

        var busy = false;
        var handler = delay(function (e) {
            if (busy) return;
            current = editor.getValue();
            node.dispatchEvent(new CustomEvent('codeChange', { detail: current }));
        }, 1);

        editor.on('change', handler);

        return {
            update: function update(options, code) {
                console.log(code === current);
                if (code === current) return;
                busy = true;
                current = code;
                editor.setValue(code, -1);
                busy = false;
            },
            dispose: function dispose() {
                editor.destroy();
            }
        };
    }

    drizzlejs.components['ace-editor'] = editor;

    var MLoader = function (_Loader) {
        inherits(MLoader, _Loader);

        function MLoader() {
            classCallCheck(this, MLoader);
            return possibleConstructorReturn(this, (MLoader.__proto__ || Object.getPrototypeOf(MLoader)).apply(this, arguments));
        }

        createClass(MLoader, [{
            key: 'load',
            value: function load(file, mod) {
                if (!mod) return null;
                return Promise.resolve(mod._options._loadedItems[file === 'index' ? this._path : file]);
            }
        }]);
        return MLoader;
    }(drizzlejs.Loader);

    var app = new drizzlejs.Application({
        container: document.body,
        entry: _viewport
    });
    app.registerLoader(MLoader);
    app.start();

}(drizzlejs,fs,path));
//# sourceMappingURL=bundle.js.map
