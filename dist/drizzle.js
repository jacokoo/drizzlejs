;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Drizzle = factory();
  }
}(this, function() {
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
 * DrizzleJS v0.3.18
 * -------------------------------------
 * Copyright (c) 2016 Jaco Koo <jaco.koo@guyong.in>
 * Distributed under MIT license
 */

var Drizzle = {},
    D = Drizzle,
    slice = [].slice,
    EMPTY = function EMPTY() {},
    map = function map(arr, fn) {
    var result = [];
    if (!arr) return result;
    if (arr.map) return arr.map(fn);

    for (var i = 0; i < arr.length; i++) {
        result.push(fn(arr[i], i, arr));
    }
    return result;
},
    mapObj = function mapObj(obj, fn) {
    var result = [];
    var key = undefined;
    if (!obj) return result;

    for (key in obj) {
        if (D.hasOwnProperty.call(obj, key)) result.push(fn(obj[key], key, obj));
    }

    return result;
},
    clone = function clone(target) {
    if (D.isObject(target)) {
        var _ret = function () {
            var result = {};
            mapObj(target, function (value, key) {
                result[key] = clone(value);
            });
            return {
                v: result
            };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }

    if (D.isArray(target)) {
        return map(target, function (value) {
            return clone(value);
        });
    }

    return target;
},
    typeCache = {
    View: {}, Region: {}, Module: {}, Model: {}, Store: {},

    register: function register(type, name, clazz) {
        this[type][name] = clazz;
    },
    create: function create(type, name) {
        var Clazz = this[type][name] || D[type];

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
        }

        return new (Function.prototype.bind.apply(Clazz, [null].concat(args)))();
    }
};

var counter = 0,
    root = null;

if (typeof window !== 'undefined') {
    root = window;
}

map(['Function', 'Array', 'String', 'Object'], function (item) {
    D['is' + item] = function (obj) {
        return D.toString.call(obj) === '[object ' + item + ']';
    };
});

map(['Module', 'View', 'Region', 'Model', 'Store'], function (item) {
    D['register' + item] = function (name, clazz) {
        return typeCache.register(item, name, clazz);
    };
    typeCache['create' + item] = function (name) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        return typeCache.create.apply(typeCache, [item, name].concat(args));
    };
});

Object.assign(D, {
    uniqueId: function uniqueId() {
        var prefix = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        return '' + prefix + ++counter;
    },
    adapt: function adapt(obj) {
        Object.assign(D.Adapter, obj);
    }
});

D.Adapter = {
    Promise: Promise,

    ajax: function ajax(params) {
        var xhr = new XMLHttpRequest();
        xhr.open(params.type, params.url, true);
        var promise = new Promise(function (resolve, reject) {
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 4000) {
                    resolve(JSON.parse(this.response));
                    return;
                }
                reject(xhr);
            };

            xhr.onerror = function () {
                reject(xhr);
            };
        });
        xhr.send(params.data);
        return promise;
    },
    ajaxResult: function ajaxResult(args) {
        return args[0];
    },
    getEventTarget: function getEventTarget(e) {
        return e.target;
    },
    getFormData: function getFormData(el) {
        throw new Error('getFormData is not implemented', el);
    },
    addEventListener: function addEventListener(el, name, handler, useCapture) {
        el.addEventListener(name, handler, useCapture);
    },
    removeEventListener: function removeEventListener(el, name, handler) {
        el.removeEventListener(el, name, handler);
    },
    hasClass: function hasClass(el, clazz) {
        return el.classList.contains(clazz);
    },
    addClass: function addClass(el, clazz) {
        el.classList.add(clazz);
    },
    removeClass: function removeClass(el, clazz) {
        el.classList.remove(clazz);
    }
};

D.Promise = function () {
    function Promiser(context) {
        _classCallCheck(this, Promiser);

        this.context = context;
    }

    _createClass(Promiser, [{
        key: 'create',
        value: function create(fn) {
            var _this = this;

            return new D.Adapter.Promise(function (resolve, reject) {
                fn.call(_this.context, resolve, reject);
            });
        }
    }, {
        key: 'resolve',
        value: function resolve(data) {
            return D.Adapter.Promise.resolve(data);
        }
    }, {
        key: 'reject',
        value: function reject(data) {
            return D.Adapter.Promise.reject(data);
        }
    }, {
        key: 'parallel',
        value: function parallel(items) {
            var _this2 = this;

            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            return this.create(function (resolve, reject) {
                var result = [],
                    thenables = [],
                    indexMap = {};
                map(items, function (item, i) {
                    var value = undefined;
                    try {
                        value = D.isFunction(item) ? item.apply(_this2.context, args) : item;
                    } catch (e) {
                        reject(e);
                    }
                    if (value && value.then) {
                        indexMap[thenables.length] = i;
                        thenables.push(value);
                    } else {
                        result[i] = value;
                    }
                });

                if (thenables.length === 0) return resolve(result);

                D.Adapter.Promise.all(thenables).then(function (as) {
                    mapObj(indexMap, function (key, value) {
                        return result[value] = as[key];
                    });
                    resolve(result);
                }, function (as) {
                    reject(as);
                });
            });
        }
    }, {
        key: 'chain',
        value: function chain() {
            var _this3 = this;

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            var prev = null;
            var doRing = function doRing(rings, ring, resolve, reject) {
                var nextRing = function nextRing(data) {
                    prev = data;
                    rings.length === 0 ? resolve(prev) : doRing(rings, rings.shift(), resolve, reject);
                };

                if (D.isArray(ring)) {
                    ring.length === 0 ? nextRing([]) : _this3.parallel.apply(_this3, [ring].concat(_toConsumableArray(prev != null ? [prev] : []))).then(nextRing, reject);
                } else {
                    var value = undefined;
                    try {
                        value = D.isFunction(ring) ? ring.apply(_this3.context, prev != null ? [prev] : []) : ring;
                    } catch (e) {
                        reject(e);
                    }

                    value && value.then ? value.then(nextRing, reject) : nextRing(value);
                }
            };

            if (args.length === 0) return this.resolve();

            return this.create(function (resolve, reject) {
                doRing(args, args.shift(), resolve, reject);
            });
        }
    }]);

    return Promiser;
}();

D.Event = {
    on: function on(name, fn, ctx) {
        this._events || (this._events = {});
        (this._events[name] || (this._events[name] = [])).push({ fn: fn, ctx: ctx });
    },
    off: function off(name, fn) {
        if (!this._events || !name || !this._events[name]) return;
        if (!fn) {
            delete this._events[name];
            return;
        }

        var result = [];
        map(this._events[name], function (item) {
            if (item.fn !== fn) result.push(item);
        });

        if (result.length === 0) {
            delete this._events[name];
            return;
        }
        this._events[name] = result;
    },
    trigger: function trigger(name) {
        for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            args[_key5 - 1] = arguments[_key5];
        }

        if (!name || !this._events || !this._events[name]) return this;
        map(this._events[name], function (item) {
            return item.fn.apply(item.ctx, args);
        });
    },
    delegateEvent: function delegateEvent(to) {
        var me = this,
            id = '--' + to.id,
            target = to;

        Object.assign(target, {
            _listeners: {},

            listenTo: function listenTo(obj, name, fn, ctx) {
                (target._listeners[name] || (target._listeners[name] = [])).push({ fn: fn, obj: obj });
                obj.on(name, fn, ctx || target);
            },
            stopListening: function stopListening(obj, name, fn) {
                mapObj(target._listeners, function (value, key) {
                    var result = [];
                    map(value, function (item) {
                        var offIt = fn && item.fn === fn && name === key && obj === item.obj;
                        offIt = offIt || !fn && name && name === key && obj === item.obj;
                        offIt = offIt || !fn && !name && obj && obj === item.obj;
                        offIt = offIt || !fn && !name && !obj;
                        if (offIt) {
                            item.obj.off(key, item.fn);
                            return;
                        }
                        result.push(item);
                    });

                    target._listeners[key] = result;
                    if (result.length === 0) {
                        delete target._listeners[key];
                    }
                });
            },
            on: function on(name, fn, ctx) {
                target.listenTo(me, name + id, fn, ctx);
            },
            off: function off(name, fn) {
                target.stopListening(me, name && name + id, fn);
            },
            trigger: function trigger(name) {
                if (!name) return target;

                for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                    args[_key6 - 1] = arguments[_key6];
                }

                args.unshift(name + id) && me.trigger.apply(me, args);
            }
        });
        return this;
    }
};

D.Request = {
    get: function get(model, options) {
        return this._ajax('GET', model, model.params, options);
    },
    post: function post(model, options) {
        return this._ajax('POST', model, model.data, options);
    },
    put: function put(model, options) {
        return this._ajax('PUT', model, model.data, options);
    },
    del: function del(model, options) {
        return this._ajax('DELETE', model, model.data, options);
    },
    save: function save(model, options) {
        return model.data && model.data[model._idKey] ? this.put(model, options) : this.post(model, options);
    },
    _url: function _url(model) {
        var parts = [],
            prefix = model.module._option('urlPrefix', model) || '',
            urlRoot = model.app._option('urlRoot', model) || '',
            urlSuffix = model.app._option('urlSuffix', model) || '';
        var base = model._url() || '';

        urlRoot && parts.push(urlRoot);
        prefix && parts.push(prefix);
        parts.push(model.module.name);

        while (base.indexOf('../') === 0) {
            parts.pop();
            base = base.slice(3);
        }

        base && parts.push(base);
        model.data && model.data[model._idKey] && parts.push(model.data[model._idKey]);
        urlSuffix && parts.push(urlSuffix);

        return parts.join('/');
    },
    _ajax: function _ajax(method, model, data, options) {
        var params = Object.assign({ type: method }, options);

        params.data = Object.assign({}, data, params.data);
        params.url = this._url(model);

        return model.Promise.create(function (resolve, reject) {
            D.Adapter.ajax(params).then(function () {
                for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                    args[_key7] = arguments[_key7];
                }

                model.set(D.Adapter.ajaxResult(args), !params.slient);
                resolve(args);
            }, function () {
                for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                    args[_key8] = arguments[_key8];
                }

                return reject(args);
            });
        });
    }
};

D.ComponentManager = {
    _handlers: {},
    _componentCache: {},

    setDefaultHandler: function setDefaultHandler(creator) {
        var destructor = arguments.length <= 1 || arguments[1] === undefined ? EMPTY : arguments[1];

        this._defaultHandler = { creator: creator, destructor: destructor };
    },
    register: function register(name, creator, destructor) {
        this._handlers[name] = { creator: creator, destructor: destructor || EMPTY };
    },
    _create: function _create(renderable, options) {
        var _this4 = this;

        var name = options.name;
        var id = options.id;
        var selector = options.selector;
        var opt = options.options;

        if (!name) renderable._error('Component name can not be null');

        var handler = this._handlers[name] || this._defaultHandler;
        if (!handler) renderable._error('No handler for component:', name);

        var dom = selector ? renderable.$$(selector) : renderable.$(id);
        var uid = id ? id : D.uniqueId('comp');

        return renderable.chain(handler.creator(renderable, dom, opt), function (component) {
            var cid = renderable.id + uid,
                cache = _this4._componentCache[cid],
                obj = { id: cid, handler: handler, index: D.uniqueId(cid), options: opt };

            D.isArray(cache) ? cache.push(obj) : _this4._componentCache[cid] = cache ? [cache, obj] : obj;
            return { id: id, component: component, index: obj.index };
        });
    },
    _destroy: function _destroy(renderable, obj) {
        var _this5 = this;

        var id = renderable.id + obj.id,
            cache = this._componentCache[id];
        var current = cache;

        if (D.isArray(cache)) {
            this._componentCache[id] = [];
            map(cache, function (item) {
                item.index !== obj.index ? _this5._componentCache[id].push(item) : current = item;
            });
            this._componentCache[id].length === 0 && delete this._componentCache[id];
        } else {
            delete this._componentCache[id];
        }

        current.handler.destructor(renderable, obj.component, current.options);
    }
};

D.Base = function () {
    function Base(name) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var defaults = arguments[2];

        _classCallCheck(this, Base);

        this.options = options;
        this.id = D.uniqueId('D');
        this.name = name;
        this.Promise = new D.Promise(this);

        Object.assign(this, defaults);
        if (options.mixin) this._mixin(options.mixin);
        this._loadedPromise = this._initialize();
    }

    _createClass(Base, [{
        key: '_initialize',
        value: function _initialize() {}
    }, {
        key: '_option',
        value: function _option(key) {
            var value = this.options[key];

            for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
                args[_key9 - 1] = arguments[_key9];
            }

            return D.isFunction(value) ? value.apply(this, args) : value;
        }
    }, {
        key: '_error',
        value: function _error(message) {
            if (!D.isString(message)) throw message;

            for (var _len10 = arguments.length, rest = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
                rest[_key10 - 1] = arguments[_key10];
            }

            throw new Error('[' + (this.module ? this.module.name + ':' : '') + this.name + '] ' + message + ' ' + rest.join(' '));
        }
    }, {
        key: '_mixin',
        value: function _mixin(obj) {
            var _this6 = this;

            mapObj(obj, function (value, key) {
                var old = _this6[key];
                if (!old) {
                    _this6[key] = value;
                    return;
                }

                if (D.isFunction(old)) {
                    _this6[key] = function () {
                        for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                            args[_key11] = arguments[_key11];
                        }

                        args.unshift(old);
                        return value.apply(_this6, args);
                    };
                }
            });
        }
    }, {
        key: 'chain',
        value: function chain() {
            var _Promise;

            return (_Promise = this.Promise).chain.apply(_Promise, arguments);
        }
    }]);

    return Base;
}();

D.Renderable = function (_D$Base) {
    _inherits(Renderable, _D$Base);

    function Renderable(name, app, mod, loader, options) {
        _classCallCheck(this, Renderable);

        var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Renderable).call(this, name, options, {
            app: app,
            module: mod,
            components: {},
            _loader: loader,
            _componentMap: {},
            _events: {}
        }));

        _this7._eventHandlers = _this7._option('handlers');
        app.delegateEvent(_this7);
        return _this7;
    }

    _createClass(Renderable, [{
        key: '_initialize',
        value: function _initialize() {
            var _this8 = this;

            this._templateEngine = this._option('templateEngine') || this.module && this.module._templateEngine || this.app._templateEngine;
            return this.chain([this._templateEngine._load(this), this._initializeEvents()], function (_ref) {
                var _ref2 = _slicedToArray(_ref, 1);

                var template = _ref2[0];
                return _this8._template = template;
            });
        }
    }, {
        key: 'render',
        value: function render(options) {
            return this._render(options == null ? this.renderOptions : options, true);
        }
    }, {
        key: '$',
        value: function $(id) {
            return this.$$('#' + this._wrapDomId(id))[0];
        }
    }, {
        key: '$$',
        value: function $$(selector) {
            return this._element.querySelectorAll(selector);
        }
    }, {
        key: '_render',
        value: function _render() {
            var _this9 = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var update = arguments[1];

            if (!this._region) this._error('Region is null');

            this.renderOptions = options;
            return this.chain(this._loadedPromise, this._destroyComponents, function () {
                return _this9.trigger('beforeRender');
            }, function () {
                return _this9._option('beforeRender');
            }, this._beforeRender, this._serializeData, function (data) {
                return _this9._renderTemplate(data, update);
            }, this._renderComponents, this._afterRender, function () {
                return _this9._option('afterRender');
            }, function () {
                return _this9.trigger('afterRender');
            }, this);
        }
    }, {
        key: '_setRegion',
        value: function _setRegion(region) {
            this._region = region;
            this._bindEvents();
        }
    }, {
        key: '_close',
        value: function _close() {
            var _this10 = this;

            if (!this._region) return this.Promise.resolve(this);

            return this.chain(function () {
                return _this10.trigger('beforeClose');
            }, function () {
                return _this10._option('beforeClose');
            }, this._beforeClose, [this._unbindEvents, this._destroyComponents, function () {
                return _this10._region._empty(_this10);
            }], this._afterClose, function () {
                return _this10._option('afterClose');
            }, function () {
                return _this10.trigger('afterClose');
            }, function () {
                return delete _this10._region;
            }, this);
        }
    }, {
        key: '_serializeData',
        value: function _serializeData() {
            return {
                Global: this.app.global,
                Self: this
            };
        }
    }, {
        key: '_renderTemplate',
        value: function _renderTemplate(data, update) {
            this._templateEngine._execute(this, data, this._template, update);
        }
    }, {
        key: '_initializeEvents',
        value: function _initializeEvents(events) {
            var _this11 = this;

            mapObj(events || this._option('events'), function (value, key) {
                var items = key.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/),
                    result = { key: key };

                if (items.length !== 2) _this11._error('Invalid event key');
                result.eventType = items[0];
                if (items[1].slice(-1) === '*') {
                    result.id = _this11._wrapDomId(items[1].slice(0, -1));
                    result.haveStar = true;
                    result.selector = '[id^=' + result.id + ']';
                } else {
                    result.id = _this11._wrapDomId(items[1]);
                    result.selector = '#' + result.id;
                }
                result.handler = _this11._createEventHandler(value, result);
                _this11._events[key] = result;
            });
        }
    }, {
        key: '_createEventHandler',
        value: function _createEventHandler(handlerName, _ref3) {
            var _this12 = this;

            var haveStar = _ref3.haveStar;
            var id = _ref3.id;
            var disabledClass = this.app.options.disabledClass;

            return function (event) {
                if (!_this12._eventHandlers[handlerName]) _this12._error('No event handler for name:', handlerName);

                var target = D.Adapter.getEventTarget(event),
                    args = [event];
                if (D.Adapter.hasClass(target, disabledClass)) return;
                if (haveStar) args.unshift(target.getAttribute('id').slice(id.length));
                _this12._eventHandlers[handlerName].apply(_this12, args);
            };
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this13 = this;

            mapObj(this._events, function (value) {
                _this13._region._delegateDomEvent(_this13, value.eventType, value.selector, value.handler);
            });
        }
    }, {
        key: '_unbindEvents',
        value: function _unbindEvents() {
            this._region._undelegateDomEvents(this);
        }
    }, {
        key: '_renderComponents',
        value: function _renderComponents() {
            var _this14 = this;

            return this.chain(map(this._option('components'), function (item) {
                var i = D.isFunction(item) ? item.call(_this14) : item;
                return i ? D.ComponentManager._create(_this14, i) : null;
            }), function (components) {
                return map(components, function (item) {
                    if (!item) return;
                    var id = item.id;
                    var component = item.component;
                    var index = item.index;var value = _this14.components[id];
                    D.isArray(value) ? value.push(component) : _this14.components[id] = value ? [value, component] : component;
                    _this14._componentMap[index] = item;
                });
            });
        }
    }, {
        key: '_destroyComponents',
        value: function _destroyComponents() {
            var _this15 = this;

            this.components = {};
            mapObj(this._componentMap, function (value) {
                return D.ComponentManager._destroy(_this15, value);
            });
            this._componentMap = {};
        }
    }, {
        key: '_wrapDomId',
        value: function _wrapDomId(id) {
            return this.id + id;
        }
    }, {
        key: '_beforeRender',
        value: function _beforeRender() {}
    }, {
        key: '_afterRender',
        value: function _afterRender() {}
    }, {
        key: '_beforeClose',
        value: function _beforeClose() {}
    }, {
        key: '_afterClose',
        value: function _afterClose() {}
    }, {
        key: '_element',
        get: function get() {
            return this._region ? this._region._getElement(this) : null;
        }
    }]);

    return Renderable;
}(D.Base);

D.RenderableContainer = function (_D$Renderable) {
    _inherits(RenderableContainer, _D$Renderable);

    function RenderableContainer() {
        _classCallCheck(this, RenderableContainer);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(RenderableContainer).apply(this, arguments));
    }

    _createClass(RenderableContainer, [{
        key: '_initialize',
        value: function _initialize() {
            var promise = _get(Object.getPrototypeOf(RenderableContainer.prototype), '_initialize', this).call(this);

            this._items = {};
            return this.chain(promise, this._initializeItems);
        }
    }, {
        key: '_afterRender',
        value: function _afterRender() {
            return this.chain(this._initializeRegions, this._renderItems);
        }
    }, {
        key: '_afterClose',
        value: function _afterClose() {
            return this._closeRegions();
        }
    }, {
        key: '_initializeItems',
        value: function _initializeItems() {
            var _this17 = this;

            this.chain(mapObj(this._option('items'), function () {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                var name = arguments[1];

                var opt = D.isFunction(options) ? options.call(_this17) : options;
                if (D.isString(opt)) opt = { region: opt };

                return _this17.app[options.isModule ? '_createModule' : '_createView'](name, _this17).then(function (item) {
                    var i = item;
                    i.moduleOptions = opt;
                    _this17._items[name] = item;
                    return item;
                });
            }));
        }
    }, {
        key: '_initializeRegions',
        value: function _initializeRegions() {
            var _this18 = this;

            this._regions = {};
            return this.chain(this.closeRegions, map(this.$$('[data-region]'), function (el) {
                var region = _this18._createRegion(el);
                _this18._regions[region.name] = region;
            }));
        }
    }, {
        key: '_renderItems',
        value: function _renderItems() {
            var _this19 = this;

            return this.chain(mapObj(this.items, function (item) {
                var region = item.moduleOptions.region;

                if (!region) return;
                if (!_this19.regions[region]) _this19._error('Region: ' + region + ' is not defined');
                _this19.regions[region].show(item);
            }), this);
        }
    }, {
        key: '_createRegion',
        value: function _createRegion(el) {
            var name = el.getAttribute('data-region');
            return this.app._createRegion(el, name, this);
        }
    }, {
        key: '_closeRegions',
        value: function _closeRegions() {
            var regions = this._regions;
            if (!regions) return this;
            delete this._regions;
            return this.chain(mapObj(regions, function (region) {
                return region.close();
            }), this);
        }
    }, {
        key: 'items',
        get: function get() {
            return this._items || {};
        }
    }, {
        key: 'regions',
        get: function get() {
            return this._regions || {};
        }
    }]);

    return RenderableContainer;
}(D.Renderable);

D.ActionCreator = function (_D$Renderable2) {
    _inherits(ActionCreator, _D$Renderable2);

    function ActionCreator() {
        _classCallCheck(this, ActionCreator);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ActionCreator).apply(this, arguments));
    }

    _createClass(ActionCreator, [{
        key: '_initializeEvents',
        value: function _initializeEvents() {
            _get(Object.getPrototypeOf(ActionCreator.prototype), '_initializeEvents', this).call(this);
            _get(Object.getPrototypeOf(ActionCreator.prototype), '_initializeEvents', this).call(this, this._option('actions'));
        }
    }, {
        key: '_createEventHandler',
        value: function _createEventHandler(name, obj) {
            var isAction = !!(this._option('actions') || {})[obj.key];
            return isAction ? this._createAction(name) : _get(Object.getPrototypeOf(ActionCreator.prototype), '_createEventHandler', this).call(this, name, obj);
        }
    }, {
        key: '_createAction',
        value: function _createAction(name) {
            var _this21 = this;

            var disabledClass = this.app.options.disabledClass;

            var _ref4 = this._option('dataForActions') || {};

            var dataForAction = _ref4[name];

            var _ref5 = this._option('actionCallbacks') || {};

            var actionCallback = _ref5[name];

            return function (e) {
                var target = D.Adapter.getEventTarget(event);
                if (D.Adapter.hasClass(target, disabledClass)) return;
                D.Adapter.addClass(target, disabledClass);

                var data = _this21._getActionPayload(target);
                _this21.chain(D.isFunction(dataForAction) ? dataForAction.call(_this21, data, e) : data, function (payload) {
                    return payload !== false ? _this21.module.dispatch(name, payload) : false;
                }, function (result) {
                    return result !== false ? actionCallback && actionCallback.call(_this21, result) : false;
                }).then(function () {
                    return D.Adapter.removeClass(target, disabledClass);
                }, function () {
                    return D.Adapter.removeClass(target, disabledClass);
                });
            };
        }
    }, {
        key: '_getActionPayload',
        value: function _getActionPayload(target) {
            var rootEl = this._element;
            var current = target,
                targetName = false;
            while (current && current !== rootEl && current.tagName !== 'FORM') {
                current = current.parentNode;
            }current || (current = rootEl);
            var data = current.tagName === 'FORM' ? D.Adapter.getFormData(current) : {};
            map(current.querySelectorAll('[data-name][data-value]'), function (item) {
                if (item === target) {
                    targetName = target.getAttribute('data-name');
                    data[targetName] = target.getAttribute('data-value');
                    return;
                }

                var name = item.getAttribute('data-name');
                if (targetName && targetName === name) return;

                var value = item.getAttribute('data-value'),
                    v = data[name];
                D.isArray(v) ? v.push(value) : data[name] = v == null ? value : [v, value];
            });
            return data;
        }
    }]);

    return ActionCreator;
}(D.Renderable);

D.View = function (_D$ActionCreator) {
    _inherits(View, _D$ActionCreator);

    function View() {
        _classCallCheck(this, View);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(View).apply(this, arguments));
    }

    _createClass(View, [{
        key: '_initialize',
        value: function _initialize() {
            this.bindings = {};
            return this.chain(_get(Object.getPrototypeOf(View.prototype), '_initialize', this).call(this), this._initializeDataBinding);
        }
    }, {
        key: '_initializeDataBinding',
        value: function _initializeDataBinding() {
            var _this23 = this;

            this._dataBinding = {};
            mapObj(this._option('bindings'), function (value, key) {
                var model = _this23.bindings[key] = _this23.module.store.models[key];
                if (!model) _this23._error('No model:', key);

                if (!value) return;
                _this23._dataBinding[key] = { model: model, value: value, fn: function fn() {
                        if (value === true && _this23._region) _this23.render(_this23.renderOptions);
                        if (D.isString(value)) _this23._option(value);
                    } };
            });
        }
    }, {
        key: '_bindData',
        value: function _bindData() {
            var _this24 = this;

            mapObj(this._dataBinding, function (value) {
                return _this24.listenTo(value.model, 'changed', value.fn);
            });
        }
    }, {
        key: '_unbindData',
        value: function _unbindData() {
            this.stopListening();
            this.bindings = {};
        }
    }, {
        key: '_setRegion',
        value: function _setRegion() {
            var _get2;

            for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                args[_key12] = arguments[_key12];
            }

            (_get2 = _get(Object.getPrototypeOf(View.prototype), '_setRegion', this)).call.apply(_get2, [this].concat(args));
            this._bindData();
        }
    }, {
        key: '_close',
        value: function _close() {
            var _get3;

            for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                args[_key13] = arguments[_key13];
            }

            this.chain((_get3 = _get(Object.getPrototypeOf(View.prototype), '_close', this)).call.apply(_get3, [this].concat(args)), this._unbindData, this);
        }
    }, {
        key: '_serializeData',
        value: function _serializeData() {
            var _this25 = this;

            var data = _get(Object.getPrototypeOf(View.prototype), '_serializeData', this).call(this);
            mapObj(this.bindings, function (value, key) {
                return data[key] = value.get(true);
            });
            mapObj(this._option('dataForTemplate'), function (value, key) {
                return data[key] = value.call(_this25, data);
            });
            return data;
        }
    }]);

    return View;
}(D.ActionCreator);

D.Module = function (_D$RenderableContaine) {
    _inherits(Module, _D$RenderableContaine);

    function Module() {
        _classCallCheck(this, Module);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Module).apply(this, arguments));
    }

    _createClass(Module, [{
        key: '_initialize',
        value: function _initialize() {
            this.app._modules[this.name + '--' + this.id] = this;
            this._initializeStore();
            return _get(Object.getPrototypeOf(Module.prototype), '_initialize', this).call(this);
        }
    }, {
        key: 'dispatch',
        value: function dispatch(name, payload) {
            return this._store.dispatch(name, payload);
        }
    }, {
        key: '_initializeStore',
        value: function _initializeStore() {
            this._store = this.app._createStore(this, this._option('store'));
        }
    }, {
        key: '_afterClose',
        value: function _afterClose() {
            delete this.app._modules[this.name + '--' + this.id];
            this._store._destory();
            return _get(Object.getPrototypeOf(Module.prototype), '_afterClose', this).call(this);
        }
    }, {
        key: '_beforeRender',
        value: function _beforeRender() {
            var _this27 = this;

            return this.chain(_get(Object.getPrototypeOf(Module.prototype), '_beforeRender', this).call(this), function () {
                return _this27._store._loadEagerModels();
            });
        }
    }, {
        key: '_afterRender',
        value: function _afterRender() {
            var _this28 = this;

            return this.chain(_get(Object.getPrototypeOf(Module.prototype), '_afterRender', this).call(this), function () {
                return _this28._store._loadLazyModels();
            });
        }
    }, {
        key: 'store',
        get: function get() {
            return this._store;
        }
    }]);

    return Module;
}(D.RenderableContainer);

var CAPTURES = ['blur', 'focus', 'scroll', 'resize'];

D.Region = function (_D$Base2) {
    _inherits(Region, _D$Base2);

    function Region(app, mod, el, name) {
        _classCallCheck(this, Region);

        var _this29 = _possibleConstructorReturn(this, Object.getPrototypeOf(Region).call(this, name || 'Region', {}, {
            app: app,
            module: mod,
            _el: el,
            _delegated: {}
        }));

        if (!_this29._el) _this29._error('The DOM element for region is required');
        app.delegateEvent(_this29);
        return _this29;
    }

    _createClass(Region, [{
        key: 'show',
        value: function show(renderable) {
            var _this30 = this;

            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (this._isCurrent(renderable)) {
                if (options.forceRender === false) return this.Promise.resolve(this._current);
                return this._current._render(options, true);
            }

            return this.chain(D.isString(renderable) ? this.app._createModule(renderable) : renderable, function (item) {
                if (!(item instanceof D.Renderable)) {
                    _this30._error('The item is expected to be an instance of Renderable');
                }
                return item;
            }, [function (item) {
                return _this30.chain(item._region && item._region.close(), item);
            }, function () {
                return _this30.close();
            }], function (_ref6) {
                var _ref7 = _slicedToArray(_ref6, 1);

                var item = _ref7[0];

                _this30._current = item;
                var attr = item.module ? item.module.name + ':' + item.name : item.name;
                _this30._getElement().setAttribute('data-current', attr);
                item._setRegion(_this30);
                return item;
            }, function (item) {
                return item._render(options, false);
            });
        }
    }, {
        key: 'close',
        value: function close() {
            var _this31 = this;

            return this.chain(this._current && this._current._close(), function () {
                return delete _this31._current;
            }, this);
        }
    }, {
        key: '$$',
        value: function $$(selector) {
            return this._getElement().querySelectorAll(selector);
        }
    }, {
        key: '_isCurrent',
        value: function _isCurrent(renderable) {
            if (!this._current) return false;
            if (this._current.name === renderable) return true;
            if (renderable && renderable.id === this._current.id) return true;
            return false;
        }
    }, {
        key: '_getElement',
        value: function _getElement() {
            return this._el;
        }
    }, {
        key: '_empty',
        value: function _empty() {
            this._getElement().innerHTML = '';
        }
    }, {
        key: '_createDelegateListener',
        value: function _createDelegateListener(name) {
            var _this32 = this;

            return function (e) {
                if (!_this32._delegated[name]) return;
                var target = e.target;

                map(_this32._delegated[name].items, function (item) {
                    var els = _this32._getElement().querySelectorAll(item.selector);
                    var matched = false;
                    for (var i = 0; i < els.length; i++) {
                        var el = els[i];
                        if (el === target || el.contains(target)) {
                            matched = el;
                            break;
                        }
                    }
                    matched && item.fn.call(item.renderable, e);
                });
            };
        }
    }, {
        key: '_delegateDomEvent',
        value: function _delegateDomEvent(renderable, name, selector, fn) {
            var obj = this._delegated[name];
            if (!obj) {
                obj = this._delegated[name] = { listener: this._createDelegateListener(name), items: [] };
                D.Adapter.addEventListener(this._getElement(), name, obj.listener, CAPTURES.indexOf(name) !== -1);
            }
            obj.items.push({ selector: selector, fn: fn, renderable: renderable });
        }
    }, {
        key: '_undelegateDomEvents',
        value: function _undelegateDomEvents(renderable) {
            var _this33 = this;

            mapObj(this._delegated, function (value, key) {
                var items = [],
                    obj = value;
                map(obj.items, function (item) {
                    if (item.renderable !== renderable) items.push(item);
                });
                obj.items = items;
                if (items.length === 0) {
                    delete _this33._delegated[key];
                    D.Adapter.removeEventListener(_this33._getElement(), key, obj.listener);
                }
            });
        }
    }]);

    return Region;
}(D.Base);

D.TemplateEngine = function (_D$Base3) {
    _inherits(TemplateEngine, _D$Base3);

    function TemplateEngine(options) {
        _classCallCheck(this, TemplateEngine);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TemplateEngine).call(this, 'Template Engine', options, { _templateCache: {} }));
    }

    _createClass(TemplateEngine, [{
        key: 'executeIdReplacement',
        value: function executeIdReplacement(el, renderable) {
            var _this35 = this;

            var used = {};
            map(el.querySelectorAll('[id]'), function (item) {
                var id = item.getAttribute('id');
                if (used[id]) _this35._error('Dom ID: ' + id + ' is already used');
                used[id] = true;
                item.setAttribute('id', renderable._wrapDomId(id));
            });

            var attrs = this._option('attributesReferToId') || ['for', 'data-target', 'data-parent'];

            map(attrs, function (attr) {
                return map(el.querySelectorAll('[' + attr + ']'), function (item) {
                    var value = item.getAttribute(attr),
                        withHash = value.charAt(0) === '#',
                        wrapped = withHash ? '#' + renderable._wrapDomId(value.slice(1)) : renderable._wrapDomId(value);
                    item.setAttribute(attr, wrapped);
                });
            });
        }
    }, {
        key: '_load',
        value: function _load(renderable) {
            var id = renderable.id;
            if (this._templateCache[id]) return this._templateCache[id];
            return this._templateCache[id] = this._loadIt(renderable);
        }
    }, {
        key: '_loadIt',
        value: function _loadIt(renderable) {
            if (renderable instanceof Drizzle.Module) {
                return renderable._loader.loadModuleResource(renderable, 'templates');
            }

            return function () {
                return renderable.module._template;
            };
        }
    }, {
        key: '_execute',
        value: function _execute(renderable, data, template /* , update */) {
            var el = renderable._element;
            el.innerHTML = template(data);
            this.executeIdReplacement(el, renderable);
        }
    }]);

    return TemplateEngine;
}(D.Base);

D.Store = function (_D$Base4) {
    _inherits(Store, _D$Base4);

    function Store(mod, options) {
        _classCallCheck(this, Store);

        var _this36 = _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this, 'Store', options, {
            app: mod.app,
            module: mod,
            _models: {}
        }));

        _this36.app.delegateEvent(_this36);

        _this36._callbacks = _this36._option('callbacks');
        mapObj(_this36._callbacks, function (value, key) {
            if (key.slice(0, 4) !== 'app.') return;
            _this36.listenTo(_this36.app, key, function (payload) {
                return value.call(_this36._callbackContext, payload);
            });
        });
        return _this36;
    }

    _createClass(Store, [{
        key: 'dispatch',
        value: function dispatch(name, payload) {
            var callback = undefined,
                n = name,
                p = payload;
            if (D.isObject(n)) {
                p = n.payload;
                n = n.name;
            }

            callback = this._callbacks[n];
            if (!callback) this._error('No action callback for name: ' + name);
            return this.chain(callback.call(this._callbackContext, p));
        }
    }, {
        key: '_initialize',
        value: function _initialize() {
            this._initializeModels();
            this._callbackContext = Object.assign({
                models: this.models,
                module: this.module,
                app: this.app
            }, D.Request);
        }
    }, {
        key: '_initializeModels',
        value: function _initializeModels() {
            var _this37 = this;

            mapObj(this._option('models'), function (value, key) {
                var v = (D.isFunction(value) ? value.call(_this37) : value) || {};
                if (v.shared === true) {
                    _this37._models[key] = _this37.app.viewport.store[key];
                    return;
                }
                _this37._models[key] = _this37.app._createModel(_this37, v);
            });
        }
    }, {
        key: '_loadEagerModels',
        value: function _loadEagerModels() {
            return this.chain(mapObj(this._models, function (model) {
                return model.options.autoLoad === true ? D.Request.get(model) : null;
            }));
        }
    }, {
        key: '_loadLazyModels',
        value: function _loadLazyModels() {
            return this.chain(mapObj(this._models, function (model) {
                var autoLoad = model.options.autoLoad;

                return autoLoad && autoLoad !== true ? D.Request.get(model) : null;
            }));
        }
    }, {
        key: '_destory',
        value: function _destory() {
            this.stopListening();
        }
    }, {
        key: 'models',
        get: function get() {
            return this._models;
        }
    }]);

    return Store;
}(D.Base);

D.Model = function (_D$Base5) {
    _inherits(Model, _D$Base5);

    function Model(store, options) {
        _classCallCheck(this, Model);

        var _this38 = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this, 'Model', options, {
            app: store.module.app,
            module: store.module,
            store: store
        }));

        _this38._data = _this38._option('data') || {};
        _this38._idKey = _this38._option('idKey') || _this38.app.options.idKey;
        _this38._params = Object.assign({}, _this38._option('params'));
        _this38.app.delegateEvent(_this38);
        return _this38;
    }

    _createClass(Model, [{
        key: 'set',
        value: function set(data, trigger) {
            var d = this.options.parse ? this._option('parse', data) : data;
            this._data = this.options.root ? d[this.options.root] : d;
            if (trigger) this.changed();
        }
    }, {
        key: 'get',
        value: function get(cloneIt) {
            return cloneIt ? clone(this._data) : this._data;
        }
    }, {
        key: 'clear',
        value: function clear(trigger) {
            this._data = D.isArray(this._data) ? [] : {};
            if (trigger) this.changed();
        }
    }, {
        key: 'changed',
        value: function changed() {
            this.trigger('changed');
        }
    }, {
        key: '_url',
        value: function _url() {
            return this._option('url') || '';
        }
    }, {
        key: 'fullUrl',
        get: function get() {
            return D.Request._url(this);
        }
    }, {
        key: 'params',
        get: function get() {
            return this._params;
        }
    }, {
        key: 'data',
        get: function get() {
            return this._data;
        }
    }]);

    return Model;
}(D.Base);

D.Loader = function (_D$Base6) {
    _inherits(Loader, _D$Base6);

    _createClass(Loader, null, [{
        key: '_analyse',
        value: function _analyse(name) {
            if (!D.isString(name)) {
                return { loader: null, name: name };
            }

            var args = name.split(':'),
                loader = args.length > 1 ? args.shift() : null;

            return { loader: loader, name: args.shift(), args: args };
        }
    }]);

    function Loader(app, options) {
        _classCallCheck(this, Loader);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Loader).call(this, 'Loader', options, { app: app }));
    }

    _createClass(Loader, [{
        key: 'loadResource',
        value: function loadResource(path) {
            var _this40 = this;

            var _app$options = this.app.options;
            var scriptRoot = _app$options.scriptRoot;
            var getResource = _app$options.getResource;
            var amd = _app$options.amd;
            var fullPath = scriptRoot + '/' + path;

            return this.Promise.create(function (resolve, reject) {
                if (amd) {
                    require([fullPath], resolve, reject);
                } else if (getResource) {
                    resolve(getResource.call(_this40.app, fullPath));
                } else {
                    resolve(require('./' + fullPath));
                }
            });
        }
    }, {
        key: 'loadModuleResource',
        value: function loadModuleResource(mod, path) {
            return this.loadResource(mod.name + '/' + path);
        }
    }, {
        key: 'loadModule',
        value: function loadModule(name) {
            return this.loadResource(name + '/' + this.app.options.fileNames.module);
        }
    }, {
        key: 'loadView',
        value: function loadView(name, mod) {
            return this.loadModuleResource(mod, '' + this.app.options.fileNames.view + name);
        }
    }, {
        key: 'loadRouter',
        value: function loadRouter(path) {
            var name = this.app.options.fileNames.router;
            return this.loadResource(path ? path + '/' + name : name);
        }
    }]);

    return Loader;
}(D.Base);

D.Application = function (_D$Base7) {
    _inherits(Application, _D$Base7);

    function Application(options) {
        _classCallCheck(this, Application);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Application).call(this, options && options.name || 'Application', Object.assign({
            scriptRoot: 'app',
            urlRoot: '',
            urlSuffix: '',
            caseSensitiveHash: false,
            defaultRegion: root && root.document.body,
            disabledClass: 'disabled',
            getResource: null,
            idKey: 'id',
            viewport: 'viewport',

            fileNames: {
                module: 'index',
                view: 'view-',
                router: 'router'
            },

            pagination: {
                pageSize: 10,
                pageKey: '_page',
                pageSizeKey: '_pageSize',
                recordCountKey: 'recordCount'
            }
        }, options), {
            global: {},
            _modules: {},
            _loaders: {}
        }));
    }

    _createClass(Application, [{
        key: '_initialize',
        value: function _initialize() {
            this._templateEngine = this._option('templateEngine') || new D.TemplateEngine();
            this.registerLoader('default', new D.Loader(this), true);
            this._region = this._createRegion(this._option('defaultRegion'), 'Region');
        }
    }, {
        key: 'registerLoader',
        value: function registerLoader(name, loader, isDefault) {
            this._loaders[name] = loader;
            if (isDefault) this._defaultLoader = loader;
            return this;
        }
    }, {
        key: 'start',
        value: function start(defaultHash) {
            var _router,
                _this42 = this;

            if (defaultHash) this._router = new D.Router(this);

            return this.chain(defaultHash ? (_router = this._router)._mountRoutes.apply(_router, _toConsumableArray(this._option('routers'))) : false, this._region.show(this._option('viewport')), function (viewport) {
                return _this42.viewport = viewport;
            }, function () {
                return defaultHash && _this42._router._start(defaultHash);
            }, this);
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.off();
            this._region.close();
        }
    }, {
        key: 'navigate',
        value: function navigate(hash, trigger) {
            if (!this._router) return;
            this._router.navigate(hash, trigger);
        }
    }, {
        key: 'dispatch',
        value: function dispatch(name, payload) {
            var n = D.isObject(name) ? name.name : name,
                p = D.isObject(name) ? name.payload : payload;
            this.trigger('app.' + n, p);
        }
    }, {
        key: 'show',
        value: function show(region, moduleName, options) {
            return this.viewport.regions[region].show(moduleName, options);
        }
    }, {
        key: '_getLoader',
        value: function _getLoader(name, mod) {
            return name && this._loaders[name] || mod && mod._loader || this._defaultLoader;
        }
    }, {
        key: '_createModule',
        value: function _createModule(name, parentModule) {
            var _this43 = this;

            var _D$Loader$_analyse = D.Loader._analyse(name);

            var moduleName = _D$Loader$_analyse.name;
            var loaderName = _D$Loader$_analyse.loader;
            var loader = this._getLoader(loaderName, parent);

            return this.chain(loader.loadModule(moduleName), function () {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                return typeCache.createModule(options.type, moduleName, _this43, parentModule, loader, options);
            });
        }
    }, {
        key: '_createView',
        value: function _createView(name, mod) {
            var _this44 = this;

            var _D$Loader$_analyse2 = D.Loader._analyse(name);

            var viewName = _D$Loader$_analyse2.name;
            var loaderName = _D$Loader$_analyse2.loader;
            var loader = this._getLoader(loaderName, mod);

            return this.chain(loader.loadView(viewName, mod), function () {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                return typeCache.createView(options.type, viewName, _this44, mod, loader, options);
            });
        }
    }, {
        key: '_createRegion',
        value: function _createRegion(el, name, mod) {
            var _D$Loader$_analyse3 = D.Loader._analyse(name);

            var regionName = _D$Loader$_analyse3.name;
            var type = _D$Loader$_analyse3.loader;

            return typeCache.createRegion(type, this, mod, el, regionName);
        }
    }, {
        key: '_createStore',
        value: function _createStore(mod) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            return typeCache.createStore(options.type, mod, options);
        }
    }, {
        key: '_createModel',
        value: function _createModel(store) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            return typeCache.createModel(options.type, store, options);
        }
    }]);

    return Application;
}(D.Base);

Object.assign(D.Application.prototype, D.Event);

var PUSH_STATE_SUPPORTED = root && root.history && 'pushState' in root.history;
var ROUTER_REGEXPS = [/:([\w\d]+)/g, '([^\/]+)', /\*([\w\d]+)/g, '(.*)'];

var Route = function () {
    function Route(app, router, path, fn) {
        _classCallCheck(this, Route);

        var pattern = path.replace(ROUTER_REGEXPS[0], ROUTER_REGEXPS[1]).replace(ROUTER_REGEXPS[2], ROUTER_REGEXPS[3]);

        this.pattern = new RegExp('^' + pattern + '$', app.options.caseSensitiveHash ? 'g' : 'gi');

        this.app = app;
        this.router = router;
        this.path = path;
        this.fn = fn;
    }

    _createClass(Route, [{
        key: 'match',
        value: function match(hash) {
            this.pattern.lastIndex = 0;
            return this.pattern.test(hash);
        }
    }, {
        key: 'handle',
        value: function handle(hash) {
            var _router2,
                _this45 = this;

            this.pattern.lastIndex = 0;
            var args = this.pattern.exec(hash).slice(1),
                handlers = this.router._getInterceptors(this.path);

            handlers.push(this.fn);
            return (_router2 = this.router).chain.apply(_router2, _toConsumableArray(map(handlers, function (fn, i) {
                return function (prev) {
                    return fn.apply(_this45.router, i > 0 ? [prev].concat(args) : args);
                };
            })));
        }
    }]);

    return Route;
}();

D.Router = function (_D$Base8) {
    _inherits(Router, _D$Base8);

    function Router(app) {
        _classCallCheck(this, Router);

        var _this46 = _possibleConstructorReturn(this, Object.getPrototypeOf(Router).call(this, 'Router', {}, {
            app: app,
            _routes: [],
            _interceptors: {},
            _started: false
        }));

        _this46._EVENT_HANDLER = function () {
            return _this46._dispath(_this46._getHash());
        };
        return _this46;
    }

    _createClass(Router, [{
        key: 'navigate',
        value: function navigate(path, trigger) {
            if (!this._started) return;
            if (PUSH_STATE_SUPPORTED) {
                root.history.pushState({}, root.document.title, '#' + path);
            } else {
                root.location.replace('#' + path);
            }

            if (trigger !== false) this._dispath(path);
        }
    }, {
        key: '_start',
        value: function _start(defaultPath) {
            if (this._started || !root) return;
            D.Adapter.addEventListener(root, 'hashchange', this._EVENT_HANDLER, false);

            var hash = this._getHash() || defaultPath;
            this._started = true;
            if (hash) this.navigate(hash);
        }
    }, {
        key: '_stop',
        value: function _stop() {
            if (!this._started) return;
            D.Adapter.removeEventListener(root, 'hashchange', this._EVENT_HANDLER);
            this._started = false;
        }
    }, {
        key: '_dispath',
        value: function _dispath(path) {
            if (path === this._previousHash) return;
            this._previousHash = path;

            for (var i = 0; i < this._routes.length; i++) {
                var route = this._routes[i];
                if (route.match(path)) {
                    route.handle(path);
                    return;
                }
            }
        }
    }, {
        key: '_mountRoutes',
        value: function _mountRoutes() {
            var _this47 = this;

            var paths = slice.call(arguments);
            return this.chain(map(paths, function (path) {
                return _this47.app._getLoader(path).loadRouter(path);
            }), function (options) {
                return map(options, function (option, i) {
                    return _this47._addRoute(paths[i], option);
                });
            });
        }
    }, {
        key: '_addRoute',
        value: function _addRoute(path, options) {
            var _this48 = this;

            var routes = options.routes;
            var interceptors = options.interceptors;

            mapObj(D.isFunction(routes) ? routes.apply(this) : routes, function (value, key) {
                var p = (path + key).replace(/^\/|\/$/g, '');
                _this48._routes.unshift(new Route(_this48.app, _this48, p, options[value]));
            });

            mapObj(D.isFunction(interceptors) ? interceptors.apply(this) : interceptors, function (value, key) {
                var p = (path + key).replace(/^\/|\/$/g, '');
                _this48._interceptors[p] = options[value];
            });
        }
    }, {
        key: '_getInterceptors',
        value: function _getInterceptors(path) {
            var result = [],
                items = path.split('/');

            items.pop();
            while (items.length > 0) {
                var key = items.join('/');
                if (this._interceptors[key]) result.unshift(this._interceptors[key]);
                items.pop();
            }

            if (this._interceptors['']) result.unshift(this._interceptors['']);
            return result;
        }
    }, {
        key: '_getHash',
        value: function _getHash() {
            return root.location.hash.slice(1);
        }
    }]);

    return Router;
}(D.Base);
return Drizzle;
}));
