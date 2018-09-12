(function (drizzlejs,sleet) {
    'use strict';

    var SA = drizzlejs.factory.SA,
        SN = drizzlejs.factory.SN,
        TX = drizzlejs.factory.TX,
        C = drizzlejs.factory.C;

    var template = new drizzlejs.ModuleTemplate([]);
    var templateNodes = function templateNodes() {
        var o1 = SN('div');
        SA(o1, 'class', 'brand-title');
        var o2 = SN('span');
        SA(o2, 'style', 'font-weight: 400;');
        var o3 = TX('D');
        C(o2, o3);
        var o4 = SN('span');
        var o5 = TX('rizzle');
        C(o4, o5);
        C(o1, o2, o4);
        var o6 = SN('div');
        SA(o6, 'class', 'header');
        var o7 = SN('ul');
        SA(o7, 'class', 'header-nav');
        var o8 = SN('li');
        SA(o8, 'class', 'header-nav-item active');
        var o9 = SN('a');
        SA(o9, 'href', '#/guide');
        var o10 = TX('开始使用');
        C(o9, o10);
        C(o8, o9);
        var o11 = SN('li');
        SA(o11, 'class', 'header-nav-item');
        var o12 = SN('a');
        SA(o12, 'href', '#/repl');
        var o13 = TX('在线试用');
        C(o12, o13);
        C(o11, o12);
        var o14 = SN('li');
        SA(o14, 'class', 'header-nav-item');
        var o15 = SN('a');
        SA(o15, 'href', '#/demos');
        var o16 = TX('示例集合');
        C(o15, o16);
        C(o14, o15);
        C(o7, o8, o11, o14);
        C(o6, o7);
        return [o1, o6];
    };
    template.creator = templateNodes;
    var _app_header = {
        template: template,
        _file: 'header/index.sleet'
    };

    var SA$1 = drizzlejs.factory.SA,
        EV = drizzlejs.factory.EV,
        AT = drizzlejs.factory.AT,
        DV = drizzlejs.factory.DV,
        DN = drizzlejs.factory.DN,
        SN$1 = drizzlejs.factory.SN,
        RG = drizzlejs.factory.RG,
        C$1 = drizzlejs.factory.C;

    var template$1 = new drizzlejs.ModuleTemplate(['closeWhenMenuClicked']);
    var templateNodes$1 = function templateNodes() {
        var o1 = DN('div', 'dropdown');
        SA$1(o1, 'class', 'dropdown');
        EV(o1, 'click', 'clickIt', AT('', DV('event')), AT('', DV('this')));
        var o2 = SN$1('div');
        SA$1(o2, 'class', 'dropdown-trigger');
        var o3 = RG('trigger');
        var o4 = SN$1('button');
        SA$1(o4, 'class', 'button');
        var o5 = SN$1('span');
        SA$1(o5, 'class', 'icon is-small');
        var o6 = SN$1('svg');
        SA$1(o6, 'viewBox', '0 0 129 129');
        SA$1(o6, 'enable-background', 'new 0 0 129 129');
        var o7 = SN$1('g');
        var o8 = SN$1('path');
        SA$1(o8, 'd', 'm121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z');
        C$1(o7, o8);
        C$1(o6, o7);
        C$1(o5, o6);
        C$1(o4, o5);
        C$1(o3, o4);
        C$1(o2, o3);
        var o9 = SN$1('div');
        SA$1(o9, 'class', 'dropdown-menu');
        var o10 = SN$1('div', 'content');
        SA$1(o10, 'class', 'dropdown-content');
        var o11 = RG();
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

        template: template$1,
        _file: 'dropdown/index.sleet'
    };

    var SA$2 = drizzlejs.factory.SA,
        CO = drizzlejs.factory.CO,
        H = drizzlejs.factory.H,
        DV$1 = drizzlejs.factory.DV,
        AC = drizzlejs.factory.AC,
        AT$1 = drizzlejs.factory.AT,
        DN$1 = drizzlejs.factory.DN;


    var template$2 = new drizzlejs.ViewTemplate();
    var templateNodes$2 = function templateNodes() {
        var o1 = DN$1('div', 'editor');
        SA$2(o1, 'class', 'code-editor');
        CO(o1, 'ace-editor', H(DV$1('options')), H(DV$1('code')));
        AC(o1, 'codeChange', 'update', AT$1('', DV$1('event')));
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
        template: template$2,
        _file: 'editor/view-editor.sleet'
    };

    var MP = drizzlejs.factory.MP,
        REF = drizzlejs.factory.REF;

    var template$3 = new drizzlejs.ModuleTemplate(['code']);
    var templateNodes$3 = function templateNodes() {
        var o1 = REF('view-editor');
        MP(o1, 'code');
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
        _file: 'editor/index.sleet',
        _loadedItems: { 'view-editor': _view_editor }
    };

    var SA$3 = drizzlejs.factory.SA,
        SN$2 = drizzlejs.factory.SN,
        DA = drizzlejs.factory.DA,
        HH = drizzlejs.factory.HH,
        DV$2 = drizzlejs.factory.DV,
        SV = drizzlejs.factory.SV,
        AC$1 = drizzlejs.factory.AC,
        AT$2 = drizzlejs.factory.AT,
        DN$2 = drizzlejs.factory.DN,
        TX$1 = drizzlejs.factory.TX,
        H$1 = drizzlejs.factory.H,
        C$2 = drizzlejs.factory.C,
        EV$1 = drizzlejs.factory.EV,
        REF$1 = drizzlejs.factory.REF,
        BD = drizzlejs.factory.BD,
        IF = drizzlejs.factory.IF,
        EACH = drizzlejs.factory.EACH;


    var template$4 = new drizzlejs.ViewTemplate();
    var templateNodes$4 = function templateNodes() {
        var o1 = SN$2('div', 'tabs');
        SA$3(o1, 'class', 'tabs');
        var o2 = SN$2('ul');
        var o3 = function o3() {
            var o4 = DN$2('li');
            DA(o4, 'class', HH('if', DV$2('i'), SV('=='), DV$2('current'), SV('is-active')));
            AC$1(o4, 'click', 'active', AT$2('', DV$2('i')));
            var o5 = SN$2('a');
            var o6 = SN$2('span');
            var o7 = TX$1(H$1(DV$2('tab')), '.sleet');
            C$2(o6, o7);
            var o8 = REF$1('c-dropdown');
            SA$3(o8, 'closeWhenMenuClicked', true);
            EV$1(o8, 'show', 'onShow');
            EV$1(o8, 'hide', 'onHide');
            var o9 = SN$2('span');
            SA$3(o9, 'region', 'trigger');
            var o10 = TX$1(H$1(DV$2('tab')), '.sleet');
            C$2(o9, o10);
            var o11 = SN$2('div');
            SA$3(o11, 'class', 'dropdown-item');
            var o12 = SN$2('div');
            SA$3(o12, 'class', 'field has-addons');
            var o13 = SN$2('div');
            SA$3(o13, 'class', 'control');
            var o14 = DN$2('input');
            SA$3(o14, 'class', 'input rename');
            BD(o14, 'value', 'name');
            C$2(o13, o14);
            var o15 = SN$2('div');
            SA$3(o15, 'class', 'control');
            var o16 = SN$2('span');
            SA$3(o16, 'class', 'button is-static');
            var o17 = TX$1('.sleet');
            C$2(o16, o17);
            C$2(o15, o16);
            var o18 = SN$2('div');
            SA$3(o18, 'class', 'control');
            var o19 = DN$2('span');
            SA$3(o19, 'class', 'button');
            AC$1(o19, 'click', 'rename', AT$2('', DV$2('tabs')), AT$2('', DV$2('name')), AT$2('', DV$2('i')));
            var o20 = TX$1('重命名');
            C$2(o19, o20);
            C$2(o18, o19);
            C$2(o12, o13, o15, o18);
            C$2(o11, o12);
            C$2(o8, o9, o11);
            var o21 = IF([DV$2('haveDropdown')], o8, o6);
            var o22 = SN$2('span');
            SA$3(o22, 'class', 'delete is-small');
            C$2(o5, o21, o22);
            C$2(o4, o5);
            return o4;
        };
        var o23 = EACH(['tabs', 'as', 'tab', 'i'], o3);
        C$2(o2, o23);
        C$2(o1, o2);
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
        template: template$4,
        _file: 'tab/view-tab.sleet'
    };

    var MP$1 = drizzlejs.factory.MP,
        REF$2 = drizzlejs.factory.REF;

    var template$5 = new drizzlejs.ModuleTemplate(['tabs']);
    var templateNodes$5 = function templateNodes() {
        var o1 = REF$2('view-tab');
        MP$1(o1, 'tabs');
        MP$1(o1, 'current');
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
        _file: 'tab/index.sleet',
        _loadedItems: {
            'view-tab': _view_tab,
            'component/dropdown': _c_dropdown
        }
    };

    var SA$4 = drizzlejs.factory.SA,
        SN$3 = drizzlejs.factory.SN,
        REF$3 = drizzlejs.factory.REF,
        DA$1 = drizzlejs.factory.DA,
        H$2 = drizzlejs.factory.H,
        SV$1 = drizzlejs.factory.SV,
        DV$3 = drizzlejs.factory.DV,
        DN$3 = drizzlejs.factory.DN,
        TX$2 = drizzlejs.factory.TX,
        C$3 = drizzlejs.factory.C,
        EACH$1 = drizzlejs.factory.EACH;


    var template$6 = new drizzlejs.ViewTemplate();
    var templateNodes$6 = function templateNodes() {
        var o1 = SN$3('div');
        SA$4(o1, 'class', 'operators');
        var o2 = REF$3('c-dropdown');
        var o3 = function o3() {
            var o4 = DN$3('a');
            SA$4(o4, 'class', 'dropdown-item');
            DA$1(o4, 'href', H$2(SV$1('#/repl/')), H$2(DV$3('key')));
            var o5 = TX$2(H$2(DV$3('value.name')));
            C$3(o4, o5);
            return o4;
        };
        var o6 = EACH$1(['examples', 'as', 'value', 'key'], o3);
        C$3(o2, o6);
        C$3(o1, o2);
        return [o1];
    };
    template$6.creator = templateNodes$6;
    var _view_menu = {
        template: template$6,
        _file: 'repl/view-menu.sleet'
    };

    var SA$5 = drizzlejs.factory.SA,
        SN$4 = drizzlejs.factory.SN,
        RG$1 = drizzlejs.factory.RG,
        C$4 = drizzlejs.factory.C,
        AC$2 = drizzlejs.factory.AC,
        AT$3 = drizzlejs.factory.AT,
        DV$4 = drizzlejs.factory.DV,
        DN$4 = drizzlejs.factory.DN,
        TX$3 = drizzlejs.factory.TX,
        IF$1 = drizzlejs.factory.IF;


    var template$7 = new drizzlejs.ViewTemplate();
    var templateNodes$7 = function templateNodes() {
        var o1 = SN$4('div');
        SA$5(o1, 'class', 'showcase');
        var o2 = RG$1('showcase');
        C$4(o1, o2);
        var o3 = DN$4('div');
        AC$2(o3, 'click', 'run', AT$3('', DV$4('files')), AT$3('', DV$4('json')));
        var o4 = SN$4('div');
        SA$5(o4, 'class', 'is-overlay has-background-dark run-overlay');
        var o5 = SN$4('p');
        SA$5(o5, 'class', 'click-to-run has-text-centered is-size-1 has-text-white');
        var o6 = TX$3('点击运行');
        C$4(o5, o6);
        C$4(o3, o4, o5);
        var o7 = IF$1([DV$4('changed')], o3);
        return [o1, o7];
    };
    template$7.creator = templateNodes$7;
    var id = 0;
    var transform = function transform(code) {
        var es6 = sleet.compile(code, {
            defaultPlugin: 'drizzle',
            plugins: { drizzle: SleetDrizzle.plugin }
        }).code;
        var es5 = Babel.transform(es6, { presets: ['es2015'] });
        return eval('(function(exports, require) {' + es5.code + '\nreturn exports.default })({}, require1)');
    };
    var _view_show = {
        updated: function updated() {
            var item = this.regions.showcase.item;

            if (!item) return;
            try {
                item.set(JSON.parse(this.get('json')));
            } catch (e) {
                console.log(e);
            }
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
        template: template$7,
        _file: 'repl/view-show.sleet'
    };

    var SA$6 = drizzlejs.factory.SA,
        CO$1 = drizzlejs.factory.CO,
        H$3 = drizzlejs.factory.H,
        DV$5 = drizzlejs.factory.DV,
        AC$3 = drizzlejs.factory.AC,
        AT$4 = drizzlejs.factory.AT,
        DN$5 = drizzlejs.factory.DN;


    var template$8 = new drizzlejs.ViewTemplate();
    var templateNodes$8 = function templateNodes() {
        var o1 = DN$5('div', 'editor');
        SA$6(o1, 'class', 'code-editor');
        CO$1(o1, 'ace-editor', H$3(DV$5('options')), H$3(DV$5('json')));
        AC$3(o1, 'codeChange', 'updateJson', AT$4('', DV$5('event')));
        return [o1];
    };
    template$8.creator = templateNodes$8;
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
        template: template$8,
        _file: 'repl/view-json.sleet'
    };

    var index = '#! drizzle\n\nmodule(name) > view-a(name)\n\nscript..\nexport default {\n    items: { views: [\'view-a\'] },\n    store: {\n        models: {\n            name: () => \'\'\n        }\n    }\n}\n';

    var view = '#! drizzle\n\nview\n    input.input(bind:value=name)\n    h3 hello $name !\n\nscript..\nexport default {\n}\n';

    var json = '{\n    "name": "world"\n}';

    var hw = {
        code: 'hello-world',
        name: 'Hello World',
        files: { index: index, 'view-a': view },
        json: json
    };

    var index$1 = '#! drizzle\n\nmodule(names) > view-a(names)\n\nscript..\nexport default {\n    items: { views: [\'view-a\'] },\n    store: {\n        models: {\n            names: () => []\n        }\n    }\n}\n';

    var view$1 = '#! drizzle\n\nview\n    .control\n        label(class=\'checkbox\')\n            input(type=\'checkbox\' bind:group=names value=\'a\')\n            |  a\n    .control\n        label(class=\'checkbox\')\n            input(type=\'checkbox\' bind:group=names value=\'b\')\n            |  b\n    .control\n        label(class=\'checkbox\')\n            input(type=\'checkbox\' bind:group=names value=\'c\')\n            |  c\n\n    p@each(names as name) $name checked\n\nscript..\nexport default {\n}\n';

    var json$1 = '{\n    "names": ["a", "b", "c"]\n}';

    var bg = {
        code: 'bind-group',
        name: 'Group binding',
        files: { index: index$1, 'view-a': view$1 },
        json: json$1
    };

    var index$2 = '#! drizzle\n\nmodule(number) > view-a(number)\n\nscript..\nexport default {\n    items: { views: [\'view-a\'] },\n    store: {\n        models: {\n            number: () => 200\n        }\n    }\n}\n';

    var view$2 = '#! drizzle\n\nview\n    div\n        h3 Simple\n        p@if(number > 10) greater then 10\n    div\n        h3 With else\n        p@if(number < 10) less then 10\n        p@else not less then 10\n    div\n        h3 With elseif\n        p@if(number < 10) less then 10\n        p@elseif(number < 20) less then 20\n        p@elseif(number < 40) less then 40\n        p@elseif(number < 80) less then 80\n        p@elseif(number < 160) less then 160\n        p@elseif(number <= 320) less then 320\n        p@else greater then 320\n\nscript..\nexport default {\n}\n';

    var json$2 = '{\n    "number": 200\n}';
    var ib = {
        code: 'if-block',
        name: 'If Block',
        files: { index: index$2, 'view-a': view$2 },
        json: json$2
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

    var SA$7 = drizzlejs.factory.SA,
        SN$5 = drizzlejs.factory.SN,
        MP$2 = drizzlejs.factory.MP,
        AC$4 = drizzlejs.factory.AC,
        AT$5 = drizzlejs.factory.AT,
        DV$6 = drizzlejs.factory.DV,
        REF$4 = drizzlejs.factory.REF,
        C$5 = drizzlejs.factory.C;

    var template$9 = new drizzlejs.ModuleTemplate([]);
    var templateNodes$9 = function templateNodes() {
        var o1 = SN$5('div');
        SA$7(o1, 'class', 'main-content');
        var o2 = SN$5('div');
        SA$7(o2, 'class', 'tile is-ancestor h100');
        var o3 = SN$5('div');
        SA$7(o3, 'class', 'tile is-6 is-parent br');
        var o4 = SN$5('div');
        SA$7(o4, 'class', 'tile is-child editor is-12');
        var o5 = REF$4('file-tab');
        MP$2(o5, 'tabs');
        AC$4(o5, 'change', 'switchFile', AT$5('', DV$6('event')));
        AC$4(o5, 'rename', 'renameFile', AT$5('', DV$6('event')));
        var o6 = REF$4('code-editor');
        MP$2(o6, 'code');
        AC$4(o6, 'change', 'updateCode', AT$5('', DV$6('event')));
        var o7 = REF$4('view-menu');
        MP$2(o7, 'examples');
        C$5(o4, o5, o6, o7);
        C$5(o3, o4);
        var o8 = SN$5('ad');
        SA$7(o8, 'class', 'tile is-6 is-vertical');
        var o9 = SN$5('div');
        SA$7(o9, 'class', 'tile is-parent');
        var o10 = SN$5('div');
        SA$7(o10, 'class', 'tile is-child is-relative');
        var o11 = REF$4('view-show');
        MP$2(o11, 'files');
        MP$2(o11, 'json');
        MP$2(o11, 'changed');
        C$5(o10, o11);
        C$5(o9, o10);
        var o12 = SN$5('div');
        SA$7(o12, 'class', 'tile is-parent bt');
        var o13 = SN$5('div');
        SA$7(o13, 'class', 'tile is-child editor');
        var o14 = REF$4('view-json');
        MP$2(o14, 'json');
        C$5(o13, o14);
        C$5(o12, o13);
        C$5(o8, o9, o12);
        C$5(o2, o3, o8);
        C$5(o1, o2);
        return [o1];
    };
    template$9.creator = templateNodes$9;
    var _repl_app = {
        items: {
            views: ['view-json', 'view-show', 'view-menu'],
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
                },
                examples: function examples() {
                    var _ref;

                    return _ref = {}, defineProperty(_ref, hw.code, hw), defineProperty(_ref, bg.code, bg), defineProperty(_ref, ib.code, ib), _ref;
                }
            },
            actions: {
                switchFile: function switchFile(_ref2) {
                    var from = _ref2.from,
                        to = _ref2.to;

                    this.set({ current: to });
                },
                updateCode: function updateCode(_ref3) {
                    var code = _ref3.code;

                    var files = this.get('files');
                    try {
                        sleet.compile(code, {
                            defaultPlugin: 'drizzle',
                            plugins: { drizzle: SleetDrizzle.plugin }
                        }).code;
                    } catch (e) {
                        console.log(e);
                    }
                    files[this.get('current')] = code;
                    this.set({
                        files: files,
                        changed: true
                    });
                },
                updateJson: function updateJson(_ref4) {
                    var detail = _ref4.detail;

                    this.set({ json: detail });
                },
                renameFile: function renameFile(_ref5) {
                    var name = _ref5.name,
                        old = _ref5.old;

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
                run: function run(_ref6) {
                    var changed = _ref6.changed;

                    this.set({ changed: changed });
                },
                changeExample: function changeExample(_ref7) {
                    var code = _ref7.code;

                    var examples = this.get('examples');
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
            tabs: function tabs(_ref8) {
                var files = _ref8.files;

                return Object.keys(files);
            },
            code: function code(_ref9) {
                var files = _ref9.files,
                    current = _ref9.current;

                return files[current];
            }
        },
        template: template$9,
        _file: 'repl/index.sleet',
        _loadedItems: {
            'view-json': _view_json,
            'view-show': _view_show,
            'view-menu': _view_menu,
            'repl/tab': _file_tab,
            'repl/editor': _code_editor,
            'component/dropdown': _c_dropdown
        }
    };

    var SA$8 = drizzlejs.factory.SA,
        SN$6 = drizzlejs.factory.SN,
        TX$4 = drizzlejs.factory.TX,
        C$6 = drizzlejs.factory.C;

    var template$a = new drizzlejs.ModuleTemplate([]);
    var templateNodes$a = function templateNodes() {
        var o1 = SN$6('div');
        SA$8(o1, 'class', 'sidebar');
        var o2 = SN$6('ul');
        SA$8(o2, 'class', 'menu-list1');
        var o3 = SN$6('li');
        SA$8(o3, 'class', 'menu-item1 active');
        var o4 = SN$6('a');
        var o5 = TX$4('hello');
        C$6(o4, o5);
        C$6(o3, o4);
        var o6 = SN$6('li');
        SA$8(o6, 'class', 'menu-item1');
        var o7 = SN$6('a');
        var o8 = TX$4('hello');
        C$6(o7, o8);
        C$6(o6, o7);
        var o9 = SN$6('li');
        SA$8(o9, 'class', 'menu-item1');
        var o10 = SN$6('a');
        var o11 = TX$4('hello');
        C$6(o10, o11);
        C$6(o9, o10);
        C$6(o2, o3, o6, o9);
        C$6(o1, o2);
        return [o1];
    };
    template$a.creator = templateNodes$a;
    var _app_menu = {
        template: template$a,
        _file: 'menu/index.sleet'
    };

    var SA$9 = drizzlejs.factory.SA,
        SN$7 = drizzlejs.factory.SN,
        TX$5 = drizzlejs.factory.TX,
        H$4 = drizzlejs.factory.H,
        DV$7 = drizzlejs.factory.DV,
        HH$1 = drizzlejs.factory.HH,
        SV$2 = drizzlejs.factory.SV,
        C$7 = drizzlejs.factory.C,
        DA$2 = drizzlejs.factory.DA,
        DN$6 = drizzlejs.factory.DN,
        AC$5 = drizzlejs.factory.AC,
        IF$2 = drizzlejs.factory.IF;


    var template$b = new drizzlejs.ViewTemplate();
    var templateNodes$b = function templateNodes() {
        var o1 = SN$7('footer');
        SA$9(o1, 'class', 'footer');
        var o2 = SN$7('span');
        SA$9(o2, 'class', 'todo-count');
        var o3 = SN$7('strong');
        var o4 = TX$5(H$4(DV$7('remaining')), ' ', HH$1('if', DV$7('remaining'), SV$2('=='), SV$2(1), SV$2(' item left'), SV$2(' items left')));
        C$7(o3, o4);
        C$7(o2, o3);
        var o5 = SN$7('ul');
        SA$9(o5, 'class', 'filters');
        var o6 = SN$7('li');
        var o7 = DN$6('a');
        SA$9(o7, 'href', '#/todos/all');
        DA$2(o7, 'class', HH$1('if', DV$7('filter'), SV$2('=='), SV$2('all'), SV$2('selected')));
        var o8 = TX$5('All');
        C$7(o7, o8);
        C$7(o6, o7);
        var o9 = SN$7('li');
        var o10 = DN$6('a');
        SA$9(o10, 'href', '#/todos/active');
        DA$2(o10, 'class', HH$1('if', DV$7('filter'), SV$2('=='), SV$2('active'), SV$2('selected')));
        var o11 = TX$5('Active');
        C$7(o10, o11);
        C$7(o9, o10);
        var o12 = SN$7('li');
        var o13 = DN$6('a');
        SA$9(o13, 'href', '#/todos/completed');
        DA$2(o13, 'class', HH$1('if', DV$7('filter'), SV$2('=='), SV$2('completed'), SV$2('selected')));
        var o14 = TX$5('Completed');
        C$7(o13, o14);
        C$7(o12, o13);
        C$7(o5, o6, o9, o12);
        var o15 = DN$6('button');
        SA$9(o15, 'class', 'clear-completed');
        AC$5(o15, 'click', 'clearCompleted');
        var o16 = TX$5('Clear completed');
        C$7(o15, o16);
        var o17 = IF$2([DV$7('haveCompleted')], o15);
        C$7(o1, o2, o5, o17);
        var o18 = IF$2([DV$7('todos.length')], o1);
        return [o18];
    };
    template$b.creator = templateNodes$b;
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
        template: template$b,
        _file: 'todos/todo-footer.sleet'
    };

    var SA$a = drizzlejs.factory.SA,
        SN$8 = drizzlejs.factory.SN,
        DA$3 = drizzlejs.factory.DA,
        H$5 = drizzlejs.factory.H,
        DV$8 = drizzlejs.factory.DV,
        AC$6 = drizzlejs.factory.AC,
        AT$6 = drizzlejs.factory.AT,
        DN$7 = drizzlejs.factory.DN,
        HH$2 = drizzlejs.factory.HH,
        SV$3 = drizzlejs.factory.SV,
        EV$2 = drizzlejs.factory.EV,
        TX$6 = drizzlejs.factory.TX,
        C$8 = drizzlejs.factory.C,
        BD$1 = drizzlejs.factory.BD,
        EACH$2 = drizzlejs.factory.EACH,
        IF$3 = drizzlejs.factory.IF;


    var template$c = new drizzlejs.ViewTemplate();
    var templateNodes$c = function templateNodes() {
        var o1 = SN$8('section');
        SA$a(o1, 'class', 'main');
        var o2 = DN$7('input');
        SA$a(o2, 'class', 'toggle-all');
        SA$a(o2, 'type', 'checkbox');
        SA$a(o2, 'id', 'toggle-all');
        DA$3(o2, 'checked', H$5(DV$8('allDone')));
        AC$6(o2, 'change', 'toggleAll', AT$6('completed', DV$8('this.checked')));
        var o3 = SN$8('label');
        SA$a(o3, 'for', 'toggle-all');
        var o4 = SN$8('ul');
        SA$a(o4, 'class', 'todo-list');
        var o5 = function o5() {
            var o6 = DN$7('li');
            DA$3(o6, 'class', HH$2('if', DV$8('todo.completed'), SV$3('completed')), HH$2('if', DV$8('todo'), SV$3('=='), DV$8('editing'), SV$3('editing')));
            var o7 = SN$8('div');
            SA$a(o7, 'class', 'view');
            var o8 = DN$7('input');
            SA$a(o8, 'class', 'toggle');
            SA$a(o8, 'type', 'checkbox');
            DA$3(o8, 'checked', H$5(DV$8('todo.completed')));
            AC$6(o8, 'change', 'toggle', AT$6('id', DV$8('todo.id')), AT$6('checked', DV$8('this.checked')));
            var o9 = DN$7('label');
            EV$2(o9, 'dblclick', 'edit', AT$6('', DV$8('todo')));
            var o10 = TX$6(H$5(DV$8('todo.name')));
            C$8(o9, o10);
            var o11 = DN$7('button');
            SA$a(o11, 'class', 'destroy');
            AC$6(o11, 'click', 'remove', AT$6('id', DV$8('todo.id')));
            C$8(o7, o8, o9, o11);
            var o12 = DN$7('input');
            SA$a(o12, 'class', 'edit');
            BD$1(o12, 'value', 'todo.name');
            AC$6(o12, 'blur', 'commitEdit', AT$6('', DV$8('todo.id')), AT$6('', DV$8('this.value')), AT$6('', SV$3('blur')));
            AC$6(o12, 'enter', 'commitEdit', AT$6('', DV$8('todo.id')), AT$6('', DV$8('this.value')), AT$6('', SV$3('enter')));
            AC$6(o12, 'escape', 'revertEdit', AT$6('', DV$8('todo')), AT$6('', DV$8('nameCache')));
            C$8(o6, o7, o12);
            return o6;
        };
        var o13 = EACH$2(['filtered', 'as', 'todo'], o5);
        C$8(o4, o13);
        C$8(o1, o2, o3, o4);
        var o14 = IF$3([DV$8('todos.length')], o1);
        return [o14];
    };
    template$c.creator = templateNodes$c;
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
        template: template$c,
        _file: 'todos/todo-list.sleet'
    };

    var SA$b = drizzlejs.factory.SA,
        AC$7 = drizzlejs.factory.AC,
        AT$7 = drizzlejs.factory.AT,
        DV$9 = drizzlejs.factory.DV,
        DN$8 = drizzlejs.factory.DN;


    var template$d = new drizzlejs.ViewTemplate();
    var templateNodes$d = function templateNodes() {
        var o1 = DN$8('input', 'create');
        SA$b(o1, 'class', 'new-todo');
        SA$b(o1, 'placeholder', 'What needs to be done?');
        AC$7(o1, 'enter', 'newTodo', AT$7('name', DV$9('this.value')));
        return [o1];
    };
    template$d.creator = templateNodes$d;
    var _create_todo = {
        actions: {
            newTodo: function newTodo(cb, payload) {
                if (!payload.name) return;
                this.ids.create.value = '';
                cb(payload);
            }
        },
        template: template$d,
        _file: 'todos/create-todo.sleet'
    };

    var SA$c = drizzlejs.factory.SA,
        SN$9 = drizzlejs.factory.SN,
        TX$7 = drizzlejs.factory.TX,
        C$9 = drizzlejs.factory.C,
        REF$5 = drizzlejs.factory.REF,
        MP$3 = drizzlejs.factory.MP;

    var template$e = new drizzlejs.ModuleTemplate(['todos']);
    var templateNodes$e = function templateNodes() {
        var o1 = SN$9('div');
        SA$c(o1, 'class', 'todoapp-container');
        var o2 = SN$9('section');
        SA$c(o2, 'class', 'todoapp');
        var o3 = SN$9('header');
        SA$c(o3, 'class', 'todo-header');
        var o4 = SN$9('h1');
        var o5 = TX$7('todos');
        C$9(o4, o5);
        var o6 = REF$5('create-todo');
        C$9(o3, o4, o6);
        var o7 = REF$5('todo-list');
        MP$3(o7, 'todos');
        MP$3(o7, 'filter');
        var o8 = REF$5('todo-footer');
        MP$3(o8, 'todos');
        MP$3(o8, 'filter');
        C$9(o2, o3, o7, o8);
        C$9(o1, o2);
        return [o1];
    };
    template$e.creator = templateNodes$e;
    var id$1 = 0;
    var _todo_app = {
        items: {
            views: ['create-todo', 'todo-list', 'todo-footer']
        },
        routes: { '/:filter': { action: 'updateFilter' } },
        store: {
            models: {
                todos: { data: function data() {
                        return [];
                    } },
                filter: { data: function data() {
                        return 'all';
                    } }
            },
            actions: {
                init: function init() {
                    this.set({
                        todos: [{
                            name: 'task 1~!',
                            completed: true,
                            id: id$1++
                        }, {
                            name: 'task 2',
                            id: id$1++
                        }]
                    });
                },
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
        template: template$e,
        _file: 'todos/index.sleet',
        _loadedItems: {
            'create-todo': _create_todo,
            'todo-list': _todo_list,
            'todo-footer': _todo_footer
        }
    };

    var REF$6 = drizzlejs.factory.REF,
        RG$2 = drizzlejs.factory.RG;

    var template$f = new drizzlejs.ModuleTemplate([]);
    var templateNodes$f = function templateNodes() {
        var o1 = REF$6('app-header');
        var o2 = RG$2();
        return [o1, o2];
    };
    template$f.creator = templateNodes$f;
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
            '/todos': 'todo-app',
            '/repl': 'repl-app'
        },
        template: template$f,
        _file: 'viewport/index.sleet',
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

}(Drizzle,Sleet));
//# sourceMappingURL=bundle.js.map
