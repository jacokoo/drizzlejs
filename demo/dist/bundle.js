(function (drizzlejs) {
    'use strict';

    var KV = drizzlejs.factory.KV,
        SN = drizzlejs.factory.SN,
        C = drizzlejs.factory.C,
        TX = drizzlejs.factory.TX;

    var template = new drizzlejs.ModuleTemplate([]);
    var o1 = SN('div', null, KV('class', 'brand-title'));
    var o2 = SN('span', null, KV('style', 'font-weight: 400;'));
    var o3 = TX('D');
    var o4 = SN('span', null);
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
    template.nodes = [o1, o6];
    var _app_header = { template: template };

    var E = drizzlejs.factory.E,
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

    var template$1 = new drizzlejs.ModuleTemplate([]);
    var o1$1 = DN('div', 'dropdown', [KV$1('class', 'dropdown operators')], [], [], [E('click', 'clickIt', NDA('event'), NDA('this'))], []);
    var o2$1 = SN$1('div', null, KV$1('class', 'dropdown-trigger'));
    var o3$1 = SN$1('button', null, KV$1('class', 'button'));
    var o4$1 = SN$1('span', null, KV$1('class', 'icon is-small'));
    var o5$1 = SN$1('svg', null, KV$1('viewBox', '0 0 129 129'), KV$1('enable-background', 'new 0 0 129 129'));
    var o6$1 = SN$1('g', null);
    var o7$1 = SN$1('path', null, KV$1('d', 'm121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z'));
    var o8$1 = SN$1('div', null, KV$1('class', 'dropdown-menu'));
    var o9$1 = SN$1('div', null, KV$1('class', 'dropdown-content'));
    var o10$1 = RG();
    C$1(o6$1, o7$1);
    C$1(o5$1, o6$1);
    C$1(o4$1, o5$1);
    C$1(o3$1, o4$1);
    C$1(o2$1, o3$1);
    C$1(o9$1, o10$1);
    C$1(o8$1, o9$1);
    C$1(o1$1, o2$1, o8$1);
    template$1.nodes = [o1$1];
    var _c_dropdown = {
        events: {
            clickIt: function clickIt(e, it) {
                var _this2 = this;

                event.stopPropagation();
                if (!this.dropdownHandler) {
                    this.dropdownHandler = function () {
                        it.classList.remove('is-active');
                        document.removeEventListener('click', _this2.dropdownHandler);
                        _this2.dropdownHandler = null;
                    };
                    it.classList.add('is-active');
                    document.addEventListener('click', this.dropdownHandler, false);
                    return;
                }
                this.dropdownHandler();
            }
        },
        beforeDestroy: function beforeDestroy() {
            if (this.dropdownHandler) this.dropdownHandler();
        },

        template: template$1
    };

    var KV$2 = drizzlejs.factory.KV,
        SN$2 = drizzlejs.factory.SN,
        C$2 = drizzlejs.factory.C;

    var template$2 = new drizzlejs.ViewTemplate();
    var o1$2 = SN$2('div', 'editor', KV$2('class', 'code-editor'));

    template$2.nodes = [o1$2];

    var _view_editor = {
        rendered: function rendered() {
            console.log(this.get('code'), this._status);
            this.editor = ace.edit(this.ids.editor, {
                fontFamily: 'Inconsolata, monospace',
                fontSize: '13px',
                showPrintMargin: false,
                mode: 'ace/mode/sleet',
                theme: 'ace/theme/xcode'
            });
            this.editor.setValue('#! drizzle\n\nmodule\n    div\n\nscript.\n    export default {\n    }\n', -1);
        },
        updated: function updated() {
            console.log('updated', this._status);
        },

        template: template$2
    };

    var KV$3 = drizzlejs.factory.KV,
        REF = drizzlejs.factory.REF;

    var template$3 = new drizzlejs.ModuleTemplate(['code']);
    var o1$3 = REF('view-editor', null, [KV$3('code')], [], []);
    template$3.nodes = [o1$3];
    var _code_editor = {
        items: { views: ['view-editor'] },
        store: { models: { code: function code() {
                    return '';
                } } },
        template: template$3,
        _loadedItems: { 'view-editor': _view_editor }
    };

    var HH = drizzlejs.factory.HH,
        DV$1 = drizzlejs.factory.DV,
        SV$1 = drizzlejs.factory.SV,
        DA = drizzlejs.factory.DA,
        DN$1 = drizzlejs.factory.DN,
        C$3 = drizzlejs.factory.C,
        SN$3 = drizzlejs.factory.SN,
        H = drizzlejs.factory.H,
        TX$1 = drizzlejs.factory.TX,
        KV$4 = drizzlejs.factory.KV,
        EACH = drizzlejs.factory.EACH;

    var template$4 = new drizzlejs.ViewTemplate();
    var o2$2 = function o2() {
        var o3 = DN$1('li', null, [], [DA('class', HH('if', DV$1('i'), DV$1('eq'), DV$1('current'), SV$1('is-active')))], [], [], []);
        var o4 = SN$3('a', null);
        var o5 = SN$3('span', null);
        var o6 = TX$1(H('tab'), '.sleet');
        var o7 = SN$3('span', null, KV$4('class', 'delete is-small'));

        C$3(o5, o6);
        C$3(o4, o5, o7);
        C$3(o3, o4);
        return o3;
    };
    var o1$4 = EACH(['tabs', 'as', 'tab', 'i'], o2$2);

    template$4.nodes = [o1$4];

    var _view_tab = { template: template$4 };

    var KV$5 = drizzlejs.factory.KV,
        SN$4 = drizzlejs.factory.SN,
        C$4 = drizzlejs.factory.C,
        REF$1 = drizzlejs.factory.REF;

    var template$5 = new drizzlejs.ModuleTemplate(['tabs']);
    var o1$5 = SN$4('div', null, KV$5('class', 'tabs'));
    var o2$3 = SN$4('ul', null);
    var o3$2 = REF$1('view-tab', null, [KV$5('tabs'), KV$5('current')], [], []);
    C$4(o2$3, o3$2);
    C$4(o1$5, o2$3);
    template$5.nodes = [o1$5];
    var _file_tab = {
        items: { views: ['view-tab'] },
        store: {
            models: {
                tabs: function tabs() {
                    return [];
                },
                current: function current() {
                    return 1;
                }
            }
        },
        rendered: function rendered() {
            console.log(this.get(), 'index');
        },

        template: template$5,
        _loadedItems: { 'view-tab': _view_tab }
    };

    var KV$6 = drizzlejs.factory.KV,
        SN$5 = drizzlejs.factory.SN,
        C$5 = drizzlejs.factory.C,
        REF$2 = drizzlejs.factory.REF,
        TX$2 = drizzlejs.factory.TX;

    var template$6 = new drizzlejs.ModuleTemplate([]);
    var o1$6 = SN$5('div', null, KV$6('class', 'main-content'));
    var o2$4 = SN$5('div', null, KV$6('class', 'tile is-ancestor h100'));
    var o3$3 = SN$5('div', null, KV$6('class', 'tile is-6 is-parent br'));
    var o4$2 = SN$5('div', null, KV$6('class', 'tile is-child editor is-12'));
    var o5$2 = REF$2('file-tab', null, [KV$6('tabs')], [], []);
    var o6$2 = REF$2('c-dropdown', null, [], [], []);
    var o7$2 = SN$5('div', null, KV$6('class', 'dropdown-item'));
    var o8$2 = SN$5('p', null);
    var o9$2 = TX$2('abc');
    var o10$2 = REF$2('code-editor', null, [], [], []);
    var o11$1 = SN$5('div', null, KV$6('class', 'tile is-6 is-vertical'));
    var o12$1 = SN$5('div', null, KV$6('class', 'tile is-parent'));
    var o13$1 = SN$5('div', null, KV$6('class', 'tile is-child'));
    var o14$1 = SN$5('div', null, KV$6('class', 'tile is-parent bt'));
    var o15$1 = SN$5('div', null, KV$6('class', 'tile is-child'));
    C$5(o8$2, o9$2);
    C$5(o7$2, o8$2);
    C$5(o6$2, o7$2);
    C$5(o4$2, o5$2, o6$2, o10$2);
    C$5(o3$3, o4$2);
    C$5(o12$1, o13$1);
    C$5(o14$1, o15$1);
    C$5(o11$1, o12$1, o14$1);
    C$5(o2$4, o3$3, o11$1);
    C$5(o1$6, o2$4);
    template$6.nodes = [o1$6];
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
                        index: '',
                        'view-a': ''
                    };
                },
                current: function current() {
                    return 'index';
                }
            }
        },
        computed: {
            tabs: function tabs(context) {
                return Object.keys(context.files);
            }
        },
        template: template$6,
        _loadedItems: {
            'repl/tab': _file_tab,
            'repl/editor': _code_editor,
            'component/dropdown': _c_dropdown
        }
    };

    var KV$7 = drizzlejs.factory.KV,
        SN$6 = drizzlejs.factory.SN,
        C$6 = drizzlejs.factory.C,
        TX$3 = drizzlejs.factory.TX;

    var template$7 = new drizzlejs.ModuleTemplate([]);
    var o1$7 = SN$6('div', null, KV$7('class', 'sidebar'));
    var o2$5 = SN$6('ul', null, KV$7('class', 'menu-list1'));
    var o3$4 = SN$6('li', null, KV$7('class', 'menu-item1 active'));
    var o4$3 = SN$6('a', null);
    var o5$3 = TX$3('hello');
    var o6$3 = SN$6('li', null, KV$7('class', 'menu-item1'));
    var o7$3 = SN$6('a', null);
    var o8$3 = TX$3('hello');
    var o9$3 = SN$6('li', null, KV$7('class', 'menu-item1'));
    var o10$3 = SN$6('a', null);
    var o11$2 = TX$3('hello');
    C$6(o4$3, o5$3);
    C$6(o3$4, o4$3);
    C$6(o7$3, o8$3);
    C$6(o6$3, o7$3);
    C$6(o10$3, o11$2);
    C$6(o9$3, o10$3);
    C$6(o2$5, o3$4, o6$3, o9$3);
    C$6(o1$7, o2$5);
    template$7.nodes = [o1$7];
    var _app_menu = { template: template$7 };

    var KV$8 = drizzlejs.factory.KV,
        SN$7 = drizzlejs.factory.SN,
        C$7 = drizzlejs.factory.C,
        H$1 = drizzlejs.factory.H,
        TX$4 = drizzlejs.factory.TX,
        DV$2 = drizzlejs.factory.DV,
        SV$2 = drizzlejs.factory.SV,
        HH$1 = drizzlejs.factory.HH,
        DA$1 = drizzlejs.factory.DA,
        DN$2 = drizzlejs.factory.DN,
        A = drizzlejs.factory.A,
        AT$1 = drizzlejs.factory.AT,
        NSA$1 = drizzlejs.factory.NSA,
        NDA$1 = drizzlejs.factory.NDA,
        IFC = drizzlejs.factory.IFC;

    var template$8 = new drizzlejs.ViewTemplate();
    var o1$8 = SN$7('footer', null, KV$8('class', 'footer'));
    var o2$6 = SN$7('span', null, KV$8('class', 'todo-count'));
    var o3$5 = SN$7('strong', null);
    var o4$4 = TX$4(H$1('remaining'));
    var o5$4 = TX$4(HH$1('if', DV$2('remaining'), DV$2('eq'), SV$2(1), SV$2(' item left'), SV$2(' items left')));
    var o6$4 = SN$7('ul', null, KV$8('class', 'filters'));
    var o7$4 = SN$7('li', null);
    var o8$4 = DN$2('a', null, [KV$8('href', '#/todos/all')], [DA$1('class', HH$1('if', DV$2('filter'), DV$2('eq'), SV$2('all'), SV$2('selected')))], [], [], []);
    var o9$4 = TX$4('All');
    var o10$4 = SN$7('li', null);
    var o11$3 = DN$2('a', null, [KV$8('href', '#/todos/active')], [DA$1('class', HH$1('if', DV$2('filter'), DV$2('eq'), SV$2('active'), SV$2('selected')))], [], [], []);
    var o12$2 = TX$4('Active');
    var o13$2 = SN$7('li', null);
    var o14$2 = DN$2('a', null, [KV$8('href', '#/todos/completed')], [DA$1('class', HH$1('if', DV$2('filter'), DV$2('eq'), SV$2('completed'), SV$2('selected')))], [], [], []);
    var o15$2 = TX$4('Completed');
    var o17 = DN$2('button', null, [KV$8('class', 'clear-completed')], [], [], [], [A('click', 'clearCompleted')]);
    var o18 = TX$4('Clear completed');
    var o16$1 = IFC([DV$2('haveCompleted')], o17);

    C$7(o3$5, o4$4);
    C$7(o2$6, o3$5, o5$4);
    C$7(o8$4, o9$4);
    C$7(o7$4, o8$4);
    C$7(o11$3, o12$2);
    C$7(o10$4, o11$3);
    C$7(o14$2, o15$2);
    C$7(o13$2, o14$2);
    C$7(o6$4, o7$4, o10$4, o13$2);
    C$7(o17, o18);
    C$7(o1$8, o2$6, o6$4, o16$1);
    template$8.nodes = [o1$8];

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

    var KV$9 = drizzlejs.factory.KV,
        SN$8 = drizzlejs.factory.SN,
        C$8 = drizzlejs.factory.C,
        H$2 = drizzlejs.factory.H,
        SV$3 = drizzlejs.factory.SV,
        DA$2 = drizzlejs.factory.DA,
        A$1 = drizzlejs.factory.A,
        AT$2 = drizzlejs.factory.AT,
        NSA$2 = drizzlejs.factory.NSA,
        DV$3 = drizzlejs.factory.DV,
        NDA$2 = drizzlejs.factory.NDA,
        DN$3 = drizzlejs.factory.DN,
        HH$2 = drizzlejs.factory.HH,
        E$1 = drizzlejs.factory.E,
        TX$5 = drizzlejs.factory.TX,
        B = drizzlejs.factory.B,
        EACH$1 = drizzlejs.factory.EACH,
        IFC$1 = drizzlejs.factory.IFC;

    var template$9 = new drizzlejs.ViewTemplate();
    var o2$7 = SN$8('section', null, KV$9('class', 'main'));
    var o3$6 = DN$3('input', null, [KV$9('type', 'checkbox'), KV$9('id', 'toggle-all'), KV$9('class', 'toggle-all')], [DA$2('checked', H$2('allDone'))], [], [], [A$1('change', 'toggleAll', AT$2('completed', DV$3('this.checked')))]);
    var o4$5 = SN$8('label', null, KV$9('for', 'toggle-all'));
    var o5$5 = SN$8('ul', null, KV$9('class', 'todo-list'));
    var o7$5 = function o7() {
        var o8 = DN$3('li', null, [], [DA$2('class', HH$2('if', DV$3('todo.completed'), SV$3('completed')), HH$2('if', DV$3('todo'), DV$3('eq'), DV$3('editing'), SV$3('editing')))], [], [], []);
        var o9 = SN$8('div', null, KV$9('class', 'view'));
        var o10 = DN$3('input', null, [KV$9('type', 'checkbox'), KV$9('class', 'toggle')], [DA$2('checked', H$2('todo.completed'))], [], [], [A$1('change', 'toggle', AT$2('id', DV$3('todo.id')), AT$2('checked', DV$3('this.checked')))]);
        var o11 = DN$3('label', null, [], [], [], [E$1('dblclick', 'edit', NDA$2('todo'))], []);
        var o12 = TX$5(H$2('todo.name'));
        var o13 = DN$3('button', null, [KV$9('class', 'destroy')], [], [], [], [A$1('click', 'remove', AT$2('id', DV$3('todo.id')))]);
        var o14 = DN$3('input', null, [KV$9('class', 'edit')], [], [B('value', 'todo.name')], [], [A$1('blur', 'commitEdit', NDA$2('todo.id'), NDA$2('this.value'), NSA$2('blur')), A$1('enter', 'commitEdit', NDA$2('todo.id'), NDA$2('this.value'), NSA$2('enter')), A$1('escape', 'revertEdit', NDA$2('todo'), NDA$2('nameCache'))]);

        C$8(o11, o12);
        C$8(o9, o10, o11, o13);
        C$8(o8, o9, o14);
        return o8;
    };
    var o6$5 = EACH$1(['filtered', 'as', 'todo'], o7$5);
    var o1$9 = IFC$1([DV$3('todos.length')], o2$7);

    C$8(o5$5, o6$5);
    C$8(o2$7, o3$6, o4$5, o5$5);
    template$9.nodes = [o1$9];

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

    var KV$a = drizzlejs.factory.KV,
        A$2 = drizzlejs.factory.A,
        AT$3 = drizzlejs.factory.AT,
        SV$4 = drizzlejs.factory.SV,
        NSA$3 = drizzlejs.factory.NSA,
        DV$4 = drizzlejs.factory.DV,
        NDA$3 = drizzlejs.factory.NDA,
        DN$4 = drizzlejs.factory.DN,
        C$9 = drizzlejs.factory.C;

    var template$a = new drizzlejs.ViewTemplate();
    var o1$a = DN$4('input', 'create', [KV$a('placeholder', 'What needs to be done?'), KV$a('class', 'new-todo')], [], [], [], [A$2('enter', 'newTodo', AT$3('name', DV$4('this.value')))]);

    template$a.nodes = [o1$a];

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

    var KV$b = drizzlejs.factory.KV,
        SN$9 = drizzlejs.factory.SN,
        C$a = drizzlejs.factory.C,
        TX$6 = drizzlejs.factory.TX,
        REF$3 = drizzlejs.factory.REF;

    var template$b = new drizzlejs.ModuleTemplate(['todos']);
    var o1$b = SN$9('div', null, KV$b('class', 'todoapp-container'));
    var o2$8 = SN$9('section', null, KV$b('class', 'todoapp'));
    var o3$7 = SN$9('header', null, KV$b('class', 'header'));
    var o4$6 = SN$9('h1', null);
    var o5$6 = TX$6('todos');
    var o6$6 = REF$3('create-todo', null, [], [], []);
    var o7$6 = REF$3('todo-list', null, [KV$b('todos'), KV$b('filter')], [], []);
    var o8$5 = REF$3('todo-footer', null, [KV$b('todos'), KV$b('filter')], [], []);
    var id = 0;
    C$a(o4$6, o5$6);
    C$a(o3$7, o4$6, o6$6);
    C$a(o2$8, o3$7, o7$6, o8$5);
    C$a(o1$b, o2$8);
    template$b.nodes = [o1$b];
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

    var REF$4 = drizzlejs.factory.REF,
        RG$1 = drizzlejs.factory.RG;

    var template$c = new drizzlejs.ModuleTemplate([]);
    var o1$c = REF$4('app-header', null, [], [], []);
    var o2$9 = RG$1();
    template$c.nodes = [o1$c, o2$9];
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
