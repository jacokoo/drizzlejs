(function (drizzlejs) {
    'use strict';

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
                event.stopPropagation();
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
            var o12 = SN$2('input', null, KV$3('autofocus', 'true'), KV$3('class', 'input'));
            var o13 = SN$2('span', null, KV$3('a', '1'));
            var o14 = TX$1(H$1('tab'), '.sleet');
            var o7 = IFC([DV$2('i'), DV$2('eq'), DV$2('current')], o8, o13);
            var o15 = SN$2('span', null, KV$3('class', 'delete is-small'));

            C$3(o9, o10);
            C$3(o11, o12);
            C$3(o8, o9, o11);
            C$3(o13, o14);
            C$3(o6, o7, o15);
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
        events: {
            onShow: function onShow() {
                this.ids.tabs.style.overflow = 'unset';
            },
            onHide: function onHide() {
                this.ids.tabs.style.overflow = '';
            }
        },
        template: template$4
    };

    var BD$1 = drizzlejs.factory.BD,
        REF$2 = drizzlejs.factory.REF;

    var template$5 = new drizzlejs.ModuleTemplate(['tabs']);
    var templateNodes$5 = function templateNodes() {
        var o1 = REF$2('view-tab', []);
        BD$1(o1, 'tabs', 'tabs');
        BD$1(o1, 'current', 'current');
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
                }
            }
        },
        template: template$5,
        _loadedItems: {
            'view-tab': _view_tab,
            'component/dropdown': _c_dropdown
        }
    };

    var KV$4 = drizzlejs.factory.KV,
        SN$3 = drizzlejs.factory.SN,
        C$4 = drizzlejs.factory.C,
        BD$2 = drizzlejs.factory.BD,
        AC$2 = drizzlejs.factory.AC,
        AT$3 = drizzlejs.factory.AT,
        SV$3 = drizzlejs.factory.SV,
        NSA$3 = drizzlejs.factory.NSA,
        DV$3 = drizzlejs.factory.DV,
        NDA$3 = drizzlejs.factory.NDA,
        REF$3 = drizzlejs.factory.REF,
        TX$2 = drizzlejs.factory.TX;

    var template$6 = new drizzlejs.ModuleTemplate([]);
    var templateNodes$6 = function templateNodes() {
        var o1 = SN$3('div', null, KV$4('class', 'main-content'));
        var o2 = SN$3('div', null, KV$4('class', 'tile is-ancestor h100'));
        var o3 = SN$3('div', null, KV$4('class', 'tile is-6 is-parent br'));
        var o4 = SN$3('div', null, KV$4('class', 'tile is-child editor is-12'));
        var o5 = REF$3('file-tab', []);
        BD$2(o5, 'tabs', 'tabs');
        AC$2(o5, 'change', 'switchFile', NDA$3('event'));
        var o6 = SN$3('div', null, KV$4('class', 'operators'));
        var o7 = REF$3('c-dropdown', []);
        var o8 = SN$3('div', null, KV$4('d', '2'), KV$4('class', 'dropdown-item'));
        var o9 = SN$3('p');
        var o10 = TX$2('abc');
        var o11 = REF$3('code-editor', []);
        BD$2(o11, 'code', 'code');
        AC$2(o11, 'change', 'updateCode', NDA$3('event'));
        var o12 = SN$3('div', null, KV$4('class', 'tile is-6 is-vertical'));
        var o13 = SN$3('div', null, KV$4('class', 'tile is-parent'));
        var o14 = SN$3('div', null, KV$4('class', 'tile is-child'));
        var o15 = SN$3('div', null, KV$4('class', 'tile is-parent bt'));
        var o16 = SN$3('div', null, KV$4('class', 'tile is-child'));
        C$4(o9, o10);
        C$4(o8, o9);
        C$4(o7, o8);
        C$4(o6, o7);
        C$4(o4, o5, o6, o11);
        C$4(o3, o4);
        C$4(o13, o14);
        C$4(o15, o16);
        C$4(o12, o13, o15);
        C$4(o2, o3, o12);
        C$4(o1, o2);
        return [o1];
    };
    var index = '#! drizzle\n\nmodule > view-a\n\nscript.\n    export default {\n        items: { views: [\'view-a\'] }\n    }\n';
    var view = '#! drizzle\n\nview\n    input(bind:value=name)\n    echo(\'hello\' name)\n';
    template$6.creator = templateNodes$6;
    var _repl_app = {
        items: {
            modules: {
                'file-tab': 'repl/tab',
                'code-editor': 'repl/editor',
                'c-dropdown': 'component/dropdown'
            }
        },
        store: {
            models: {
                files: function files() {
                    return {
                        index: index,
                        'view-a': view
                    };
                },
                current: function current() {
                    return 'index';
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
                    files[this.get('current')] = code;
                    this.set({ files: files });
                }
            }
        },
        computed: {
            tabs: function tabs(_ref3) {
                var files = _ref3.files;

                return Object.keys(files);
            },
            code: function code(_ref4) {
                var files = _ref4.files,
                    current = _ref4.current;

                return files[current];
            }
        },
        template: template$6,
        _loadedItems: {
            'repl/tab': _file_tab,
            'repl/editor': _code_editor,
            'component/dropdown': _c_dropdown
        }
    };

    var KV$5 = drizzlejs.factory.KV,
        SN$4 = drizzlejs.factory.SN,
        C$5 = drizzlejs.factory.C,
        TX$3 = drizzlejs.factory.TX;

    var template$7 = new drizzlejs.ModuleTemplate([]);
    var templateNodes$7 = function templateNodes() {
        var o1 = SN$4('div', null, KV$5('class', 'sidebar'));
        var o2 = SN$4('ul', null, KV$5('class', 'menu-list1'));
        var o3 = SN$4('li', null, KV$5('class', 'menu-item1 active'));
        var o4 = SN$4('a');
        var o5 = TX$3('hello');
        var o6 = SN$4('li', null, KV$5('class', 'menu-item1'));
        var o7 = SN$4('a');
        var o8 = TX$3('hello');
        var o9 = SN$4('li', null, KV$5('class', 'menu-item1'));
        var o10 = SN$4('a');
        var o11 = TX$3('hello');
        C$5(o4, o5);
        C$5(o3, o4);
        C$5(o7, o8);
        C$5(o6, o7);
        C$5(o10, o11);
        C$5(o9, o10);
        C$5(o2, o3, o6, o9);
        C$5(o1, o2);
        return [o1];
    };
    template$7.creator = templateNodes$7;
    var _app_menu = { template: template$7 };

    var KV$6 = drizzlejs.factory.KV,
        SN$5 = drizzlejs.factory.SN,
        C$6 = drizzlejs.factory.C,
        H$2 = drizzlejs.factory.H,
        TX$4 = drizzlejs.factory.TX,
        DV$4 = drizzlejs.factory.DV,
        SV$4 = drizzlejs.factory.SV,
        HH$1 = drizzlejs.factory.HH,
        DA$1 = drizzlejs.factory.DA,
        DN$3 = drizzlejs.factory.DN,
        AC$3 = drizzlejs.factory.AC,
        AT$4 = drizzlejs.factory.AT,
        NSA$4 = drizzlejs.factory.NSA,
        NDA$4 = drizzlejs.factory.NDA,
        IFC$1 = drizzlejs.factory.IFC;

    var template$8 = new drizzlejs.ViewTemplate();
    var templateNodes$8 = function templateNodes() {
        var o1 = SN$5('footer', null, KV$6('class', 'footer'));
        var o2 = SN$5('span', null, KV$6('class', 'todo-count'));
        var o3 = SN$5('strong');
        var o4 = TX$4(H$2('remaining'));
        var o5 = TX$4(HH$1('if', DV$4('remaining'), DV$4('eq'), SV$4(1), SV$4(' item left'), SV$4(' items left')));
        var o6 = SN$5('ul', null, KV$6('class', 'filters'));
        var o7 = SN$5('li');
        var o8 = DN$3('a', null, KV$6('href', '#/todos/all'));
        DA$1(o8, 'class', HH$1('if', DV$4('filter'), DV$4('eq'), SV$4('all'), SV$4('selected')));
        var o9 = TX$4('All');
        var o10 = SN$5('li');
        var o11 = DN$3('a', null, KV$6('href', '#/todos/active'));
        DA$1(o11, 'class', HH$1('if', DV$4('filter'), DV$4('eq'), SV$4('active'), SV$4('selected')));
        var o12 = TX$4('Active');
        var o13 = SN$5('li');
        var o14 = DN$3('a', null, KV$6('href', '#/todos/completed'));
        DA$1(o14, 'class', HH$1('if', DV$4('filter'), DV$4('eq'), SV$4('completed'), SV$4('selected')));
        var o15 = TX$4('Completed');
        var o17 = DN$3('button', null, KV$6('class', 'clear-completed'));
        AC$3(o17, 'click', 'clearCompleted');
        var o18 = TX$4('Clear completed');
        var o16 = IFC$1([DV$4('haveCompleted')], o17);

        C$6(o3, o4);
        C$6(o2, o3, o5);
        C$6(o8, o9);
        C$6(o7, o8);
        C$6(o11, o12);
        C$6(o10, o11);
        C$6(o14, o15);
        C$6(o13, o14);
        C$6(o6, o7, o10, o13);
        C$6(o17, o18);
        C$6(o1, o2, o6, o16);

        return [o1];
    };

    template$8.creator = templateNodes$8;

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
        template: template$8
    };

    var KV$7 = drizzlejs.factory.KV,
        SN$6 = drizzlejs.factory.SN,
        C$7 = drizzlejs.factory.C,
        DA$2 = drizzlejs.factory.DA,
        H$3 = drizzlejs.factory.H,
        SV$5 = drizzlejs.factory.SV,
        AC$4 = drizzlejs.factory.AC,
        AT$5 = drizzlejs.factory.AT,
        NSA$5 = drizzlejs.factory.NSA,
        DV$5 = drizzlejs.factory.DV,
        NDA$5 = drizzlejs.factory.NDA,
        DN$4 = drizzlejs.factory.DN,
        HH$2 = drizzlejs.factory.HH,
        EV$2 = drizzlejs.factory.EV,
        TX$5 = drizzlejs.factory.TX,
        BD$3 = drizzlejs.factory.BD,
        EACH$1 = drizzlejs.factory.EACH,
        IFC$2 = drizzlejs.factory.IFC;

    var template$9 = new drizzlejs.ViewTemplate();
    var templateNodes$9 = function templateNodes() {
        var o2 = SN$6('section', null, KV$7('class', 'main'));
        var o3 = DN$4('input', null, KV$7('type', 'checkbox'), KV$7('id', 'toggle-all'), KV$7('class', 'toggle-all'));
        DA$2(o3, 'checked', H$3('allDone'));
        AC$4(o3, 'change', 'toggleAll', AT$5('completed', DV$5('this.checked')));
        var o4 = SN$6('label', null, KV$7('for', 'toggle-all'));
        var o5 = SN$6('ul', null, KV$7('class', 'todo-list'));
        var o7 = function o7() {
            var o8 = DN$4('li');
            DA$2(o8, 'class', HH$2('if', DV$5('todo.completed'), SV$5('completed')), HH$2('if', DV$5('todo'), DV$5('eq'), DV$5('editing'), SV$5('editing')));
            var o9 = SN$6('div', null, KV$7('class', 'view'));
            var o10 = DN$4('input', null, KV$7('type', 'checkbox'), KV$7('class', 'toggle'));
            DA$2(o10, 'checked', H$3('todo.completed'));
            AC$4(o10, 'change', 'toggle', AT$5('id', DV$5('todo.id')), AT$5('checked', DV$5('this.checked')));
            var o11 = DN$4('label');
            EV$2(o11, 'dblclick', 'edit', NDA$5('todo'));
            var o12 = TX$5(H$3('todo.name'));
            var o13 = DN$4('button', null, KV$7('class', 'destroy'));
            AC$4(o13, 'click', 'remove', AT$5('id', DV$5('todo.id')));
            var o14 = DN$4('input', null, KV$7('class', 'edit'));
            BD$3(o14, 'value', 'todo.name');
            AC$4(o14, 'blur', 'commitEdit', NDA$5('todo.id'), NDA$5('this.value'), NSA$5('blur'));
            AC$4(o14, 'enter', 'commitEdit', NDA$5('todo.id'), NDA$5('this.value'), NSA$5('enter'));
            AC$4(o14, 'escape', 'revertEdit', NDA$5('todo'), NDA$5('nameCache'));

            C$7(o11, o12);
            C$7(o9, o10, o11, o13);
            C$7(o8, o9, o14);
            return o8;
        };
        var o6 = EACH$1(['filtered', 'as', 'todo'], o7);
        var o1 = IFC$2([DV$5('todos.length')], o2);

        C$7(o5, o6);
        C$7(o2, o3, o4, o5);

        return [o1];
    };

    template$9.creator = templateNodes$9;

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
        template: template$9
    };

    var KV$8 = drizzlejs.factory.KV,
        AC$5 = drizzlejs.factory.AC,
        AT$6 = drizzlejs.factory.AT,
        SV$6 = drizzlejs.factory.SV,
        NSA$6 = drizzlejs.factory.NSA,
        DV$6 = drizzlejs.factory.DV,
        NDA$6 = drizzlejs.factory.NDA,
        DN$5 = drizzlejs.factory.DN,
        C$8 = drizzlejs.factory.C;

    var template$a = new drizzlejs.ViewTemplate();
    var templateNodes$a = function templateNodes() {
        var o1 = DN$5('input', 'create', KV$8('placeholder', 'What needs to be done?'), KV$8('class', 'new-todo'));
        AC$5(o1, 'enter', 'newTodo', AT$6('name', DV$6('this.value')));

        return [o1];
    };

    template$a.creator = templateNodes$a;

    var _create_todo = {
        actions: {
            newTodo: function newTodo(cb, payload) {
                if (!payload.name) return;
                this.ids.create.value = '';
                cb(payload);
            }
        },
        template: template$a
    };

    var KV$9 = drizzlejs.factory.KV,
        SN$7 = drizzlejs.factory.SN,
        C$9 = drizzlejs.factory.C,
        TX$6 = drizzlejs.factory.TX,
        REF$4 = drizzlejs.factory.REF,
        BD$4 = drizzlejs.factory.BD;

    var template$b = new drizzlejs.ModuleTemplate(['todos']);
    var templateNodes$b = function templateNodes() {
        var o1 = SN$7('div', null, KV$9('class', 'todoapp-container'));
        var o2 = SN$7('section', null, KV$9('class', 'todoapp'));
        var o3 = SN$7('header', null, KV$9('class', 'header'));
        var o4 = SN$7('h1');
        var o5 = TX$6('todos');
        var o6 = REF$4('create-todo', []);
        var o7 = REF$4('todo-list', []);
        BD$4(o7, 'todos', 'todos');
        BD$4(o7, 'filter', 'filter');
        var o8 = REF$4('todo-footer', []);
        BD$4(o8, 'todos', 'todos');
        BD$4(o8, 'filter', 'filter');
        C$9(o4, o5);
        C$9(o3, o4, o6);
        C$9(o2, o3, o7, o8);
        C$9(o1, o2);
        return [o1];
    };
    var id = 0;
    template$b.creator = templateNodes$b;
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
                            id: id++
                        }, {
                            name: 'task 2',
                            id: id++
                        }];
                    }
                },
                filter: { data: function data() {
                        return 'all';
                    } }
            },
            actions: {
                newTodo: function newTodo(payload) {
                    this.set({ todos: this.get('todos').concat([Object.assign(payload, { id: id++ })]) });
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
        template: template$b,
        _loadedItems: {
            'create-todo': _create_todo,
            'todo-list': _todo_list,
            'todo-footer': _todo_footer
        }
    };

    var REF$5 = drizzlejs.factory.REF,
        RG$1 = drizzlejs.factory.RG;

    var template$c = new drizzlejs.ModuleTemplate([]);
    var templateNodes$c = function templateNodes() {
        var o1 = REF$5('app-header', []);
        var o2 = RG$1();
        return [o1, o2];
    };
    template$c.creator = templateNodes$c;
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
        template: template$c,
        _loadedItems: {
            'todos': _todo_app,
            'main/menu': _app_menu,
            'repl': _repl_app,
            'main/header': _app_header
        }
    };

    function editor(node) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var code = arguments[2];

        var editor = ace.edit(node, options);
        var current = code;
        editor.setValue(code, -1);

        var busy = false;
        var handler = function handler() {
            if (busy) return;
            current = editor.getValue();
            node.dispatchEvent(new CustomEvent('codeChange', { detail: current }));
        };

        editor.on('change', handler);

        return {
            update: function update(options, code) {
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

}(drizzlejs));
//# sourceMappingURL=bundle.js.map
