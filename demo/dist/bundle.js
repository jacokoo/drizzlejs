(function (drizzlejs) {
    'use strict';

    var KV = drizzlejs.factory.KV,
        SN = drizzlejs.factory.SN,
        C = drizzlejs.factory.C,
        TX = drizzlejs.factory.TX;

    var template = new drizzlejs.ModuleTemplate([]);
    var o1 = SN('aside', null, KV('class', 'menu'));
    var o2 = SN('p', null, KV('class', 'menu-label'));
    var o3 = TX('General');
    var o4 = SN('ul', null, KV('class', 'menu-list'));
    var o5 = SN('li', null);
    var o6 = SN('a', null);
    var o7 = TX('Dashboard');
    var o8 = SN('li', null);
    var o9 = SN('a', null);
    var o10 = TX('Customers');
    var o11 = SN('p', null, KV('class', 'menu-label'));
    var o12 = TX('Administration');
    var o13 = SN('ul', null, KV('class', 'menu-list'));
    var o14 = SN('li', null);
    var o15 = SN('a', null);
    var o16 = TX('Team Settings');
    var o17 = SN('li', null);
    var o18 = SN('a', null, KV('class', 'is-active'));
    var o19 = TX('Manage Your Team');
    var o20 = SN('ul', null);
    var o21 = SN('li', null);
    var o22 = SN('a', null);
    var o23 = TX('Members');
    var o24 = SN('li', null);
    var o25 = SN('a', null);
    var o26 = TX('Plugins');
    var o27 = SN('li', null);
    var o28 = SN('a', null);
    var o29 = TX('Add a member');
    var o30 = SN('li', null);
    var o31 = SN('a', null);
    var o32 = TX('Invitations');
    var o33 = SN('li', null);
    var o34 = SN('a', null);
    var o35 = TX('Cloud Storage Environment Settings');
    var o36 = SN('li', null);
    var o37 = SN('a', null);
    var o38 = TX('Authentication');
    var o39 = SN('p', null, KV('class', 'menu-label'));
    var o40 = TX('Transactions');
    var o41 = SN('ul', null, KV('class', 'menu-list'));
    var o42 = SN('li', null);
    var o43 = SN('a', null);
    var o44 = TX('Payments');
    var o45 = SN('li', null);
    var o46 = SN('a', null);
    var o47 = TX('Transfers');
    var o48 = SN('li', null);
    var o49 = SN('a', null);
    var o50 = TX('Balance');
    C(o2, o3);
    C(o6, o7);
    C(o5, o6);
    C(o9, o10);
    C(o8, o9);
    C(o4, o5, o8);
    C(o11, o12);
    C(o15, o16);
    C(o14, o15);
    C(o18, o19);
    C(o22, o23);
    C(o21, o22);
    C(o25, o26);
    C(o24, o25);
    C(o28, o29);
    C(o27, o28);
    C(o20, o21, o24, o27);
    C(o17, o18, o20);
    C(o31, o32);
    C(o30, o31);
    C(o34, o35);
    C(o33, o34);
    C(o37, o38);
    C(o36, o37);
    C(o13, o14, o17, o30, o33, o36);
    C(o39, o40);
    C(o43, o44);
    C(o42, o43);
    C(o46, o47);
    C(o45, o46);
    C(o49, o50);
    C(o48, o49);
    C(o41, o42, o45, o48);
    C(o1, o2, o4, o11, o13, o39, o41);
    template.nodes = [o1];
    var _app_menu = { template: template };

    var KV$1 = drizzlejs.factory.KV,
        SN$1 = drizzlejs.factory.SN,
        C$1 = drizzlejs.factory.C,
        H = drizzlejs.factory.H,
        TX$1 = drizzlejs.factory.TX,
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

    var template$1 = new drizzlejs.ViewTemplate();
    var o1$1 = SN$1('footer', null, KV$1('class', 'footer'));
    var o2$1 = SN$1('span', null, KV$1('class', 'todo-count'));
    var o3$1 = SN$1('strong', null);
    var o4$1 = TX$1(H('remaining'));
    var o5$1 = TX$1(HH('if', DV('remaining'), DV('eq'), SV(1), SV(' item left'), SV(' items left')));
    var o6$1 = SN$1('ul', null, KV$1('class', 'filters'));
    var o7$1 = SN$1('li', null);
    var o8$1 = DN('a', null, [KV$1('href', '#/todos/all')], [DA('class', HH('if', DV('filter'), DV('eq'), SV('all'), SV('selected')))], [], [], []);
    var o9$1 = TX$1('All');
    var o10$1 = SN$1('li', null);
    var o11$1 = DN('a', null, [KV$1('href', '#/todos/active')], [DA('class', HH('if', DV('filter'), DV('eq'), SV('active'), SV('selected')))], [], [], []);
    var o12$1 = TX$1('Active');
    var o13$1 = SN$1('li', null);
    var o14$1 = DN('a', null, [KV$1('href', '#/todos/completed')], [DA('class', HH('if', DV('filter'), DV('eq'), SV('completed'), SV('selected')))], [], [], []);
    var o15$1 = TX$1('Completed');
    var o17$1 = DN('button', null, [KV$1('class', 'clear-completed')], [], [], [], [A('click', 'clearCompleted')]);
    var o18$1 = TX$1('Clear completed');
    var o16$1 = IFC([DV('haveCompleted')], o17$1);

    C$1(o3$1, o4$1);
    C$1(o2$1, o3$1, o5$1);
    C$1(o8$1, o9$1);
    C$1(o7$1, o8$1);
    C$1(o11$1, o12$1);
    C$1(o10$1, o11$1);
    C$1(o14$1, o15$1);
    C$1(o13$1, o14$1);
    C$1(o6$1, o7$1, o10$1, o13$1);
    C$1(o17$1, o18$1);
    C$1(o1$1, o2$1, o6$1, o16$1);
    template$1.nodes = [o1$1];

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
        template: template$1
    };

    var KV$2 = drizzlejs.factory.KV,
        SN$2 = drizzlejs.factory.SN,
        C$2 = drizzlejs.factory.C,
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
        TX$2 = drizzlejs.factory.TX,
        B = drizzlejs.factory.B,
        EACH = drizzlejs.factory.EACH,
        IFC$1 = drizzlejs.factory.IFC;

    var template$2 = new drizzlejs.ViewTemplate();
    var o2$2 = SN$2('section', null, KV$2('class', 'main'));
    var o3$2 = DN$1('input', null, [KV$2('type', 'checkbox'), KV$2('id', 'toggle-all'), KV$2('class', 'toggle-all')], [DA$1('checked', H$1('allDone'))], [], [], [A$1('change', 'toggleAll', AT$1('completed', DV$1('this.checked')))]);
    var o4$2 = SN$2('label', null, KV$2('for', 'toggle-all'));
    var o5$2 = SN$2('ul', null, KV$2('class', 'todo-list'));
    var o7$2 = function o7() {
        var o8 = DN$1('li', null, [], [DA$1('class', HH$1('if', DV$1('todo.completed'), SV$1('completed')), HH$1('if', DV$1('todo'), DV$1('eq'), DV$1('editing'), SV$1('editing')))], [], [], []);
        var o9 = SN$2('div', null, KV$2('class', 'view'));
        var o10 = DN$1('input', null, [KV$2('type', 'checkbox'), KV$2('class', 'toggle')], [DA$1('checked', H$1('todo.completed'))], [], [], [A$1('change', 'toggle', AT$1('id', DV$1('todo.id')), AT$1('checked', DV$1('this.checked')))]);
        var o11 = DN$1('label', null, [], [], [], [E('dblclick', 'edit', NDA$1('todo'))], []);
        var o12 = TX$2(H$1('todo.name'));
        var o13 = DN$1('button', null, [KV$2('class', 'destroy')], [], [], [], [A$1('click', 'remove', AT$1('id', DV$1('todo.id')))]);
        var o14 = DN$1('input', null, [KV$2('class', 'edit')], [], [B('value', 'todo.name')], [], [A$1('blur', 'commitEdit', NDA$1('todo.id'), NDA$1('this.value'), NSA$1('blur')), A$1('enter', 'commitEdit', NDA$1('todo.id'), NDA$1('this.value'), NSA$1('enter')), A$1('escape', 'revertEdit', NDA$1('todo'), NDA$1('nameCache'))]);

        C$2(o11, o12);
        C$2(o9, o10, o11, o13);
        C$2(o8, o9, o14);
        return o8;
    };
    var o6$2 = EACH(['filtered', 'as', 'todo'], o7$2);
    var o1$2 = IFC$1([DV$1('todos.length')], o2$2);

    C$2(o5$2, o6$2);
    C$2(o2$2, o3$2, o4$2, o5$2);
    template$2.nodes = [o1$2];

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
        template: template$2
    };

    var KV$3 = drizzlejs.factory.KV,
        A$2 = drizzlejs.factory.A,
        AT$2 = drizzlejs.factory.AT,
        SV$2 = drizzlejs.factory.SV,
        NSA$2 = drizzlejs.factory.NSA,
        DV$2 = drizzlejs.factory.DV,
        NDA$2 = drizzlejs.factory.NDA,
        DN$2 = drizzlejs.factory.DN,
        C$3 = drizzlejs.factory.C;

    var template$3 = new drizzlejs.ViewTemplate();
    var o1$3 = DN$2('input', 'create', [KV$3('placeholder', 'What needs to be done?'), KV$3('class', 'new-todo')], [], [], [], [A$2('enter', 'newTodo', AT$2('name', DV$2('this.value')))]);

    template$3.nodes = [o1$3];

    var _create_todo = {
        actions: {
            newTodo: function newTodo(cb, payload) {
                if (!payload.name) return;
                this.ids.create.value = '';
                cb(payload);
            }
        },
        template: template$3
    };

    var KV$4 = drizzlejs.factory.KV,
        SN$3 = drizzlejs.factory.SN,
        C$4 = drizzlejs.factory.C,
        TX$3 = drizzlejs.factory.TX,
        REF = drizzlejs.factory.REF;

    var template$4 = new drizzlejs.ModuleTemplate(['todos']);
    var o1$4 = SN$3('div', null, KV$4('class', 'todoapp-container'));
    var o2$3 = SN$3('section', null, KV$4('class', 'todoapp'));
    var o3$3 = SN$3('header', null, KV$4('class', 'header'));
    var o4$3 = SN$3('h1', null);
    var o5$3 = TX$3('todos');
    var o6$3 = REF('create-todo', null, [], [], []);
    var o7$3 = REF('todo-list', null, [KV$4('todos'), KV$4('filter')], [], []);
    var o8$2 = REF('todo-footer', null, [KV$4('todos'), KV$4('filter')], [], []);
    var id = 0;
    C$4(o4$3, o5$3);
    C$4(o3$3, o4$3, o6$3);
    C$4(o2$3, o3$3, o7$3, o8$2);
    C$4(o1$4, o2$3);
    template$4.nodes = [o1$4];
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
        template: template$4,
        _loadedItems: {
            'create-todo': _create_todo,
            'todo-list': _todo_list,
            'todo-footer': _todo_footer
        }
    };

    var KV$5 = drizzlejs.factory.KV,
        SN$4 = drizzlejs.factory.SN,
        C$5 = drizzlejs.factory.C,
        TX$4 = drizzlejs.factory.TX;

    var template$5 = new drizzlejs.ModuleTemplate([]);
    var o1$5 = SN$4('div', null, KV$5('class', 'pure-g'));
    var o2$4 = SN$4('div', null, KV$5('class', 'sidebar pure-u-1 pure-u-md-1-4'));
    var o3$4 = TX$4('a');
    var o4$4 = SN$4('div', null, KV$5('class', 'content pure-u-1 pure-u-md-3-4'));
    var o5$4 = TX$4('b');
    C$5(o2$4, o3$4);
    C$5(o4$4, o5$4);
    C$5(o1$5, o2$4, o4$4);
    template$5.nodes = [o1$5];
    var _viewport = {
        items: {
            modules: {
                'todo-app': 'todos',
                'app-menu': 'menu'
            }
        },
        routes: { '/todos1': 'todo-app' },
        template: template$5,
        _loadedItems: {
            'todos': _todo_app,
            'menu': _app_menu
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
