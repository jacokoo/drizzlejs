(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Drizzle = {})));
}(this, (function (exports) { 'use strict';

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

    var get = function get(object, property, receiver) {
      if (object === null) object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent === null) {
          return undefined;
        } else {
          return get(parent, property, receiver);
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;

        if (getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
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

    var slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    var toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    var Loader = function () {
        function Loader(app, path, args) {
            classCallCheck(this, Loader);

            this._app = app;
            this._path = path;
            this._args = args;
        }

        createClass(Loader, [{
            key: 'load',
            value: function load(file, mod) {
                return this._app.options.getResource(this._app.options.scriptRoot + '/' + this._path + '/' + file);
            }
        }]);
        return Loader;
    }();

    var ChangeType;
    (function (ChangeType) {
        ChangeType[ChangeType["CHANGED"] = 0] = "CHANGED";
        ChangeType[ChangeType["NOT_CHANGED"] = 1] = "NOT_CHANGED";
    })(ChangeType || (ChangeType = {}));
    var ValueType;
    (function (ValueType) {
        ValueType[ValueType["STATIC"] = 0] = "STATIC";
        ValueType[ValueType["DYNAMIC"] = 1] = "DYNAMIC";
        ValueType[ValueType["TRANSFORMER"] = 2] = "TRANSFORMER";
    })(ValueType || (ValueType = {}));

    function resolveEventArguments(ctx, me, event, def) {
        var result = [];
        def.attrs.forEach(function (it) {
            if (it[0] === ValueType.STATIC) {
                result.push(it[1]);
                return;
            }
            if (it[0] === ValueType.DYNAMIC) {
                var ts = tokenize(it[1]);
                var first = ts.shift();
                if (first === 'event' || first === 'this') {
                    var o = first === 'event' ? event : me;
                    o = ts.reduce(function (acc, key) {
                        return acc[key];
                    }, o);
                    result.push(o);
                    return;
                }
            }
            result.push(getAttributeValue(ctx, it, me));
        });
        return result;
    }
    function getAttributeValue(ctx, av, state) {
        switch (av[0]) {
            case ValueType.STATIC:
                return av[1];
            case ValueType.DYNAMIC:
                return getValue(ctx, av[1], state);
            case ValueType.TRANSFORMER:
                return av[1].get(ctx, state);
        }
    }
    function getValue(ctx, key, state) {
        var ks = tokenize(key);
        var first = ks.shift();
        var o = ctx.data;
        var computed = ctx.root._options.computed && ctx.root._options.computed[key];
        if (computed) {
            o = computed(o);
        } else {
            var oo = o;
            if (state._def.some(function (v, i) {
                if (v.idx === first) {
                    oo = state._state[i];
                    return true;
                }
                if (v.alias === first) {
                    var _ctx$get = ctx.get(v.name, state);

                    var _ctx$get2 = slicedToArray(_ctx$get, 2);

                    oo = _ctx$get2[1];

                    oo = oo[state._state[i]];
                    return true;
                }
                return false;
            })) {
                o = oo;
            } else {
                o = o[first];
            }
        }
        if (ks.length) {
            o = ks.reduce(function (acc, item) {
                if (acc == null) return null;
                return acc[item];
            }, o);
        }
        return o;
    }
    var cache = {};
    function tokenize(input) {
        if (cache[input]) {
            return cache[input].slice();
        }
        var token = '';
        var result = [];
        var inString = false;
        var push = function push() {
            if (token) result.push(token);
            token = '';
        };
        for (var i = 0; i < input.length; i++) {
            var t = input[i];
            if (inString) {
                if (t === '\\' && input[i + 1] === ']') {
                    token += ']';
                    i++;
                    continue;
                }
                if (t === ']') {
                    push();
                    inString = false;
                    continue;
                }
                token += t;
                continue;
            }
            if (t === '[') {
                push();
                inString = true;
                continue;
            }
            if (t === '.') {
                push();
                continue;
            }
            token += t;
        }
        if (token) result.push(token);
        cache[input] = result;
        return result.slice();
    }

    var toKey = function toKey(id) {
        return '_keys_' + id;
    };
    var walk = function walk(re, def, current, o) {
        if (current === def.each.length) {
            if (o[def.id]) re.push(o[def.id]);
            return;
        }
        var keys = o[toKey(def.each[current])];
        keys.forEach(function (it) {
            walk(re, def, current + 1, o[def.each[current]][it]);
        });
    };

    var Cache = function () {
        function Cache() {
            classCallCheck(this, Cache);

            this.cache = {};
            this._id = [];
            this._def = [];
            this._state = [];
        }

        createClass(Cache, [{
            key: 'push',
            value: function push(id, def) {
                var c = this.getCache();
                if (!c[id]) {
                    c[id] = {};
                }
                c[toKey(id)] = [];
                this._id.push(id);
                this._def.push(def);
                this._state.push(0);
            }
        }, {
            key: 'next',
            value: function next(key) {
                var ca = this.getCache(this, 1);
                var id = this._id[this._id.length - 1];
                var c = ca[id];
                var keys = ca[toKey(id)];
                var o = c[key];
                if (!o) {
                    o = {};
                    c[key] = o;
                }
                keys.push(key);
                this._state.pop();
                this._state.push(key);
                return {
                    dispose: function dispose() {
                        delete c[key];
                    }
                };
            }
        }, {
            key: 'pop',
            value: function pop(clear) {
                var id = this._id.pop();
                this._def.pop();
                this._state.pop();
                if (clear) {
                    var c = this.getCache();
                    delete c[id];
                    delete c[toKey(id)];
                }
            }
        }, {
            key: 'getCache',
            value: function getCache() {
                var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
                var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                var o = this.cache;
                state._id.forEach(function (it, i) {
                    if (i + exclude >= state._id.length) return;
                    o = o[it];
                    if (!o) return;
                    o = o[state._state[i]];
                });
                return o;
            }
        }, {
            key: 'get',
            value: function get$$1(key) {
                if (!this._id.length) return this.getCache()[key];
                for (var i = 0; i <= this._id.length; i++) {
                    var v = this.getCache(this, i)[key];
                    if (v) return v;
                }
                return null;
            }
        }, {
            key: 'set',
            value: function set$$1(key, value) {
                this.getCache()[key] = value;
            }
        }, {
            key: 'clear',
            value: function clear(key) {
                delete this.getCache()[key];
            }
        }, {
            key: 'ref',
            value: function ref(def) {
                if (!def.each.length) {
                    return this.cache[def.id];
                }
                var re = [];
                walk(re, def, 0, this.cache);
                return re;
            }
        }]);
        return Cache;
    }();

    var Waiter = function () {
        function Waiter() {
            classCallCheck(this, Waiter);

            this.busy = [];
        }

        createClass(Waiter, [{
            key: 'wait',
            value: function wait(p) {
                this.busy.push(p);
            }
        }, {
            key: 'end',
            value: function end() {
                var bs = this.busy;
                this.busy = [];
                return Promise.all(bs);
            }
        }]);
        return Waiter;
    }();

    var ElementState = function () {
        function ElementState(el) {
            classCallCheck(this, ElementState);

            this.el = el;
        }

        createClass(ElementState, [{
            key: 'get',
            value: function get$$1(key) {
                return this.el['s_' + key];
            }
        }, {
            key: 'set',
            value: function set$$1(key, val) {
                this.el['s_' + key] = val;
            }
        }, {
            key: 'clear',
            value: function clear(key) {
                delete this.el['s_' + key];
            }
        }]);
        return ElementState;
    }();

    var DataContext = function () {
        function DataContext(root, template) {
            classCallCheck(this, DataContext);

            this.version = 0;
            this.inSvg = false;
            this.root = root;
            this.template = template;
            this.cache = new Cache();
        }

        createClass(DataContext, [{
            key: 'name',
            value: function name() {
                return this.root._options._file;
            }
        }, {
            key: 'getEl',
            value: function getEl(key) {
                return this.cache.get(key);
            }
        }, {
            key: 'setEl',
            value: function setEl(key, el) {
                if (el == null) {
                    this.cache.clear(key);
                    return;
                }
                this.cache.set(key, el);
            }
        }, {
            key: 'get',
            value: function get$$1(id, state) {
                var c = this.cache.getCache(state || this.cache);
                var ck = 'h_' + id;
                var ex = c[ck];
                if (ex && ex[0] === this.version) {
                    return ex[1];
                }
                var old = ex ? ex[1][1] : null;
                var v = this.template.helpers[id].get(this, state || this.cache);
                var type = v === old ? ChangeType.NOT_CHANGED : ChangeType.CHANGED;
                var re = [type, v, old];
                c[ck] = [this.version, re];
                return re;
            }
        }, {
            key: 'fillState',
            value: function fillState(el) {
                var es = el;
                es._ctx = this;
                es._def = this.cache._def.slice();
                es._id = this.cache._id.slice();
                es._state = this.cache._state.slice();
                return es;
            }
        }, {
            key: 'startSvg',
            value: function startSvg() {
                this.inSvg = true;
            }
        }, {
            key: 'endSvg',
            value: function endSvg() {
                this.inSvg = false;
            }
        }, {
            key: 'createElement',
            value: function createElement(name) {
                return this.inSvg ? document.createElementNS('http://www.w3.org/2000/svg', name) : document.createElement(name);
            }
        }, {
            key: 'event',
            value: function event(isUnbind, el, eventId) {
                var def = this.template.events[eventId];
                var ces = this.root._options.customEvents;
                var ce = ces && ces[def.name] || this.root.app.options.customEvents[def.name];
                if (ce) {
                    var ee = el;
                    var s = new ElementState(ee);
                    isUnbind ? ce.off(s, ee, def.fn) : ce.on(s, ee, def.fn);
                    return;
                }
                isUnbind ? def.off(el) : def.on(el);
            }
        }, {
            key: 'trigger',
            value: function trigger(def, el, event) {
                var _root2;

                var args = resolveEventArguments(this, el, event, def);
                if (def.isAction) {
                    var _root;

                    (_root = this.root)._action.apply(_root, [def.method].concat(toConsumableArray(args)));
                    return;
                }
                (_root2 = this.root)._event.apply(_root2, [def.method].concat(toConsumableArray(args)));
            }
        }, {
            key: 'set',
            value: function set$$1(data) {
                this.data = data;
                this.version++;
            }
        }, {
            key: 'update',
            value: function update(obj) {}
        }, {
            key: 'slot',
            value: function slot(id, _slot) {
                this.root.slots[id] = _slot;
            }
        }, {
            key: 'ref',
            value: function ref(name) {
                var def = this.template.refs[name];
                if (!def) {
                    throw new Error('no ref found: ' + name);
                }
                return this.cache.ref(def);
            }
        }]);
        return DataContext;
    }();

    var ViewContext = function (_DataContext) {
        inherits(ViewContext, _DataContext);

        function ViewContext(root, template) {
            classCallCheck(this, ViewContext);

            var _this = possibleConstructorReturn(this, (ViewContext.__proto__ || Object.getPrototypeOf(ViewContext)).call(this, root, template));

            _this.root = root;
            _this.state = {
                get: function get$$1(key) {
                    return _this.cache.get('w_' + key);
                },
                set: function set$$1(key, val) {
                    _this.cache.set('w_' + key, val);
                },
                clear: function clear(key) {
                    _this.cache.clear('w_' + key);
                }
            };
            return _this;
        }

        createClass(ViewContext, [{
            key: 'transformer',
            value: function transformer(name) {
                var h = this.root._options.transformers;
                return h && h[name] || this.root.app.options.transformers[name];
            }
        }, {
            key: 'create',
            value: function create(name, state) {
                return this.root._component._createItem(name, state);
            }
        }, {
            key: 'widget',
            value: function widget(type, el, id) {
                var _this2 = this;

                var def = this.template.widgets[id];
                var ws = this.root._options.widgets;
                if (!ws || !ws[def.name]) {
                    ws = this.root.app.options.widgets;
                }
                var w = ws && ws[def.name];
                if (!w) {
                    throw new Error('no widgit definition found: ' + def.name);
                }
                switch (type) {
                    case 0:
                        var args = def.args.map(function (it) {
                            return _this2.get(it)[1];
                        });
                        var obj = w.create.apply(w, [this.state, el].concat(toConsumableArray(args)));
                        this.cache.set(id, obj);
                        break;
                    case 1:
                        var as = def.args.map(function (it) {
                            return _this2.get(it);
                        });
                        var changed = as.some(function (it) {
                            return it[0] === ChangeType.CHANGED;
                        });
                        w.update.apply(w, [this.state, changed, el].concat(toConsumableArray(as.map(function (it) {
                            return it[1];
                        }))));
                        break;
                    case 2:
                        w.destory(this.state, el);
                        this.cache.clear(id);
                }
            }
        }, {
            key: 'bind',
            value: function bind(type, el, id) {
                var bd = this.template.bindings[id];
                if (type === 0) return bd.bind(el);
                if (type === 1) return bd.update(el);
                if (type === 2) return bd.unbind(el);
            }
        }]);
        return ViewContext;
    }(DataContext);

    var ComponentContext = function (_DataContext2) {
        inherits(ComponentContext, _DataContext2);

        function ComponentContext() {
            classCallCheck(this, ComponentContext);
            return possibleConstructorReturn(this, (ComponentContext.__proto__ || Object.getPrototypeOf(ComponentContext)).apply(this, arguments));
        }

        createClass(ComponentContext, [{
            key: 'transformer',
            value: function transformer(name) {
                return null;
            }
        }, {
            key: 'create',
            value: function create(name, state) {
                return this.root._createItem(name, state);
            }
        }]);
        return ComponentContext;
    }(DataContext);

    var TargetKey = '_t_';

    var RootParent = function () {
        function RootParent() {
            classCallCheck(this, RootParent);
        }

        createClass(RootParent, [{
            key: 'append',
            value: function append(ctx, el, anchor) {
                if (!this.target) {
                    this.target = ctx.cache.get(TargetKey);
                }
                this.target.append(ctx, el, anchor);
            }
        }, {
            key: 'remove',
            value: function remove(ctx, el) {
                if (!this.target) {
                    this.target = ctx.cache.get(TargetKey);
                }
                this.target.remove(ctx, el);
            }
        }]);
        return RootParent;
    }();

    var ElementParent = function () {
        function ElementParent(el) {
            classCallCheck(this, ElementParent);

            this.el = el;
        }

        createClass(ElementParent, [{
            key: 'append',
            value: function append(ctx, el, anchor) {
                if (anchor) {
                    this.el.insertBefore(el, anchor);
                    return;
                }
                this.el.appendChild(el);
            }
        }, {
            key: 'remove',
            value: function remove(ctx, el) {
                this.el.removeChild(el);
            }
        }]);
        return ElementParent;
    }();

    var Template = function () {
        function Template(root) {
            classCallCheck(this, Template);

            this.tags = {};
            this.events = {};
            this.helpers = {};
            this.refs = {};
            this.root = root;
        }

        createClass(Template, [{
            key: 'tag',
            value: function tag() {
                var _this = this;

                for (var _len = arguments.length, ts = Array(_len), _key = 0; _key < _len; _key++) {
                    ts[_key] = arguments[_key];
                }

                ts.forEach(function (it) {
                    return _this.tags[it.id] = it;
                });
            }
        }, {
            key: 'event',
            value: function event(id, def) {
                def.fn = function (e) {
                    this._ctx.trigger(def, this, e);
                };
                def.on = function (el) {
                    el.addEventListener(def.name, def.fn, false);
                };
                def.off = function (el) {
                    el.removeEventListener(def.name, def.fn, false);
                };
                this.events[id] = def;
            }
        }, {
            key: 'helper',
            value: function helper(id, _helper) {
                this.helpers[id] = _helper;
            }
        }, {
            key: 'ref',
            value: function ref(name, def) {
                this.refs[name] = def;
            }
        }, {
            key: 'create',
            value: function create() {
                var me = this;
                var o = {
                    context: null,
                    stage: 'template',
                    init: function init() {
                        o.context = me.context(this);
                        this._refs = o.context;
                        var w = new Waiter();
                        var p = new RootParent();
                        me.root.forEach(function (it) {
                            it.parent = p;
                            it.init(o.context, w);
                        });
                        return w.end();
                    },
                    rendered: function rendered(data) {
                        o.context.set(data);
                        o.context.cache.set(TargetKey, this._target);
                        var w = new Waiter();
                        me.root.render(o.context, w);
                        return w.end();
                    },
                    updated: function updated(data) {
                        o.context.set(data);
                        var w = new Waiter();
                        me.root.update(o.context, w);
                        return w.end();
                    },
                    destroyed: function destroyed() {
                        var w = new Waiter();
                        me.root.destroy(o.context, w, true);
                        return w.end();
                    }
                };
                return o;
            }
        }]);
        return Template;
    }();

    var ViewTemplate = function (_Template) {
        inherits(ViewTemplate, _Template);

        function ViewTemplate() {
            classCallCheck(this, ViewTemplate);

            var _this2 = possibleConstructorReturn(this, (ViewTemplate.__proto__ || Object.getPrototypeOf(ViewTemplate)).apply(this, arguments));

            _this2.widgets = {};
            _this2.bindings = {};
            return _this2;
        }

        createClass(ViewTemplate, [{
            key: 'widget',
            value: function widget(id, def) {
                this.widgets[id] = def;
            }
        }, {
            key: 'binding',
            value: function binding(id, def) {
                this.bindings[id] = def;
            }
        }, {
            key: 'context',
            value: function context(root) {
                return new ViewContext(root, this);
            }
        }]);
        return ViewTemplate;
    }(Template);

    var ComponentTemplate = function (_Template2) {
        inherits(ComponentTemplate, _Template2);

        function ComponentTemplate(root, exportedModels) {
            classCallCheck(this, ComponentTemplate);

            var _this3 = possibleConstructorReturn(this, (ComponentTemplate.__proto__ || Object.getPrototypeOf(ComponentTemplate)).call(this, root));

            _this3.exportedModels = [];
            _this3.exportedModels = exportedModels;
            return _this3;
        }

        createClass(ComponentTemplate, [{
            key: 'context',
            value: function context(root) {
                return new ComponentContext(root, this);
            }
        }]);
        return ComponentTemplate;
    }(Template);

    var callIt = function callIt(ctx, cycles, method) {
        var reverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var args = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
        var exclude = arguments[5];

        return cycles.filter(function (it) {
            return it !== exclude && it[method];
        })[reverse ? 'reduceRight' : 'reduce'](function (acc, it) {
            return acc.then(function () {
                return it[method].apply(ctx, args);
            });
        }, Promise.resolve());
    };

    var LifecycleContainer = function () {
        function LifecycleContainer(app, options) {
            var _this = this;

            classCallCheck(this, LifecycleContainer);

            this._cycles = [];
            this.app = app;
            var cs = options.cycles || [];
            cs.push(options);

            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            args.forEach(function (it) {
                return it && cs.push(it);
            });
            cs.forEach(function (it) {
                return !it.stage && (it.stage = 'default');
            });
            app.options.stages.forEach(function (s) {
                return cs.forEach(function (c) {
                    if (c.stage === s) _this._cycles.push(c);
                });
            });
        }

        createClass(LifecycleContainer, [{
            key: '_doInit',
            value: function _doInit() {
                return callIt(this, this._cycles, 'init');
            }
        }, {
            key: '_doCollect',
            value: function _doCollect(data) {
                var _this2 = this;

                return this._cycles.filter(function (it) {
                    return !!it.collect;
                }).reduce(function (acc, item) {
                    return item.collect.call(_this2, acc);
                }, data);
            }
        }, {
            key: '_doBeforeRender',
            value: function _doBeforeRender() {
                return callIt(this, this._cycles, 'beforeRender');
            }
        }, {
            key: '_doRendered',
            value: function _doRendered(data) {
                return callIt(this, this._cycles, 'rendered', false, [data]);
            }
        }, {
            key: '_doBeforeUpdate',
            value: function _doBeforeUpdate() {
                return callIt(this, this._cycles, 'beforeUpdate');
            }
        }, {
            key: '_doUpdated',
            value: function _doUpdated(data, exclude) {
                return callIt(this, this._cycles, 'updated', false, [data], exclude);
            }
        }, {
            key: '_doBeforeDestroy',
            value: function _doBeforeDestroy() {
                return callIt(this, this._cycles, 'beforeDestroy', true);
            }
        }, {
            key: '_doDestroyed',
            value: function _doDestroyed() {
                return callIt(this, this._cycles, 'destroyed', true);
            }
        }]);
        return LifecycleContainer;
    }();

    var ComponentState;
    (function (ComponentState) {
        ComponentState[ComponentState["CREATED"] = 0] = "CREATED";
        ComponentState[ComponentState["INITED"] = 1] = "INITED";
        ComponentState[ComponentState["RENDERED"] = 2] = "RENDERED";
    })(ComponentState || (ComponentState = {}));

    var Renderable = function (_LifecycleContainer) {
        inherits(Renderable, _LifecycleContainer);

        function Renderable(app, options) {
            var _ref;

            classCallCheck(this, Renderable);

            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            var _this = possibleConstructorReturn(this, (_ref = Renderable.__proto__ || Object.getPrototypeOf(Renderable)).call.apply(_ref, [this, app, options].concat(args)));

            _this.ids = {};
            _this._busy = Promise.resolve();
            _this._status = ComponentState.CREATED;
            _this._options = options;
            return _this;
        }

        createClass(Renderable, [{
            key: "_render",
            value: function _render(target) {
                var _this2 = this;

                if (this._status !== ComponentState.INITED) return Promise.resolve();
                this._target = target;
                this._busy = this._busy.then(function () {
                    return _this2._doBeforeRender();
                }).then(function () {
                    return _this2._doCollect(_this2.get());
                }).then(function (data) {
                    return _this2._doRendered(data);
                }).then(function () {
                    return _this2._status = ComponentState.RENDERED;
                });
                return this._busy;
            }
        }, {
            key: "ref",
            value: function ref(name) {
                return this._refs.ref(name);
            }
        }, {
            key: "destroy",
            value: function destroy() {
                var _this3 = this;

                if (this._status !== ComponentState.RENDERED) return Promise.resolve();
                this._busy = this._busy.then(function () {
                    return _this3._doBeforeDestroy();
                }).then(function () {
                    return _this3._doDestroyed();
                }).then(function () {
                    return _this3._status = ComponentState.INITED;
                });
                return this._busy;
            }
        }, {
            key: "_init",
            value: function _init() {
                var _this4 = this;

                return this._busy = this._busy.then(function () {
                    return _this4._doInit();
                }).then(function () {
                    return _this4._status = ComponentState.INITED;
                });
            }
        }, {
            key: "_event",
            value: function _event(name) {
                var events = this._options.events;

                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                if (events && events[name]) events[name].apply(this, args);
            }
        }, {
            key: "_action",
            value: function _action(name) {
                var _this5 = this;

                var actions = this._options.actions;

                for (var _len3 = arguments.length, data = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    data[_key3 - 1] = arguments[_key3];
                }

                if (actions && actions[name]) {
                    var _actions$name;

                    (_actions$name = actions[name]).call.apply(_actions$name, [this, function (d) {
                        return _this5._dispatch(name, d);
                    }].concat(data));
                    return;
                }
                this._dispatch(name, data[0]);
            }
        }]);
        return Renderable;
    }(LifecycleContainer);

    var Model = function () {
        function Model(options) {
            classCallCheck(this, Model);

            var opt = typeof options === 'function' ? { data: options } : options;
            this._options = opt;
            this.set(opt.data());
        }

        createClass(Model, [{
            key: 'set',
            value: function set$$1(data) {
                this._data = data;
            }
        }, {
            key: 'get',
            value: function get$$1() {
                // clone it or make it readonly in dev mode
                return this._data;
            }
        }]);
        return Model;
    }();

    var Store = function () {
        function Store(mod, options, updateKey) {
            var _this = this;

            classCallCheck(this, Store);

            this._models = {};
            this._names = [];
            this._options = options;
            this._component = mod;
            var models = options.models;

            if (models) {
                this._names = Object.keys(models);
                this._names.forEach(function (k) {
                    return _this._models[k] = new Model(models[k]);
                });
            }
            if (!options.actions) options.actions = {};
            options.actions[updateKey] = function (data) {
                _this.set(data);
            };
        }

        createClass(Store, [{
            key: 'fire',
            value: function fire(name, data) {
                this._component.fire(name, data);
            }
        }, {
            key: 'get',
            value: function get$$1(name) {
                var _this2 = this;

                if (name) return this._models[name].get();
                return this._names.reduce(function (acc, item) {
                    acc[item] = _this2._models[item].get();
                    return acc;
                }, {});
            }
        }, {
            key: 'set',
            value: function set$$1(data) {
                var _this3 = this;

                this._names.forEach(function (k) {
                    return k in data && _this3._models[k].set(data[k]);
                });
            }
        }, {
            key: 'dispatch',
            value: function dispatch(name, payload) {
                var actions = this._options.actions;

                if (!actions || !actions[name]) return Promise.reject('no action defined: ' + name);
                return Promise.resolve(actions[name].call(this, payload));
            }
        }, {
            key: 'models',
            get: function get$$1() {
                return this._models;
            }
        }]);
        return Store;
    }();

    var View = function (_Renderable) {
        inherits(View, _Renderable);

        function View(mod, options) {
            var _ref;

            classCallCheck(this, View);

            var _this = possibleConstructorReturn(this, (_ref = View.__proto__ || Object.getPrototypeOf(View)).call.apply(_ref, [this, mod.app, options, options.template && options.template.create()].concat(toConsumableArray(mod.app.options.viewLifecycles))));

            _this._state = {};
            _this._component = mod;
            return _this;
        }

        createClass(View, [{
            key: '_init',
            value: function _init() {
                if (this._options.state) this._set(this._options.state, true);
                return get(View.prototype.__proto__ || Object.getPrototypeOf(View.prototype), '_init', this).call(this);
            }
        }, {
            key: 'get',
            value: function get$$1(key) {
                if (!key) return this._state;
                if (this._options.computed && this._options.computed[key]) {
                    return this._options.computed[key](this._state);
                }
                return this._state[key];
            }
        }, {
            key: 'set',
            value: function set$$1(data) {
                return this._set(data, false);
            }
        }, {
            key: '_set',
            value: function _set(data, silent, source) {
                var _this2 = this;

                if (silent || this._status !== ComponentState.RENDERED) {
                    Object.assign(this._state, data);
                    return Promise.resolve();
                }
                this._busy = this._busy.then(function () {
                    return _this2._doBeforeUpdate();
                }).then(function () {
                    return Object.assign(_this2._state, data);
                }).then(function () {
                    return _this2._doCollect(_this2.get());
                }).then(function (d) {
                    return _this2._doUpdated(d, source);
                });
                return this._busy;
            }
        }, {
            key: '_dispatch',
            value: function _dispatch(name, data) {
                return this._component._dispatch(name, data);
            }
        }, {
            key: 'slots',
            get: function get$$1() {
                return this._component.slots;
            }
        }]);
        return View;
    }(Renderable);

    var Events = function () {
        function Events() {
            classCallCheck(this, Events);

            this._handlers = {};
        }

        createClass(Events, [{
            key: 'on',
            value: function on(name, handler) {
                if (!this._handlers[name]) this._handlers[name] = [];
                var hs = this._handlers[name];
                if (hs.indexOf(handler) !== -1) return { dispose: function dispose() {} };
                hs.push(handler);
                return {
                    dispose: function dispose() {
                        var idx = hs.indexOf(handler);
                        if (idx !== -1) hs.splice(idx, 1);
                    }
                };
            }
        }, {
            key: 'fire',
            value: function fire(name, data) {
                var _this = this;

                if (!this._handlers[name]) return;
                var hs = this._handlers[name].slice();
                hs.forEach(function (it) {
                    return it.call(_this, data);
                });
            }
        }]);
        return Events;
    }();

    var UPDATE_ACTION = 'update' + +new Date();
    var componentReferences = {};

    var Component = function (_Renderable) {
        inherits(Component, _Renderable);

        function Component(app, loader, options) {
            var _ref;

            var extraState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            classCallCheck(this, Component);

            var _this = possibleConstructorReturn(this, (_ref = Component.__proto__ || Object.getPrototypeOf(Component)).call.apply(_ref, [this, app, options, options.template && options.template.create()].concat(toConsumableArray(app.options.componentLifecycles))));

            _this._items = {};
            _this._handlers = {};
            _this._loader = loader;
            _this._extraState = extraState;
            _this.slots = {};
            return _this;
        }

        createClass(Component, [{
            key: 'set',
            value: function set$$1(data) {
                if (!this._options.template) return;
                var exportedModels = this._options.template.exportedModels;

                if (!exportedModels || !exportedModels.length) return;
                var d = exportedModels.reduce(function (acc, item) {
                    if (data[item]) acc[item] = data[item];
                    return acc;
                }, {});
                return this._set(data);
            }
        }, {
            key: '_set',
            value: function _set(data, source) {
                return this._status === ComponentState.CREATED ? this._store.dispatch(UPDATE_ACTION, data) : this._dispatch(UPDATE_ACTION, data, source);
            }
        }, {
            key: 'get',
            value: function get$$1(name) {
                return Object.freeze(this._store.get(name));
            }
        }, {
            key: '_createItem',
            value: function _createItem(name, state) {
                var opt = this._items[name];
                var item = opt.type === 'view' ? new View(this, opt.options) : new Component(this.app, opt.loader, opt.options, state);
                return item._init().then(function () {
                    return item;
                });
            }
        }, {
            key: '_dispatch',
            value: function _dispatch(name, payload, source) {
                var _this2 = this;

                this._busy = this._busy.then(function () {
                    return _this2._doBeforeUpdate();
                }).then(function () {
                    return _this2._store.dispatch(name, payload);
                }).then(function () {
                    return _this2._doCollect(_this2.get());
                }).then(function (data) {
                    return _this2._doUpdated(data, source);
                });
                return this._busy;
            }
        }, {
            key: '_render',
            value: function _render(target) {
                var _this3 = this;

                return get(Component.prototype.__proto__ || Object.getPrototypeOf(Component.prototype), '_render', this).call(this, target).then(function () {
                    if (_this3._status === ComponentState.RENDERED) {
                        var store = _this3._options.store;

                        if (store && store.actions && store.actions.init) {
                            return _this3._dispatch('init');
                        }
                    }
                });
            }
        }, {
            key: '_init',
            value: function _init() {
                var _this4 = this;

                this._store = new Store(this, this._options.store || {}, UPDATE_ACTION);
                this.set(Object.assign({}, this._extraState));
                var p = this._loadItems().then(function () {
                    return get(Component.prototype.__proto__ || Object.getPrototypeOf(Component.prototype), '_init', _this4).call(_this4);
                });
                return p;
            }
        }, {
            key: 'on',
            value: function on(name, handler) {
                return null;
            }
        }, {
            key: 'fire',
            value: function fire(name, data) {}
        }, {
            key: '_loadItems',
            value: function _loadItems() {
                var _this5 = this;

                var items = this._options.items;

                if (!items) return Promise.resolve();
                var ps = [];
                if (items.views) {
                    ps = ps.concat(items.views.map(function (it) {
                        return { name: it, type: 'view', loader: _this5._loader };
                    }));
                }
                if (items.refs) {
                    ps = ps.concat(items.refs.map(function (it) {
                        var obj = componentReferences[it];
                        var loader = _this5.app.createLoader(obj.path, { name: obj.loader, args: obj.args });
                        return { name: it, type: 'component', loader: loader };
                    }));
                }
                if (items.components) {
                    ps = ps.concat(Object.keys(items.components).map(function (it) {
                        var path = items.components[it];
                        var loader = _this5.app.createLoader(path);
                        return { name: it, type: 'component', loader: loader };
                    }));
                }
                return Promise.all(ps.map(function (k, i) {
                    return ps[i].loader.load(ps[i].type === 'view' ? ps[i].name : 'index', _this5);
                })).then(function (data) {
                    ps.forEach(function (p, i) {
                        _this5._items[p.name] = { type: p.type, loader: p.loader, options: data[i] };
                    });
                });
            }
        }]);
        return Component;
    }(Renderable);

    Object.getOwnPropertyNames(Events.prototype).forEach(function (it) {
        Component.prototype[it] = Events.prototype[it];
    });

    var customEvents = {
        enter: {
            on: function on(state, node, cb) {
                var ee = function ee(e) {
                    if (e.keyCode !== 13) return;
                    e.preventDefault();
                    cb.call(this, e);
                };
                state.set('enter', ee);
                node.addEventListener('keypress', ee, false);
            },
            off: function off(state, node, cb) {
                var ee = state.get('enter');
                if (!ee) return;
                node.removeEventListener('keypress', ee, false);
                state.clear('enter');
            }
        }
    };

    var Application = function (_Events) {
        inherits(Application, _Events);

        function Application(options) {
            classCallCheck(this, Application);

            var _this = possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

            _this.loaders = {};
            _this._plugins = [];
            _this.options = Object.assign({
                stages: ['init', 'template', 'default'],
                scriptRoot: 'app',
                entry: 'viewport',
                helpers: {},
                components: {},
                componentLifecycles: [],
                viewLifecycles: []
            }, options);
            _this.options.customEvents = Object.assign(customEvents, _this.options.customEvents);
            _this.registerLoader(Loader);
            return _this;
        }

        createClass(Application, [{
            key: 'registerLoader',
            value: function registerLoader(loader) {
                var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

                this.loaders[name] = loader;
            }
        }, {
            key: 'createLoader',
            value: function createLoader(path, loader) {
                if (loader) {
                    return new this.loaders[loader.name](this, path, loader.args);
                }
                return new this.loaders.default(this, path);
            }
        }, {
            key: 'use',
            value: function use(plugin) {
                plugin.init(this);
                this.options.componentLifecycles = this.options.componentLifecycles.concat(plugin.componentLifecycles);
                this.options.viewLifecycles = this.options.viewLifecycles.concat(plugin.viewLifecycles);
                this._plugins.push(plugin);
            }
        }, {
            key: 'start',
            value: function start() {
                var _this2 = this;

                return this.startViewport().then(function (item) {
                    _this2._plugins.forEach(function (it) {
                        return it.started(item);
                    });
                });
            }
        }, {
            key: 'startViewport',
            value: function startViewport() {
                var _this3 = this;

                var loader = void 0;
                var _options = this.options,
                    entry = _options.entry,
                    container = _options.container;

                var create = function create(lo, options) {
                    var v = new Component(_this3, lo, options);
                    return v._init().then(function () {
                        return v._render(new ElementParent(container));
                    }).then(function () {
                        return v;
                    });
                };
                if (typeof entry === 'string') {
                    loader = this.createLoader(entry);
                } else {
                    return create(this.createLoader(null), entry);
                }
                return loader.load('index', null).then(function (opt) {
                    return create(loader, opt);
                });
            }
        }]);
        return Application;
    }(Events);

    // /name

    var Token = function () {
        function Token(key, next) {
            classCallCheck(this, Token);

            this.v = 9;
            this.key = key;
            this.next = next;
        }

        createClass(Token, [{
            key: 'match',
            value: function match(keys) {
                var c = keys[0];
                return this.doMatch(c, keys.slice(1));
            }
        }, {
            key: 'value',
            value: function value() {
                var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                var vv = v + this.v;
                return this.next ? this.next.value(vv * 10) : vv;
            }
        }, {
            key: 'doMatch',
            value: function doMatch(key, keys) {
                if (key !== this.key) return false;
                if (this.next) {
                    var o = this.next.match(keys);
                    if (!o) return false;
                    o.consumed = o.consumed ? key + '/' + o.consumed : key;
                    return o;
                }
                return { remain: keys, consumed: key };
            }
        }]);
        return Token;
    }();
    // /:name


    var ArgToken = function (_Token) {
        inherits(ArgToken, _Token);

        function ArgToken() {
            classCallCheck(this, ArgToken);

            var _this = possibleConstructorReturn(this, (ArgToken.__proto__ || Object.getPrototypeOf(ArgToken)).apply(this, arguments));

            _this.v = 8;
            return _this;
        }

        createClass(ArgToken, [{
            key: 'doMatch',
            value: function doMatch(key, keys) {
                var oo = defineProperty({}, this.key, key);
                if (!this.next) return { remain: keys, args: oo, consumed: key };
                var o = this.next.match(keys);
                if (o === false) return false;
                o.args ? Object.assign(o.args, oo) : o.args = oo;
                if (key && o.consumed) o.consumed = key + '/' + o.consumed;else if (key) o.consumed = key;
                return o;
            }
        }]);
        return ArgToken;
    }(Token);
    // /*name


    var AllToken = function (_Token2) {
        inherits(AllToken, _Token2);

        function AllToken() {
            classCallCheck(this, AllToken);

            var _this2 = possibleConstructorReturn(this, (AllToken.__proto__ || Object.getPrototypeOf(AllToken)).apply(this, arguments));

            _this2.v = 7;
            return _this2;
        }

        createClass(AllToken, [{
            key: 'match',
            value: function match(keys) {
                if (!keys.length) return false;
                return { args: defineProperty({}, this.key, keys), remain: [], consumed: keys.join('/') };
            }
        }]);
        return AllToken;
    }(Token);

    var create = function create(path) {
        var ts = path.trim().split('/').filter(function (it) {
            return !!it;
        });
        return ts.reduceRight(function (acc, item) {
            if (item.charAt(0) === '*') return new AllToken(item.slice(1), acc);
            if (item.charAt(0) === ':') return new ArgToken(item.slice(1), acc);
            return new Token(item, acc);
        }, null);
    };

    var Router = function () {
        function Router(comp, routes) {
            var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#/';
            classCallCheck(this, Router);

            this._keys = [];
            this._defs = [];
            this._currentKey = -1;
            this._component = comp;
            this._prefix = prefix;
            this.initRoutes(routes);
        }

        createClass(Router, [{
            key: 'route',
            value: function route(keys) {
                var _this3 = this;

                for (var i = 0; i < this._keys.length; i++) {
                    var re = this._keys[i].match(keys);
                    if (re) {
                        return this.doRoute(i, re).then(function (d) {
                            _this3._previous = keys;
                            return d;
                        });
                    }
                }
                return Promise.resolve(false);
            }
        }, {
            key: 'leave',
            value: function leave() {
                var _this4 = this;

                this._previous = undefined;
                return Promise.resolve().then(function () {
                    if (_this4._next) return _this4._next.leave();
                }).then(function () {
                    var h = _this4._defs[_this4._currentKey];
                    if (h && h.leave) return h.leave();
                });
            }
        }, {
            key: 'enter',
            value: function enter(idx, result) {
                var _this5 = this;

                this._currentKey = idx;
                var o = Object.assign({ _router_prefix: '' + this._prefix + result.consumed + '/' }, result.args);
                return this._defs[idx].enter(o).then(function (it) {
                    _this5._next = it;
                    if (it) return it.route(result.remain);
                });
            }
        }, {
            key: 'doRoute',
            value: function doRoute(idx, result) {
                var _this6 = this;

                var h = this._defs[idx];
                if (this._currentKey === -1) {
                    return this.enter(idx, result);
                }
                if (idx === this._currentKey) {
                    return Promise.resolve().then(function () {
                        if (h.update) return h.update(result.args);
                    }).then(function () {
                        if (_this6._next) return _this6._next.route(result.remain);
                    });
                }
                return this.leave().then(function () {
                    return _this6.enter(idx, result);
                });
            }
        }, {
            key: 'initRoutes',
            value: function initRoutes(routes) {
                var _this7 = this;

                Object.keys(routes).map(function (key) {
                    return { key: key, token: create(key) };
                }).sort(function (a, b) {
                    return b.token.value() - a.token.value();
                }).forEach(function (it) {
                    _this7._keys.push(it.token);
                    _this7._defs.push(_this7.createHandler(routes[it.key]));
                });
            }
        }, {
            key: 'createHandler',
            value: function createHandler(h) {
                if (typeof h === 'string') return this.createComponentHandler({ ref: h });
                if ('enter' in h) return h;
                if ('action' in h) return this.createActionHandler(h);
                if ('event' in h) return this.createEventHandler(h);
                if ('ref' in h) return this.createComponentHandler(h);
                throw new Error('unsupported router handler');
            }
        }, {
            key: 'createActionHandler',
            value: function createActionHandler(h) {
                var _this8 = this;

                return {
                    enter: function enter(args) {
                        return _this8._component._dispatch(h.action, args).then(function () {
                            return null;
                        });
                    },
                    update: function update(args) {
                        return _this8._component._dispatch(h.action, args);
                    }
                };
            }
        }, {
            key: 'createEventHandler',
            value: function createEventHandler(h) {
                var _this9 = this;

                return {
                    enter: function enter(args) {
                        _this9._component._event(h.event, args, _this9._previous);
                        return Promise.resolve(null);
                    },
                    update: function update(args) {
                        _this9._component._event(h.event, args, _this9._previous);
                        return Promise.resolve();
                    }
                };
            }
        }, {
            key: 'createComponentHandler',
            value: function createComponentHandler(h) {
                var _this10 = this;

                var item = void 0;
                return {
                    enter: function enter(args) {
                        var o = h.model ? defineProperty({}, h.model, args) : args;
                        return _this10._component._createItem(h.ref, o).then(function (it) {
                            var slot = _this10._component.slots[h.slot || 'default'];
                            return slot.get().then(function (target) {
                                slot.setCleaner(function (w) {
                                    return w.wait(it.destroy());
                                });
                                return it._render(target);
                            }).then(function () {
                                item = it;
                                if (it instanceof Component) return it._router;
                                return null;
                            });
                        });
                    },
                    update: function update(args) {
                        if (!args) return Promise.resolve();
                        var o = h.model ? defineProperty({}, h.model, args) : args;
                        if (item && item instanceof Component) return item.set(o);
                        return Promise.resolve();
                    }
                };
            }
        }]);
        return Router;
    }();

    var RouterComponentLifecycle = {
        stage: 'init',
        init: function init() {
            var routes = this._options.routes;

            if (!routes) return;
            var prefix = this._extraState._router_prefix;
            this._router = new Router(this, routes, prefix);
        },
        collect: function collect(data) {
            var r = this._router;
            if (r) data['@router'] = r._prefix;
            return data;
        }
    };
    var RouterViewLifecycle = {
        collect: function collect(data) {
            var r = this._component._router;
            if (r) data['@router'] = r._prefix;
            return data;
        }
    };
    var RouterPlugin = {
        componentLifecycles: [RouterComponentLifecycle],
        viewLifecycles: [RouterViewLifecycle],
        init: function init(app) {},
        started: function started(item) {
            var router = item._router;
            if (!router) return;
            var doIt = function doIt() {
                var hash = window.location.hash;
                if (hash.slice(0, 2) !== '#/') return;
                var hs = hash.slice(2).split('/').filter(function (it) {
                    return !!it;
                });
                if (!hs.length) return;
                router.route(hs).then(function (it) {
                    console.log(it);
                });
            };
            window.addEventListener('popstate', doIt);
            doIt();
        }
    };

    var Compare = {
        '==': function _(v1, v2) {
            return v1 === v2;
        },
        '!=': function _(v1, v2) {
            return v1 !== v2;
        },
        '>': function _(v1, v2) {
            return v1 > v2;
        },
        '<': function _(v1, v2) {
            return v1 < v2;
        },
        '>=': function _(v1, v2) {
            return v1 >= v2;
        },
        '<=': function _(v1, v2) {
            return v1 <= v2;
        }
    };

    var AbstractHelper = function () {
        function AbstractHelper(args) {
            classCallCheck(this, AbstractHelper);

            this.args = args;
        }

        createClass(AbstractHelper, [{
            key: 'arg',
            value: function arg(idx, dc, state) {
                if (!this.args[idx]) return '';
                return getAttributeValue(dc, this.args[idx], state);
            }
        }]);
        return AbstractHelper;
    }();

    var BoolHelper = function (_AbstractHelper) {
        inherits(BoolHelper, _AbstractHelper);

        function BoolHelper() {
            classCallCheck(this, BoolHelper);
            return possibleConstructorReturn(this, (BoolHelper.__proto__ || Object.getPrototypeOf(BoolHelper)).apply(this, arguments));
        }

        createClass(BoolHelper, [{
            key: 'get',
            value: function get$$1(dc, state) {
                if (this.args.length === 1) {
                    return !!this.arg(0, dc, state);
                }
                var op = this.args[1][1];
                if (!Compare[op]) {
                    throw Error(op + ' is not a valid compare operator, use: ==, !=, >, <, >=, <=');
                }
                return Compare[op](this.arg(0, dc, state), this.arg(2, dc, state));
            }
        }]);
        return BoolHelper;
    }(AbstractHelper);

    var IfHelper = function (_AbstractHelper2) {
        inherits(IfHelper, _AbstractHelper2);

        function IfHelper(bool, args) {
            classCallCheck(this, IfHelper);

            var _this2 = possibleConstructorReturn(this, (IfHelper.__proto__ || Object.getPrototypeOf(IfHelper)).call(this, args));

            _this2.bool = bool;
            return _this2;
        }

        createClass(IfHelper, [{
            key: 'get',
            value: function get$$1(dc, state) {
                return this.arg(this.use(dc, state), dc, state);
            }
        }, {
            key: 'use',
            value: function use(dc, state) {
                var _dc$get = dc.get(this.bool, state),
                    _dc$get2 = slicedToArray(_dc$get, 2),
                    v = _dc$get2[1];

                return v ? 0 : 1;
            }
        }]);
        return IfHelper;
    }(AbstractHelper);

    var UnlessHelper = function (_IfHelper) {
        inherits(UnlessHelper, _IfHelper);

        function UnlessHelper() {
            classCallCheck(this, UnlessHelper);
            return possibleConstructorReturn(this, (UnlessHelper.__proto__ || Object.getPrototypeOf(UnlessHelper)).apply(this, arguments));
        }

        createClass(UnlessHelper, [{
            key: 'use',
            value: function use(dc, state) {
                var _dc$get3 = dc.get(this.bool, state),
                    _dc$get4 = slicedToArray(_dc$get3, 2),
                    v = _dc$get4[1];

                return v ? 1 : 0;
            }
        }]);
        return UnlessHelper;
    }(IfHelper);

    var DelayHelper = function (_AbstractHelper3) {
        inherits(DelayHelper, _AbstractHelper3);

        function DelayHelper(name, args) {
            classCallCheck(this, DelayHelper);

            var _this4 = possibleConstructorReturn(this, (DelayHelper.__proto__ || Object.getPrototypeOf(DelayHelper)).call(this, args));

            _this4.name = name;
            return _this4;
        }

        createClass(DelayHelper, [{
            key: 'get',
            value: function get$$1(dc, state) {
                var _this5 = this;

                var fn = dc.transformer(this.name);
                if (!fn) throw new Error('no transformer found: ' + this.name);
                return fn.apply(null, this.args.map(function (it, i) {
                    return _this5.arg(i, dc, state);
                }));
            }
        }]);
        return DelayHelper;
    }(AbstractHelper);

    var EchoHelper = function (_AbstractHelper4) {
        inherits(EchoHelper, _AbstractHelper4);

        function EchoHelper() {
            classCallCheck(this, EchoHelper);
            return possibleConstructorReturn(this, (EchoHelper.__proto__ || Object.getPrototypeOf(EchoHelper)).apply(this, arguments));
        }

        createClass(EchoHelper, [{
            key: 'get',
            value: function get$$1(dc, state) {
                return this.arg(0, dc, state);
            }
        }]);
        return EchoHelper;
    }(AbstractHelper);

    var ConcatHelper = function (_AbstractHelper5) {
        inherits(ConcatHelper, _AbstractHelper5);

        function ConcatHelper() {
            classCallCheck(this, ConcatHelper);
            return possibleConstructorReturn(this, (ConcatHelper.__proto__ || Object.getPrototypeOf(ConcatHelper)).apply(this, arguments));
        }

        createClass(ConcatHelper, [{
            key: 'get',
            value: function get$$1(dc, state) {
                var _this8 = this;

                return this.args.map(function (it, idx) {
                    return _this8.arg(idx, dc, state);
                }).join('');
            }
        }]);
        return ConcatHelper;
    }(AbstractHelper);

    var MultiHelper = function () {
        function MultiHelper(joiner, helpers) {
            classCallCheck(this, MultiHelper);

            this.helpers = helpers;
            this.joiner = joiner;
        }

        createClass(MultiHelper, [{
            key: 'get',
            value: function get$$1(dc, state) {
                return this.helpers.map(function (it) {
                    var _dc$get5 = dc.get(it, state),
                        _dc$get6 = slicedToArray(_dc$get5, 2),
                        v = _dc$get6[1];

                    return v;
                }).join(this.joiner);
            }
        }]);
        return MultiHelper;
    }();

    var Tags = function () {
        function Tags(tags) {
            classCallCheck(this, Tags);
            this.tags = tags;
        }

        createClass(Tags, [{
            key: 'init',
            value: function init(ctx, waiter) {
                this.tags.forEach(function (it) {
                    return it.init(ctx, waiter);
                });
            }
        }, {
            key: 'render',
            value: function render(ctx, waiter) {
                this.tags.forEach(function (it) {
                    return it.render(ctx, waiter);
                });
            }
        }, {
            key: 'update',
            value: function update(ctx, waiter) {
                this.tags.forEach(function (it) {
                    return it.update(ctx, waiter);
                });
            }
        }, {
            key: 'forEach',
            value: function forEach(fn) {
                this.tags.forEach(fn);
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, waiter, domRemove) {
                this.tags.forEach(function (it) {
                    return it.destroy(ctx, waiter, domRemove);
                });
            }
        }]);
        return Tags;
    }();

    var emptyTags = new Tags([]);

    var Tag = function () {
        function Tag(id) {
            classCallCheck(this, Tag);

            this.children = emptyTags;
            this.id = id;
        }

        createClass(Tag, [{
            key: 'init',
            value: function init(ctx, waiter) {
                if (this.children) this.children.init(ctx, waiter);
            }
        }]);
        return Tag;
    }();

    function setAttribute(el, attr) {
        if (attr[2]) {
            el.setAttribute(attr[0], attr[1]);
            return;
        }
        el[attr[0]] = attr[1];
    }

    var StaticTag = function (_Tag) {
        inherits(StaticTag, _Tag);

        function StaticTag(name, id) {
            classCallCheck(this, StaticTag);

            var _this = possibleConstructorReturn(this, (StaticTag.__proto__ || Object.getPrototypeOf(StaticTag)).call(this, id));

            _this.as = [];
            _this.inSvg = false;
            _this.name = name;
            _this.inSvg = name === 'svg';
            return _this;
        }

        createClass(StaticTag, [{
            key: 'attr',
            value: function attr(name, value, useSet) {
                this.as.push([name, value, useSet === true]);
            }
        }, {
            key: 'init',
            value: function init(ctx, waiter) {
                if (this.inSvg) ctx.startSvg();
                ctx.setEl(this.id, this.create(ctx));
                get(StaticTag.prototype.__proto__ || Object.getPrototypeOf(StaticTag.prototype), 'init', this).call(this, ctx, waiter);
                if (this.inSvg) ctx.endSvg();
            }
        }, {
            key: 'render',
            value: function render(ctx, waiter) {
                this.parent.append(ctx, ctx.getEl(this.id));
                this.children.render(ctx, waiter);
            }
        }, {
            key: 'update',
            value: function update(ctx, waiter) {
                this.children.update(ctx, waiter);
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, waiter, domRemove) {
                if (domRemove) {
                    this.parent.remove(ctx, ctx.getEl(this.id));
                }
                ctx.setEl(this.id, null);
                this.children.destroy(ctx, waiter, false);
            }
        }, {
            key: 'append',
            value: function append(ctx, el, anchor) {
                var ee = ctx.getEl(this.id);
                if (anchor) {
                    ee.insertBefore(el, anchor);
                    return;
                }
                ee.appendChild(el);
            }
        }, {
            key: 'remove',
            value: function remove(ctx, el) {
                ctx.getEl(this.id).removeChild(el);
            }
        }, {
            key: 'create',
            value: function create(ctx) {
                // const element = ctx.isInSvg() ?
                //     document.createElementNS('http://www.w3.org/2000/svg', this.name) :
                //     document.createElement(this.name)
                var element = ctx.createElement(this.name);
                this.as.forEach(function (it) {
                    return setAttribute(element, it);
                });
                return element;
            }
        }]);
        return StaticTag;
    }(Tag);

    var DynamicTag = function (_StaticTag) {
        inherits(DynamicTag, _StaticTag);

        function DynamicTag(name, id) {
            var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
            var widgets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
            var bds = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
            classCallCheck(this, DynamicTag);

            var _this = possibleConstructorReturn(this, (DynamicTag.__proto__ || Object.getPrototypeOf(DynamicTag)).call(this, name, id));

            _this.das = [];
            _this.exists = false;
            _this.evs = events;
            _this.widgets = widgets;
            _this.bindings = bds;
            _this.exists = !!(events.length || widgets.length || bds.length);
            return _this;
        }

        createClass(DynamicTag, [{
            key: 'dattr',
            value: function dattr(name, helperId, useSet) {
                this.das.push([name, helperId, useSet === true]);
            }
        }, {
            key: 'render',
            value: function render(ctx, waiter) {
                get(DynamicTag.prototype.__proto__ || Object.getPrototypeOf(DynamicTag.prototype), 'render', this).call(this, ctx, waiter);
                this.updateAttrs(ctx);
                if (!this.evs.length && !this.widgets.length) return;
                var el = ctx.getEl(this.id);
                if (this.evs.length || this.bindings.length) {
                    var ee = ctx.fillState(el);
                    this.evs.forEach(function (it) {
                        return ctx.event(false, ee, it);
                    });
                    this.bindings.forEach(function (it) {
                        return ctx.bind(0, ee, it);
                    });
                }
                this.widgets.forEach(function (it) {
                    return ctx.widget(0, el, it);
                });
            }
        }, {
            key: 'update',
            value: function update(ctx, waiter) {
                get(DynamicTag.prototype.__proto__ || Object.getPrototypeOf(DynamicTag.prototype), 'update', this).call(this, ctx, waiter);
                this.updateAttrs(ctx);
                var el = ctx.getEl(this.id);
                if (this.evs.length || this.bindings.length) {
                    var ee = ctx.fillState(el);
                    this.bindings.forEach(function (it) {
                        return ctx.bind(1, ee, it);
                    });
                }
                this.widgets.forEach(function (it) {
                    return ctx.widget(1, el, it);
                });
            }
        }, {
            key: 'updateAttrs',
            value: function updateAttrs(ctx) {
                var _this2 = this;

                var el = ctx.getEl(this.id);
                this.das.forEach(function (it) {
                    var v = ctx.get(it[1]);
                    if (v[0] === ChangeType.CHANGED) {
                        setAttribute(el, [it[0], v[1], it[2]]);
                        // TODO temporally solve a bug
                    } else if (_this2.name === 'input' && it[0] === 'checked') {
                        setAttribute(el, [it[0], v[1], it[2]]);
                    }
                });
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, waiter, domRemove) {
                var el = ctx.getEl(this.id);
                if (this.evs.length || this.bindings.length) {
                    var ee = el;
                    this.evs.forEach(function (it) {
                        return ctx.event(true, ee, it);
                    });
                    this.bindings.forEach(function (it) {
                        return ctx.bind(2, ee, it);
                    });
                }
                this.widgets.forEach(function (it) {
                    return ctx.widget(2, el, it);
                });
                get(DynamicTag.prototype.__proto__ || Object.getPrototypeOf(DynamicTag.prototype), 'destroy', this).call(this, ctx, waiter, domRemove);
            }
        }]);
        return DynamicTag;
    }(StaticTag);

    var BlockTag = function (_Tag) {
        inherits(BlockTag, _Tag);

        function BlockTag(id, needAnchor) {
            classCallCheck(this, BlockTag);

            var _this = possibleConstructorReturn(this, (BlockTag.__proto__ || Object.getPrototypeOf(BlockTag)).call(this, id));

            _this.needAnchor = false;
            _this.needAnchor = needAnchor;
            _this.anid = id + 'anchor';
            return _this;
        }

        createClass(BlockTag, [{
            key: 'init',
            value: function init(ctx, waiter) {
                if (this.needAnchor) {
                    var anchor = document.createComment(Object.getPrototypeOf(this).constructor.name || 'anchor');
                    ctx.setEl(this.anid, anchor);
                }
                get(BlockTag.prototype.__proto__ || Object.getPrototypeOf(BlockTag.prototype), 'init', this).call(this, ctx, waiter);
            }
        }, {
            key: 'render',
            value: function render(ctx, waiter) {
                if (!this.needAnchor) return;
                this.parent.append(ctx, ctx.getEl(this.anid));
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, waiter, domRemove) {
                this.children.destroy(ctx, waiter, domRemove);
                if (!this.needAnchor) return;
                if (domRemove) {
                    this.parent.remove(ctx, ctx.getEl(this.anid));
                }
                ctx.setEl(this.anid, null);
            }
        }, {
            key: 'append',
            value: function append(ctx, el, anchor) {
                if (this.needAnchor && !anchor) {
                    anchor = ctx.getEl(this.anid);
                }
                this.parent.append(ctx, el, anchor);
            }
        }, {
            key: 'remove',
            value: function remove(ctx, el) {
                this.parent.remove(ctx, el);
            }
        }]);
        return BlockTag;
    }(Tag);

    var ReferenceContainer = function () {
        function ReferenceContainer(ctx, target) {
            classCallCheck(this, ReferenceContainer);

            this.ctx = ctx;
            this.target = target;
        }

        createClass(ReferenceContainer, [{
            key: 'append',
            value: function append(ctx, el, anchor) {
                this.target.append(this.ctx, el, anchor);
            }
        }, {
            key: 'remove',
            value: function remove(ctx, el) {
                this.target.remove(this.ctx, el);
            }
        }]);
        return ReferenceContainer;
    }();

    var ReferenceTag = function (_BlockTag) {
        inherits(ReferenceTag, _BlockTag);

        function ReferenceTag(id, needAnchor, name) {
            var events = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
            classCallCheck(this, ReferenceTag);

            var _this = possibleConstructorReturn(this, (ReferenceTag.__proto__ || Object.getPrototypeOf(ReferenceTag)).call(this, id, needAnchor));

            _this.slots = {};
            _this.attrs = {};
            _this.mappings = []; // [name, helper-id]
            _this.name = name;
            _this.events = events;
            return _this;
        }

        createClass(ReferenceTag, [{
            key: 'attr',
            value: function attr(name, value) {
                this.attrs[name] = value;
            }
        }, {
            key: 'map',
            value: function map(name, helper) {
                this.mappings.push([name, helper]);
            }
        }, {
            key: 'init',
            value: function init(ctx, waiter) {
                var _this2 = this;

                waiter.wait(ctx.create(this.name, this.attr).then(function (it) {
                    return ctx.cache.set(_this2.id, it);
                }));
                Object.keys(this.slots).forEach(function (it) {
                    return _this2.slots[it].init(ctx, waiter);
                });
                get(ReferenceTag.prototype.__proto__ || Object.getPrototypeOf(ReferenceTag.prototype), 'init', this).call(this, ctx, waiter);
            }
        }, {
            key: 'render',
            value: function render(ctx, waiter) {
                var _this3 = this;

                get(ReferenceTag.prototype.__proto__ || Object.getPrototypeOf(ReferenceTag.prototype), 'render', this).call(this, ctx, waiter);
                var item = ctx.cache.get(this.id);
                if (this.events.length) {
                    var et = ctx.fillState(item);
                    this.events.forEach(function (it) {
                        return ctx.bind(false, et, it);
                    });
                }
                waiter.wait(item.set(this.mappings.reduce(function (acc, it) {
                    var _ctx$get = ctx.get(it[1]),
                        _ctx$get2 = slicedToArray(_ctx$get, 2),
                        v = _ctx$get2[1];

                    acc[it[0]] = v;
                    return acc;
                }, {})).then(function () {
                    return item._render(new ReferenceContainer(ctx, _this3));
                }).then(function () {
                    Object.keys(_this3.slots).forEach(function (s) {
                        if (!item.slots[s]) throw new Error('No slot defined: ' + s);
                    });
                    return Promise.all(Object.keys(item.slots).map(function (it) {
                        if (_this3.slots[it]) {
                            return item.slots[it].get().then(function (c) {
                                var w = new Waiter();
                                _this3.slots[it].forEach(function (s) {
                                    s.parent = c;
                                    s.render(ctx, w);
                                });
                                return w.end();
                            });
                        }
                        return item.slots[it].render();
                    }));
                }));
            }
        }, {
            key: 'update',
            value: function update(ctx, waiter) {
                var _this4 = this;

                var item = ctx.cache.get(this.id);
                waiter.wait(item.set(this.mappings.reduce(function (acc, it) {
                    var _ctx$get3 = ctx.get(it[1]),
                        _ctx$get4 = slicedToArray(_ctx$get3, 2),
                        v = _ctx$get4[1];

                    acc[it[0]] = v;
                    return acc;
                }, {})));
                var w = new Waiter();
                Object.keys(this.slots).forEach(function (it) {
                    return _this4.slots[it].update(ctx, w);
                });
                waiter.wait(w.end());
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, waiter, domRemove) {
                var _this5 = this;

                var w = new Waiter();
                Object.keys(this.slots).forEach(function (it) {
                    return _this5.slots[it].destroy(ctx, w, domRemove);
                });
                waiter.wait(w.end().then(function () {
                    var item = ctx.cache.get(_this5.id);
                    if (_this5.events.length) {
                        _this5.events.forEach(function (it) {
                            return ctx.bind(true, item, it);
                        });
                    }
                    return item.destroy();
                }));
                get(ReferenceTag.prototype.__proto__ || Object.getPrototypeOf(ReferenceTag.prototype), 'destroy', this).call(this, ctx, waiter, domRemove);
            }
        }]);
        return ReferenceTag;
    }(BlockTag);

    var Static = function () {
        function Static(id, value) {
            classCallCheck(this, Static);

            this.id = id;
            this.value = value;
        }

        createClass(Static, [{
            key: 'init',
            value: function init(ctx) {
                ctx.setEl(this.id, document.createTextNode(this.value));
            }
        }, {
            key: 'render',
            value: function render(ctx) {
                this.parent.append(ctx, ctx.getEl(this.id));
            }
        }, {
            key: 'update',
            value: function update(ctx) {}
        }, {
            key: 'destroy',
            value: function destroy(ctx, domRemove) {
                if (domRemove) {
                    this.parent.remove(ctx, ctx.getEl(this.id));
                }
                ctx.setEl(this.id, null);
            }
        }]);
        return Static;
    }();

    var Dynamic = function (_Static) {
        inherits(Dynamic, _Static);

        function Dynamic() {
            classCallCheck(this, Dynamic);
            return possibleConstructorReturn(this, (Dynamic.__proto__ || Object.getPrototypeOf(Dynamic)).apply(this, arguments));
        }

        createClass(Dynamic, [{
            key: 'render',
            value: function render(ctx) {
                var el = ctx.getEl(this.id);

                var _ctx$get = ctx.get(this.value),
                    _ctx$get2 = slicedToArray(_ctx$get, 2),
                    v = _ctx$get2[1];

                el.data = v;
                get(Dynamic.prototype.__proto__ || Object.getPrototypeOf(Dynamic.prototype), 'render', this).call(this, ctx);
            }
        }, {
            key: 'update',
            value: function update(ctx) {
                var el = ctx.getEl(this.id);

                var _ctx$get3 = ctx.get(this.value),
                    _ctx$get4 = slicedToArray(_ctx$get3, 2),
                    changed = _ctx$get4[0],
                    v = _ctx$get4[1];

                if (changed === ChangeType.CHANGED) el.data = v;
            }
        }]);
        return Dynamic;
    }(Static);

    var Html = function (_Static2) {
        inherits(Html, _Static2);

        function Html() {
            classCallCheck(this, Html);
            return possibleConstructorReturn(this, (Html.__proto__ || Object.getPrototypeOf(Html)).apply(this, arguments));
        }

        createClass(Html, [{
            key: 'init',
            value: function init(ctx) {
                ctx.setEl(this.id, document.createElement('noscript'));
                ctx.setEl(this.id + 'e', document.createElement('noscript'));
            }
        }, {
            key: 'render',
            value: function render(ctx) {
                get(Html.prototype.__proto__ || Object.getPrototypeOf(Html.prototype), 'render', this).call(this, ctx);
                this.parent.append(ctx, ctx.getEl(this.id + 'e'));
                this.update(ctx);
            }
        }, {
            key: 'update',
            value: function update(ctx) {
                var start = ctx.getEl(this.id);
                var end = ctx.getEl(this.id + 'e');

                var _ctx$get5 = ctx.get(this.value),
                    _ctx$get6 = slicedToArray(_ctx$get5, 2),
                    changed = _ctx$get6[0],
                    v = _ctx$get6[1];

                if (changed === ChangeType.NOT_CHANGED) return;
                while (start.nextSibling && start.nextSibling !== end) {
                    start.parentNode.removeChild(start.nextSibling);
                }
                start.insertAdjacentHTML('afterend', v);
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, domRemove) {
                if (domRemove) {
                    var start = ctx.getEl(this.id);
                    var end = ctx.getEl(this.id + 'e');
                    while (start.nextSibling && start.nextSibling !== end) {
                        start.parentNode.removeChild(start.nextSibling);
                    }
                }
                ctx.setEl(this.id + 'e', null);
                get(Html.prototype.__proto__ || Object.getPrototypeOf(Html.prototype), 'destroy', this).call(this, ctx, domRemove);
            }
        }]);
        return Html;
    }(Static);

    var TextTag = function (_Tag) {
        inherits(TextTag, _Tag);

        function TextTag(id, items) {
            classCallCheck(this, TextTag);

            var _this3 = possibleConstructorReturn(this, (TextTag.__proto__ || Object.getPrototypeOf(TextTag)).call(this, id));

            _this3.items = items.map(function (it, i) {
                var iid = '' + _this3.id + i;
                if (it[0] === 2) return new Html(iid, it[1]);
                if (it[0] === 1) return new Dynamic(iid, it[1]);
                return new Static(iid, it[1]);
            });
            return _this3;
        }

        createClass(TextTag, [{
            key: 'init',
            value: function init(ctx, waiter) {
                var _this4 = this;

                this.items.forEach(function (it) {
                    it.parent = _this4.parent;
                    it.init(ctx);
                });
            }
        }, {
            key: 'render',
            value: function render(ctx, waiter) {
                this.items.forEach(function (it) {
                    return it.render(ctx);
                });
            }
        }, {
            key: 'update',
            value: function update(ctx, waiter) {
                this.items.forEach(function (it) {
                    return it.update(ctx);
                });
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, waiter, domRemove) {
                this.items.forEach(function (it) {
                    return it.destroy(ctx, domRemove);
                });
            }
        }, {
            key: 'append',
            value: function append(ctx, el, anchor) {}
        }, {
            key: 'remove',
            value: function remove(ctx, el) {}
        }]);
        return TextTag;
    }(Tag);

    var Transformer = function () {
        function Transformer(value, items, end) {
            classCallCheck(this, Transformer);

            this.value = value;
            this.items = items || [];
            this.end = end;
        }

        createClass(Transformer, [{
            key: 'get',
            value: function get$$1(dc, state) {
                var v = getValue(dc, this.value, state);
                v = this.items.reduce(function (acc, item) {
                    return item.get(dc, state, acc);
                }, v);
                if (v == null && this.end) {
                    return getAttributeValue(dc, this.end, state);
                }
                return v;
            }
        }]);
        return Transformer;
    }();

    var TransformerItem = function () {
        function TransformerItem(name, args) {
            classCallCheck(this, TransformerItem);

            this.name = name;
            this.args = args || [];
        }

        createClass(TransformerItem, [{
            key: 'get',
            value: function get$$1(dc, state, v) {
                var fn = dc.transformer(this.name);
                if (!fn) {
                    throw new Error('no helper found: ' + this.name);
                }
                var args = this.args.map(function (it) {
                    return getAttributeValue(dc, it, state);
                }).concat(v);
                return fn.apply(null, args);
            }
        }]);
        return TransformerItem;
    }();

    var toKeys = function toKeys(list) {
        if (!list) return [];
        return Array.isArray(list) ? list.map(function (it, i) {
            return i;
        }) : Object.keys(list);
    };

    var EachTag = function (_BlockTag) {
        inherits(EachTag, _BlockTag);

        function EachTag(id, needAnchor, def, loopPart, falsePart) {
            classCallCheck(this, EachTag);

            var _this = possibleConstructorReturn(this, (EachTag.__proto__ || Object.getPrototypeOf(EachTag)).call(this, id, needAnchor));

            _this.def = def;
            _this.loopPart = loopPart;
            _this.falsePart = falsePart || emptyTags;
            return _this;
        }

        createClass(EachTag, [{
            key: 'init',
            value: function init(ctx, waiter) {
                var _this2 = this;

                this.loopPart.forEach(function (it) {
                    return it.parent = _this2;
                });
                this.falsePart.forEach(function (it) {
                    return it.parent = _this2;
                });
                get(EachTag.prototype.__proto__ || Object.getPrototypeOf(EachTag.prototype), 'init', this).call(this, ctx, waiter);
            }
        }, {
            key: 'render',
            value: function render(ctx, waiter) {
                var _this3 = this;

                get(EachTag.prototype.__proto__ || Object.getPrototypeOf(EachTag.prototype), 'render', this).call(this, ctx, waiter);

                var _ctx$get = ctx.get(this.def.name),
                    _ctx$get2 = slicedToArray(_ctx$get, 2),
                    list = _ctx$get2[1];

                var kv = toKeys(list);
                if (!kv.length) {
                    this.renderElse(ctx, waiter);
                    return;
                }
                this.doEach(ctx, kv, function () {
                    return _this3.renderBody(ctx, waiter);
                });
            }
        }, {
            key: 'update',
            value: function update(ctx, waiter) {
                var _this4 = this;

                var _ctx$get3 = ctx.get(this.def.name),
                    _ctx$get4 = slicedToArray(_ctx$get3, 3),
                    changed = _ctx$get4[0],
                    list = _ctx$get4[1],
                    old = _ctx$get4[2];

                var lkv = toKeys(list);
                var okv = toKeys(old);
                var le = !lkv.length;
                var oe = !okv.length;
                if (le && oe) {
                    this.falsePart.update(ctx, waiter);
                    return;
                }
                if (changed === ChangeType.NOT_CHANGED) {
                    this.doEach(ctx, lkv, function () {
                        return _this4.loopPart.update(ctx, waiter);
                    });
                    return;
                }
                if (!oe && le) {
                    this.doEach(ctx, okv, function () {
                        return _this4.loopPart.destroy(ctx, waiter, true);
                    }, true);
                    this.renderElse(ctx, waiter);
                    return;
                }
                if (oe && !le) {
                    this.falsePart.destroy(ctx, waiter, true);
                    this.doEach(ctx, lkv, function () {
                        return _this4.renderBody(ctx, waiter);
                    });
                    return;
                }
                if (lkv.length === okv.length) {
                    this.doEach(ctx, lkv, function () {
                        return _this4.loopPart.update(ctx, waiter);
                    });
                    return;
                }
                if (lkv.length < okv.length) {
                    this.doEach(ctx, lkv, function () {
                        return _this4.loopPart.update(ctx, waiter);
                    });
                    this.doEach(ctx, okv.slice(lkv.length), function () {
                        return _this4.loopPart.destroy(ctx, waiter, true);
                    }, true);
                    return;
                }
                this.doEach(ctx, lkv.slice(0, okv.length), function () {
                    return _this4.loopPart.update(ctx, waiter);
                });
                this.doEach(ctx, lkv.slice(okv.length), function () {
                    return _this4.renderBody(ctx, waiter);
                });
            }
        }, {
            key: 'renderElse',
            value: function renderElse(ctx, waiter) {
                var w = new Waiter();
                this.falsePart.init(ctx, w);
                this.falsePart.render(ctx, w);
                waiter.wait(w.end());
            }
        }, {
            key: 'renderBody',
            value: function renderBody(ctx, waiter) {
                var w = new Waiter();
                this.loopPart.init(ctx, w);
                this.loopPart.render(ctx, w);
                waiter.wait(w.end());
            }
        }, {
            key: 'doEach',
            value: function doEach(ctx, list, fn) {
                var remove = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

                ctx.cache.push(this.id, this.def);
                list.forEach(function (it) {
                    var d = ctx.cache.next(it);
                    fn(it);
                    if (remove) d.dispose();
                });
                ctx.cache.pop();
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, waiter, domRemove) {
                var _this5 = this;

                var _ctx$get5 = ctx.get(this.def.name),
                    _ctx$get6 = slicedToArray(_ctx$get5, 3),
                    changed = _ctx$get6[0],
                    list = _ctx$get6[1],
                    old = _ctx$get6[2];

                var kv = changed === ChangeType.NOT_CHANGED ? toKeys(list) : toKeys(old);
                this.doEach(ctx, kv, function () {
                    return _this5.loopPart.destroy(ctx, waiter, domRemove);
                }, true);
                if (!kv.length) this.falsePart.destroy(ctx, waiter, domRemove);
                get(EachTag.prototype.__proto__ || Object.getPrototypeOf(EachTag.prototype), 'destroy', this).call(this, ctx, waiter, domRemove);
            }
        }]);
        return EachTag;
    }(BlockTag);

    var IfTag = function (_BlockTag) {
        inherits(IfTag, _BlockTag);

        function IfTag(id, needAnchor, bool, truePart, falsePart) {
            classCallCheck(this, IfTag);

            var _this = possibleConstructorReturn(this, (IfTag.__proto__ || Object.getPrototypeOf(IfTag)).call(this, id, needAnchor));

            _this.bool = bool;
            _this.truePart = truePart;
            _this.falsePart = falsePart || emptyTags;
            return _this;
        }

        createClass(IfTag, [{
            key: 'init',
            value: function init(ctx, waiter) {
                var _this2 = this;

                this.truePart.forEach(function (it) {
                    return it.parent = _this2;
                });
                this.falsePart.forEach(function (it) {
                    return it.parent = _this2;
                });
                get(IfTag.prototype.__proto__ || Object.getPrototypeOf(IfTag.prototype), 'init', this).call(this, ctx, waiter);
            }
        }, {
            key: 'render',
            value: function render(ctx, waiter) {
                get(IfTag.prototype.__proto__ || Object.getPrototypeOf(IfTag.prototype), 'render', this).call(this, ctx, waiter);

                var _ctx$get = ctx.get(this.bool),
                    _ctx$get2 = slicedToArray(_ctx$get, 2),
                    v = _ctx$get2[1];

                this.renderIt(this.use(v), ctx, waiter);
            }
        }, {
            key: 'update',
            value: function update(ctx, waiter) {
                var _ctx$get3 = ctx.get(this.bool),
                    _ctx$get4 = slicedToArray(_ctx$get3, 3),
                    changed = _ctx$get4[0],
                    v = _ctx$get4[1],
                    old = _ctx$get4[2];

                if (changed === ChangeType.NOT_CHANGED) {
                    this.use(v).update(ctx, waiter);
                    return;
                }
                this.use(old).destroy(ctx, waiter, true);
                this.renderIt(this.use(v), ctx, waiter);
            }
        }, {
            key: 'destroy',
            value: function destroy(ctx, waiter, domRemove) {
                var _ctx$get5 = ctx.get(this.bool),
                    _ctx$get6 = slicedToArray(_ctx$get5, 3),
                    v = _ctx$get6[2];

                this.use(v).destroy(ctx, waiter, domRemove);
                get(IfTag.prototype.__proto__ || Object.getPrototypeOf(IfTag.prototype), 'destroy', this).call(this, ctx, waiter, domRemove);
            }
        }, {
            key: 'renderIt',
            value: function renderIt(tags, ctx, waiter) {
                var w = new Waiter();
                tags.init(ctx, w);
                tags.render(ctx, w);
                waiter.wait(w.end());
            }
        }, {
            key: 'use',
            value: function use(v) {
                return v ? this.truePart : this.falsePart;
            }
        }]);
        return IfTag;
    }(BlockTag);

    var UnlessTag = function (_IfTag) {
        inherits(UnlessTag, _IfTag);

        function UnlessTag() {
            classCallCheck(this, UnlessTag);
            return possibleConstructorReturn(this, (UnlessTag.__proto__ || Object.getPrototypeOf(UnlessTag)).apply(this, arguments));
        }

        createClass(UnlessTag, [{
            key: 'use',
            value: function use(v) {
                return v ? this.falsePart : this.truePart;
            }
        }]);
        return UnlessTag;
    }(IfTag);

    var nodes = {
        // TODO window: WindowNode,
        // app: ApplicationNode
    };
    function createTag(id, name) {
        if (nodes[name]) return new nodes[name](id);
    }
    // nodes
    var SN = function SN(id, name) {
        var node = createTag(name, id);
        return node ? node : new StaticTag(name, id);
    };
    var DN = function DN(id, name, events, widgits) {
        var node = createTag(name, id);
        return node ? node : new DynamicTag(name, id, events, widgits);
    };
    var REF = function REF(id, needAnchor, name, events) {
        return new ReferenceTag(id, needAnchor, name, events);
    };
    var TX = function TX(id) {
        for (var _len = arguments.length, ss = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            ss[_key - 1] = arguments[_key];
        }

        return new TextTag(id, ss);
    };
    var TS = function TS() {
        for (var _len2 = arguments.length, ts = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            ts[_key2] = arguments[_key2];
        }

        return new Tags(ts);
    };
    // node attribute
    var SA = function SA(d, name, value) {
        var useSet = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        d.attr(name, value, useSet);
    };
    var DA = function DA(d, name, helper) {
        var useSet = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        return d.dattr(name, helper, useSet);
    };
    var EVD = function EVD(tp, id, name, method, isAction) {
        for (var _len3 = arguments.length, attrs = Array(_len3 > 5 ? _len3 - 5 : 0), _key3 = 5; _key3 < _len3; _key3++) {
            attrs[_key3 - 5] = arguments[_key3];
        }

        tp.event(id, { name: name, method: method, isAction: isAction, attrs: attrs });
    };
    // const EV = (d: DynamicTag | ReferenceTag, ...events: string[]) => d.event(events)
    var MP = function MP(d, name, helper) {
        return d.map(name, helper);
    };
    var W = function W(tp, id, name) {
        for (var _len4 = arguments.length, args = Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
            args[_key4 - 3] = arguments[_key4];
        }

        tp.widget(id, { name: name, args: args });
    };
    var R = function R(tp, name, id) {
        for (var _len5 = arguments.length, each = Array(_len5 > 3 ? _len5 - 3 : 0), _key5 = 3; _key5 < _len5; _key5++) {
            each[_key5 - 3] = arguments[_key5];
        }

        tp.ref(name, { id: id, each: each });
    };
    // const CO = (d: DynamicNode, name: string, ...hs: Helper[]) => d.component(name, hs)
    var C = function C(parent) {
        for (var _len6 = arguments.length, children = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            children[_key6 - 1] = arguments[_key6];
        }

        parent.children = new Tags(children);
        children.forEach(function (it) {
            return it.parent = parent;
        });
    };
    // attributes
    var TI = function TI(name) {
        for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
            args[_key7 - 1] = arguments[_key7];
        }

        return new TransformerItem(name, args);
    };
    var TV = function TV(value, end) {
        for (var _len8 = arguments.length, items = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
            items[_key8 - 2] = arguments[_key8];
        }

        return [ValueType.TRANSFORMER, new Transformer(value, items, end)];
    };
    var SV = function SV(v) {
        return [ValueType.STATIC, v];
    };
    var DV = function DV(v) {
        return [ValueType.DYNAMIC, v];
    };
    var AT = function AT(n, v) {
        return [n, v];
    };
    // helpers
    var H = function H(tp, id, n) {
        tp.helper(id, Array.isArray(n) ? new EchoHelper([n]) : new EchoHelper([DV(n)]));
    };
    var HB = function HB(tp, id) {
        for (var _len9 = arguments.length, args = Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
            args[_key9 - 2] = arguments[_key9];
        }

        tp.helper(id, new BoolHelper(args));
    };
    var HC = function HC(tp, id) {
        for (var _len10 = arguments.length, args = Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
            args[_key10 - 2] = arguments[_key10];
        }

        tp.helper(id, new ConcatHelper(args));
    };
    var HIF = function HIF(tp, id, bool) {
        for (var _len11 = arguments.length, args = Array(_len11 > 3 ? _len11 - 3 : 0), _key11 = 3; _key11 < _len11; _key11++) {
            args[_key11 - 3] = arguments[_key11];
        }

        tp.helper(id, new IfHelper(bool, args));
    };
    var HUN = function HUN(tp, id, bool) {
        for (var _len12 = arguments.length, args = Array(_len12 > 3 ? _len12 - 3 : 0), _key12 = 3; _key12 < _len12; _key12++) {
            args[_key12 - 3] = arguments[_key12];
        }

        tp.helper(id, new UnlessHelper(bool, args));
    };
    var HM = function HM(tp, id, joiner) {
        for (var _len13 = arguments.length, helpers = Array(_len13 > 3 ? _len13 - 3 : 0), _key13 = 3; _key13 < _len13; _key13++) {
            helpers[_key13 - 3] = arguments[_key13];
        }

        tp.helper(id, new MultiHelper(joiner, helpers));
    };
    var HH = function HH(tp, id, n) {
        for (var _len14 = arguments.length, args = Array(_len14 > 3 ? _len14 - 3 : 0), _key14 = 3; _key14 < _len14; _key14++) {
            args[_key14 - 3] = arguments[_key14];
        }

        tp.helper(id, new DelayHelper(n, args));
    };
    // block
    var EAD = function EAD(name, alias, idx, key) {
        return { name: name, alias: alias, idx: idx, key: key };
    };
    var EH = function EH(id, needAnchor, def, loop, falseTags) {
        return new EachTag(id, needAnchor, def, loop, falseTags);
    };
    var IF = function IF(id, needAnchor, helper, trueTags, falseTags) {
        return new IfTag(id, needAnchor, helper, trueTags, falseTags);
    };
    var UN = function UN(id, needAnchor, helper, trueTags, falseTags) {
        return new UnlessTag(id, needAnchor, helper, trueTags, falseTags);
    };
    var factory = {
        SN: SN, DN: DN, TX: TX, REF: REF, SV: SV, DV: DV, AT: AT, H: H, HC: HC, HB: HB, HIF: HIF, HUN: HUN, HM: HM, HH: HH, EVD: EVD,
        EAD: EAD, EH: EH, IF: IF, UN: UN, C: C, SA: SA, DA: DA, TI: TI, TV: TV, MP: MP, TS: TS, W: W, R: R
    };
    function registerNode(name, type) {
        nodes[name] = type;
    }

    exports.factory = factory;
    exports.ComponentTemplate = ComponentTemplate;
    exports.ViewTemplate = ViewTemplate;
    exports.Application = Application;
    exports.Loader = Loader;
    exports.RouterPlugin = RouterPlugin;
    exports.registerNode = registerNode;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=drizzle.js.map
