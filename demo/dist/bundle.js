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

    var KV$1 = drizzlejs.factory.KV,
        SN$1 = drizzlejs.factory.SN,
        C$1 = drizzlejs.factory.C,
        TX$1 = drizzlejs.factory.TX;

    var template$1 = new drizzlejs.ModuleTemplate([]);
    var o1$1 = SN$1('div', null, KV$1('class', 'tabs'));
    var o2$1 = SN$1('ul', null);
    var o3$1 = SN$1('li', null, KV$1('class', 'is-active'));
    var o4$1 = SN$1('a', null);
    var o5$1 = SN$1('span', null);
    var o6$1 = TX$1('index.sleet');
    var o7$1 = SN$1('span', null, KV$1('class', 'delete is-small'));
    var o8$1 = SN$1('li', null);
    var o9$1 = SN$1('a', null);
    var o10$1 = SN$1('span', null);
    var o11$1 = TX$1('view-1.sleet');
    var o12$1 = SN$1('span', null, KV$1('class', 'delete is-small'));
    var o13$1 = SN$1('li', null);
    var o14$1 = SN$1('a', null);
    var o15$1 = SN$1('span', null);
    var o16$1 = TX$1('view-2.sleet');
    var o17 = SN$1('span', null, KV$1('class', 'delete is-small'));
    C$1(o5$1, o6$1);
    C$1(o4$1, o5$1, o7$1);
    C$1(o3$1, o4$1);
    C$1(o10$1, o11$1);
    C$1(o9$1, o10$1, o12$1);
    C$1(o8$1, o9$1);
    C$1(o15$1, o16$1);
    C$1(o14$1, o15$1, o17);
    C$1(o13$1, o14$1);
    C$1(o2$1, o3$1, o8$1, o13$1);
    C$1(o1$1, o2$1);
    template$1.nodes = [o1$1];
    var _file_tab = { template: template$1 };

    var KV$2 = drizzlejs.factory.KV,
        SN$2 = drizzlejs.factory.SN,
        C$2 = drizzlejs.factory.C,
        RG = drizzlejs.factory.RG,
        TX$2 = drizzlejs.factory.TX;

    var template$2 = new drizzlejs.ModuleTemplate([]);
    var o1$2 = SN$2('div', null, KV$2('class', 'main'));
    var o2$2 = SN$2('div', null, KV$2('class', 'header'));
    var o3$2 = RG('header');
    var o4$2 = SN$2('div', null, KV$2('region', 'header'), KV$2('class', 'in-header'));
    var o5$2 = SN$2('ul', null, KV$2('class', 'header-nav'));
    var o6$2 = SN$2('li', null, KV$2('class', 'header-nav-item active'));
    var o7$2 = SN$2('a', null, KV$2('href', '#/guide'));
    var o8$2 = TX$2('开始使用');
    var o9$2 = SN$2('li', null, KV$2('class', 'header-nav-item'));
    var o10$2 = SN$2('a', null, KV$2('href', '#/repl'));
    var o11$2 = TX$2('在线试用');
    var o12$2 = SN$2('li', null, KV$2('class', 'header-nav-item'));
    var o13$2 = SN$2('a', null, KV$2('href', '#/demos'));
    var o14$2 = TX$2('示例集合');
    var o15$2 = SN$2('div', null, KV$2('class', 'main-content'));
    var o16$2 = RG();
    C$2(o7$2, o8$2);
    C$2(o6$2, o7$2);
    C$2(o10$2, o11$2);
    C$2(o9$2, o10$2);
    C$2(o13$2, o14$2);
    C$2(o12$2, o13$2);
    C$2(o5$2, o6$2, o9$2, o12$2);
    C$2(o4$2, o5$2);
    C$2(o3$2, o4$2);
    C$2(o2$2, o3$2);
    C$2(o15$2, o16$2);
    C$2(o1$2, o2$2, o15$2);
    template$2.nodes = [o1$2];
    var _content_layout = { template: template$2 };

    var KV$3 = drizzlejs.factory.KV,
        SN$3 = drizzlejs.factory.SN,
        C$3 = drizzlejs.factory.C,
        REF = drizzlejs.factory.REF,
        TX$3 = drizzlejs.factory.TX;

    var template$3 = new drizzlejs.ModuleTemplate([]);
    var o1$3 = SN$3('div', null, KV$3('class', 'main-content'));
    var o2$3 = SN$3('div', null, KV$3('class', 'tile is-ancestor h100'));
    var o3$3 = SN$3('div', null, KV$3('class', 'tile is-6 is-parent br'));
    var o4$3 = SN$3('div', null, KV$3('class', 'tile is-child editor is-12'));
    var o5$3 = REF('file-tab', null, [], [], []);
    var o6$3 = SN$3('span', null, KV$3('class', 'create-file'));
    var o7$3 = TX$3('+');
    var o8$3 = SN$3('div', 'editor', KV$3('id', 'editor'));
    var o9$3 = SN$3('div', null, KV$3('class', 'tile is-6 is-vertical'));
    var o10$3 = SN$3('div', null, KV$3('class', 'tile is-parent'));
    var o11$3 = SN$3('div', null, KV$3('class', 'tile is-child'));
    var o12$3 = SN$3('div', null, KV$3('class', 'tile is-parent bt'));
    var o13$3 = SN$3('div', null, KV$3('class', 'tile is-child'));
    C$3(o6$3, o7$3);
    C$3(o4$3, o5$3, o6$3, o8$3);
    C$3(o3$3, o4$3);
    C$3(o10$3, o11$3);
    C$3(o12$3, o13$3);
    C$3(o9$3, o10$3, o12$3);
    C$3(o2$3, o3$3, o9$3);
    C$3(o1$3, o2$3);
    template$3.nodes = [o1$3];
    var _repl_app = {
        items: {
            modules: {
                'content-layout': 'main/content-layout',
                'file-tab': 'repl/tab'
            }
        },
        rendered: function rendered() {
            console.log(arguments);
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
            console.log('updated');
        },

        template: template$3,
        _loadedItems: {
            'main/content-layout': _content_layout,
            'repl/tab': _file_tab
        }
    };

    var KV$4 = drizzlejs.factory.KV,
        SN$4 = drizzlejs.factory.SN,
        C$4 = drizzlejs.factory.C,
        TX$4 = drizzlejs.factory.TX;

    var template$4 = new drizzlejs.ModuleTemplate([]);
    var o1$4 = SN$4('div', null, KV$4('class', 'sidebar'));
    var o2$4 = SN$4('ul', null, KV$4('class', 'menu-list1'));
    var o3$4 = SN$4('li', null, KV$4('class', 'menu-item1 active'));
    var o4$4 = SN$4('a', null);
    var o5$4 = TX$4('hello');
    var o6$4 = SN$4('li', null, KV$4('class', 'menu-item1'));
    var o7$4 = SN$4('a', null);
    var o8$4 = TX$4('hello');
    var o9$4 = SN$4('li', null, KV$4('class', 'menu-item1'));
    var o10$4 = SN$4('a', null);
    var o11$4 = TX$4('hello');
    C$4(o4$4, o5$4);
    C$4(o3$4, o4$4);
    C$4(o7$4, o8$4);
    C$4(o6$4, o7$4);
    C$4(o10$4, o11$4);
    C$4(o9$4, o10$4);
    C$4(o2$4, o3$4, o6$4, o9$4);
    C$4(o1$4, o2$4);
    template$4.nodes = [o1$4];
    var _app_menu = { template: template$4 };

    var KV$5 = drizzlejs.factory.KV,
        SN$5 = drizzlejs.factory.SN,
        C$5 = drizzlejs.factory.C,
        H = drizzlejs.factory.H,
        TX$5 = drizzlejs.factory.TX,
        DV = drizzlejs.factory.DV,
        SV = drizzlejs.factory.SV,
        HH = drizzlejs.factory.HH,
        DA = drizzlejs.factory.DA,
        DN = drizzlejs.factory.DN,
        A = drizzlejs.factory.A,
        AT = drizzlejs.factory.AT,
        NSA = drizzlejs.factory.NSA,
        NDA = drizzlejs.factory.NDA,
        IFC = drizzlejs.factory.IFC;

    var template$5 = new drizzlejs.ViewTemplate();
    var o1$5 = SN$5('footer', null, KV$5('class', 'footer'));
    var o2$5 = SN$5('span', null, KV$5('class', 'todo-count'));
    var o3$5 = SN$5('strong', null);
    var o4$5 = TX$5(H('remaining'));
    var o5$5 = TX$5(HH('if', DV('remaining'), DV('eq'), SV(1), SV(' item left'), SV(' items left')));
    var o6$5 = SN$5('ul', null, KV$5('class', 'filters'));
    var o7$5 = SN$5('li', null);
    var o8$5 = DN('a', null, [KV$5('href', '#/todos/all')], [DA('class', HH('if', DV('filter'), DV('eq'), SV('all'), SV('selected')))], [], [], []);
    var o9$5 = TX$5('All');
    var o10$5 = SN$5('li', null);
    var o11$5 = DN('a', null, [KV$5('href', '#/todos/active')], [DA('class', HH('if', DV('filter'), DV('eq'), SV('active'), SV('selected')))], [], [], []);
    var o12$4 = TX$5('Active');
    var o13$4 = SN$5('li', null);
    var o14$3 = DN('a', null, [KV$5('href', '#/todos/completed')], [DA('class', HH('if', DV('filter'), DV('eq'), SV('completed'), SV('selected')))], [], [], []);
    var o15$3 = TX$5('Completed');
    var o17$1 = DN('button', null, [KV$5('class', 'clear-completed')], [], [], [], [A('click', 'clearCompleted')]);
    var o18 = TX$5('Clear completed');
    var o16$3 = IFC([DV('haveCompleted')], o17$1);

    C$5(o3$5, o4$5);
    C$5(o2$5, o3$5, o5$5);
    C$5(o8$5, o9$5);
    C$5(o7$5, o8$5);
    C$5(o11$5, o12$4);
    C$5(o10$5, o11$5);
    C$5(o14$3, o15$3);
    C$5(o13$4, o14$3);
    C$5(o6$5, o7$5, o10$5, o13$4);
    C$5(o17$1, o18);
    C$5(o1$5, o2$5, o6$5, o16$3);
    template$5.nodes = [o1$5];

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
        template: template$5
    };

    var KV$6 = drizzlejs.factory.KV,
        SN$6 = drizzlejs.factory.SN,
        C$6 = drizzlejs.factory.C,
        H$1 = drizzlejs.factory.H,
        SV$1 = drizzlejs.factory.SV,
        DA$1 = drizzlejs.factory.DA,
        A$1 = drizzlejs.factory.A,
        AT$1 = drizzlejs.factory.AT,
        NSA$1 = drizzlejs.factory.NSA,
        DV$1 = drizzlejs.factory.DV,
        NDA$1 = drizzlejs.factory.NDA,
        DN$1 = drizzlejs.factory.DN,
        HH$1 = drizzlejs.factory.HH,
        E = drizzlejs.factory.E,
        TX$6 = drizzlejs.factory.TX,
        B = drizzlejs.factory.B,
        EACH = drizzlejs.factory.EACH,
        IFC$1 = drizzlejs.factory.IFC;

    var template$6 = new drizzlejs.ViewTemplate();
    var o2$6 = SN$6('section', null, KV$6('class', 'main'));
    var o3$6 = DN$1('input', null, [KV$6('type', 'checkbox'), KV$6('id', 'toggle-all'), KV$6('class', 'toggle-all')], [DA$1('checked', H$1('allDone'))], [], [], [A$1('change', 'toggleAll', AT$1('completed', DV$1('this.checked')))]);
    var o4$6 = SN$6('label', null, KV$6('for', 'toggle-all'));
    var o5$6 = SN$6('ul', null, KV$6('class', 'todo-list'));
    var o7$6 = function o7() {
        var o8 = DN$1('li', null, [], [DA$1('class', HH$1('if', DV$1('todo.completed'), SV$1('completed')), HH$1('if', DV$1('todo'), DV$1('eq'), DV$1('editing'), SV$1('editing')))], [], [], []);
        var o9 = SN$6('div', null, KV$6('class', 'view'));
        var o10 = DN$1('input', null, [KV$6('type', 'checkbox'), KV$6('class', 'toggle')], [DA$1('checked', H$1('todo.completed'))], [], [], [A$1('change', 'toggle', AT$1('id', DV$1('todo.id')), AT$1('checked', DV$1('this.checked')))]);
        var o11 = DN$1('label', null, [], [], [], [E('dblclick', 'edit', NDA$1('todo'))], []);
        var o12 = TX$6(H$1('todo.name'));
        var o13 = DN$1('button', null, [KV$6('class', 'destroy')], [], [], [], [A$1('click', 'remove', AT$1('id', DV$1('todo.id')))]);
        var o14 = DN$1('input', null, [KV$6('class', 'edit')], [], [B('value', 'todo.name')], [], [A$1('blur', 'commitEdit', NDA$1('todo.id'), NDA$1('this.value'), NSA$1('blur')), A$1('enter', 'commitEdit', NDA$1('todo.id'), NDA$1('this.value'), NSA$1('enter')), A$1('escape', 'revertEdit', NDA$1('todo'), NDA$1('nameCache'))]);

        C$6(o11, o12);
        C$6(o9, o10, o11, o13);
        C$6(o8, o9, o14);
        return o8;
    };
    var o6$6 = EACH(['filtered', 'as', 'todo'], o7$6);
    var o1$6 = IFC$1([DV$1('todos.length')], o2$6);

    C$6(o5$6, o6$6);
    C$6(o2$6, o3$6, o4$6, o5$6);
    template$6.nodes = [o1$6];

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
        template: template$6
    };

    var KV$7 = drizzlejs.factory.KV,
        A$2 = drizzlejs.factory.A,
        AT$2 = drizzlejs.factory.AT,
        SV$2 = drizzlejs.factory.SV,
        NSA$2 = drizzlejs.factory.NSA,
        DV$2 = drizzlejs.factory.DV,
        NDA$2 = drizzlejs.factory.NDA,
        DN$2 = drizzlejs.factory.DN,
        C$7 = drizzlejs.factory.C;

    var template$7 = new drizzlejs.ViewTemplate();
    var o1$7 = DN$2('input', 'create', [KV$7('placeholder', 'What needs to be done?'), KV$7('class', 'new-todo')], [], [], [], [A$2('enter', 'newTodo', AT$2('name', DV$2('this.value')))]);

    template$7.nodes = [o1$7];

    var _create_todo = {
        actions: {
            newTodo: function newTodo(cb, payload) {
                if (!payload.name) return;
                this.ids.create.value = '';
                cb(payload);
            }
        },
        template: template$7
    };

    var KV$8 = drizzlejs.factory.KV,
        SN$7 = drizzlejs.factory.SN,
        C$8 = drizzlejs.factory.C,
        TX$7 = drizzlejs.factory.TX,
        REF$1 = drizzlejs.factory.REF;

    var template$8 = new drizzlejs.ModuleTemplate(['todos']);
    var o1$8 = SN$7('div', null, KV$8('class', 'todoapp-container'));
    var o2$7 = SN$7('section', null, KV$8('class', 'todoapp'));
    var o3$7 = SN$7('header', null, KV$8('class', 'header'));
    var o4$7 = SN$7('h1', null);
    var o5$7 = TX$7('todos');
    var o6$7 = REF$1('create-todo', null, [], [], []);
    var o7$7 = REF$1('todo-list', null, [KV$8('todos'), KV$8('filter')], [], []);
    var o8$6 = REF$1('todo-footer', null, [KV$8('todos'), KV$8('filter')], [], []);
    var id = 0;
    C$8(o4$7, o5$7);
    C$8(o3$7, o4$7, o6$7);
    C$8(o2$7, o3$7, o7$7, o8$6);
    C$8(o1$8, o2$7);
    template$8.nodes = [o1$8];
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
        template: template$8,
        _loadedItems: {
            'create-todo': _create_todo,
            'todo-list': _todo_list,
            'todo-footer': _todo_footer
        }
    };

    var REF$2 = drizzlejs.factory.REF,
        RG$1 = drizzlejs.factory.RG;

    var template$9 = new drizzlejs.ModuleTemplate([]);
    var o1$9 = REF$2('app-header', null, [], [], []);
    var o2$8 = RG$1();
    template$9.nodes = [o1$9, o2$8];
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
        template: template$9,
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
