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
    View: {}, Region: {}, Module: {}, Model: {},

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

var counter = 0;

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

var __events = {};
var __createHandler = function __createHandler(region, name, selector) {
    return function (e) {
        var target = e.target;
        var matched = false;
        map(region.getElement().querySelectorAll(selector), function (el) {
            if (el === target || el.contains(target)) {
                matched = el;
            }
        });

        matched && region.trigger(name, e);
    };
};
var __captures = ['blur', 'focus', 'scroll', 'resize'];

D.Adapter = {
    Promise: Promise,

    ajax: function ajax(params) {
        throw new Error('Ajax is not implemented', params);
    },
    ajaxResult: function ajaxResult(args) {
        return args[0];
    },
    getEventTarget: function getEventTarget(e) {
        return e.currentTarget || e.target;
    },
    getFormData: function getFormData(el) {
        throw new Error('getFormData is not implemented', el);
    },
    delegateDomEvent: function delegateDomEvent(region, renderable, name, selector, fn) {
        var event = name + '-' + region.id,
            id = region.id + '-' + renderable.id;
        renderable.listenTo(region, event, fn);
        __events[id] || (__events[id] = {});
        var handler = __events[id][name] = __createHandler(region, event, selector);
        this.addEventListener(region.getElement(), name, handler, __captures.indexOf(name) !== -1);
    },
    undelegateDomEvents: function undelegateDomEvents(region, renderable) {
        var _this = this;

        var id = region.id + '-' + renderable.id;
        renderable.stopListening(region);
        mapObj(__events[id], function (handler, name) {
            _this.removeEventListener(region.getElement(), name, handler);
        });
        delete __events[id];
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
            var _this2 = this;

            return new D.Adapter.Promise(function (resolve, reject) {
                fn.call(_this2.context, resolve, reject);
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
            var _this3 = this;

            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            return this.create(function (resolve, reject) {
                var result = [],
                    thenables = [],
                    indexMap = {};
                map(items, function (item, i) {
                    var value = D.isFunction(item) ? item.apply(_this3.context, args) : item;
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
            var _this4 = this;

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
                    ring.length === 0 ? nextRing([]) : _this4.parallel.apply(_this4, [ring].concat(_toConsumableArray(prev != null ? [prev] : []))).then(nextRing, reject);
                } else {
                    var value = D.isFunction(ring) ? ring.apply(_this4.context, prev != null ? [prev] : []) : ring;
                    value && value.then ? value.then(nextRing, reject) : nextRing(value);
                }
            };

            if (args.length === 0) return this.resolve();

            return this.create(function (resolve, reject) {
                doRing(args, resolve, reject, args.shift(), 0);
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

            listenTo: function listenTo(obj, name, fn) {
                (target._listeners[name] || (target._listeners[name] = [])).push({ fn: fn, obj: obj });
                obj.on(name, fn, target);
            },
            stopListening: function stopListening(obj, name, fn) {
                if (!obj) {
                    mapObj(target._listeners, function (value, key) {
                        return map(value, function (item) {
                            return item.obj.off(key, item.fn);
                        });
                    });
                    target._listeners = {};
                    return;
                }

                if (!name) {
                    mapObj(target._listeners, function (value, key) {
                        return map(value, function (item) {
                            return me.off(key, item);
                        });
                    });
                    target._listeners = {};
                    return;
                }

                var result = [];
                map(target._listeners[name], function (item) {
                    return fn && fn !== item ? result.push(item) : me.off(name, item);
                });
                target._listeners[name] = result;

                if (result.length === 0) delete target._listeners[name];
            },
            on: function on(name, fn, context) {
                target.listenTo(me, name + id, context);
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

        return D.Promise.create(function (resolve, reject) {
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
        this.handlers[name] = { creator: creator, destructor: destructor || EMPTY };
    },
    _create: function _create(renderable, options) {
        var _this5 = this;

        var name = options.name;
        var id = options.id;
        var selector = options.selector;
        var opt = options.options;

        if (!name) renderable.error('Component name can not be null');

        var handler = this._handlers[name] || this._defaultHandler;
        if (!handler) renderable.error('No handler for component:', name);

        var dom = selector ? renderable.$$(selector) : renderable.$(id);
        var uid = id ? id : D.uniqueId('comp');

        return renderable.chain(handler.creator(renderable, dom, opt), function (component) {
            var cid = renderable.id + uid,
                cache = _this5._componentCache[cid],
                obj = { id: cid, handler: handler, index: D.uniqueId(cid), options: opt };

            D.isArray(cache) ? cache.push(obj) : _this5._componentCache[cid] = cache ? [cache, obj] : obj;
            return { id: id, component: component, index: obj.index };
        });
    },
    _destroy: function _destroy(renderable, obj) {
        var _this6 = this;

        var id = renderable.id + obj.id,
            cache = this._componentCache[id];
        var current = cache;

        if (D.isArray(cache)) {
            this._componentCache[id] = [];
            map(cache, function (item) {
                item.index !== obj.index ? _this6._componentCache[id].push(item) : current = item;
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
            var _this7 = this,
                _arguments = arguments;

            mapObj(obj, function (value, key) {
                var old = _this7[key];
                if (!old) {
                    _this7[key] = value;
                    return;
                }

                if (D.isFunction(old)) {
                    _this7[key] = function () {
                        var args = slice.call(_arguments);
                        args.unshift(old);
                        return value.apply(_this7, args);
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

        var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(Renderable).call(this, name, options, {
            app: app,
            module: mod,
            components: {},
            _loader: loader,
            _componentMap: {},
            _events: {}
        }));

        _this8._eventHandlers = _this8._option('handlers');
        _this8._templateEngine = _this8._option('templateEngine') || mod && mod._templateEngine || app._templateEngine;
        app.delegateEvent(_this8);
        return _this8;
    }

    _createClass(Renderable, [{
        key: '_initialize',
        value: function _initialize() {
            var _this9 = this;

            return this.chain([this._templateEngine._load(this), this._initializeEvents()], function (_ref) {
                var _ref2 = _slicedToArray(_ref, 1);

                var template = _ref2[0];
                return _this9._template = template;
            });
        }
    }, {
        key: 'render',
        value: function render(options) {
            return this._render(options, true);
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
            var _this10 = this;

            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var update = arguments[1];

            if (!this.region) this.error('Region is null');

            this.renderOptions = options;
            return this.chain(this._loadedPromise, this._destroyComponents, function () {
                return _this10.trigger('beforeRender');
            }, function () {
                return _this10._option('beforeRender');
            }, this._beforeRender, this._serializeData, function (data) {
                return _this10._renderTemplate(data, update);
            }, this._renderComponents, this._afterRender, function () {
                return _this10._option('afterRender');
            }, function () {
                return _this10.trigger('afterRender');
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
            var _this11 = this;

            if (!this._region) return this.Promise.resolve(this);

            return this.chain(function () {
                return _this11.trigger('beforeClose');
            }, function () {
                return _this11._option('beforeClose');
            }, this._beforeClose, [this._unbindEvents, this.destroyComponents, function () {
                return _this11._region._empty(_this11);
            }], this._afterClose, function () {
                return _this11._option('afterClose');
            }, function () {
                return _this11.trigger('afterClose');
            }, function () {
                return delete _this11._region;
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
            var _this12 = this;

            mapObj(events || this._option('events'), function (value, key) {
                var items = key.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/),
                    result = { key: key };

                if (items.length !== 2) _this12._error('Invalid event key');
                result.eventType = items[0];
                if (items[1].slice(-1) === '*') {
                    result.id = _this12._wrapDomId(items[1].slice(0, -1));
                    result.haveStar = true;
                    result.selector = '[id^=' + result.id + ']';
                } else {
                    result.id = _this12._wrapDomId(items[1]);
                    result.selector = '#' + result.id;
                }
                result.handler = _this12._createEventHandler(value, result);
                _this12._events[key] = result;
            });
        }
    }, {
        key: '_createEventHandler',
        value: function _createEventHandler(handlerName, _ref3) {
            var _this13 = this;

            var haveStar = _ref3.haveStar;
            var id = _ref3.id;
            var disabledClass = this.app.options.disabledClass;

            return function (event) {
                if (!_this13._eventHandlers[handlerName]) _this13._error('No event handler for name:', handlerName);

                var target = D.Adapter.getEventTarget(event),
                    args = [event];
                if (D.Adapter.hasClass(target, disabledClass)) return;
                if (haveStar) args.unshift(target.getAttribute('id').slice(id.length));
                _this13._eventHandlers[handlerName].apply(_this13, args);
            };
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this14 = this;

            mapObj(this._events, function (value) {
                _this14._region._delegateDomEvent(_this14, value.eventType, value.selector, value.handler);
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
            var _this15 = this;

            this.chain(map(this._option('components'), function (item) {
                var i = D.isFunction(item) ? item.call(_this15) : item;
                return i ? D.ComponentManager.create(_this15, i) : null;
            }), function (components) {
                return map(components, function (item) {
                    if (!item) return;
                    var id = item.id;
                    var component = item.component;
                    var index = item.index;var value = _this15.components[id];
                    D.isArray(value) ? value.push(component) : _this15.components[id] = value ? [value, component] : component;
                    _this15._componentMap[index] = item;
                });
            });
        }
    }, {
        key: '_destroyComponents',
        value: function _destroyComponents() {
            var _this16 = this;

            this.components = {};
            mapObj(this._componentMap, function (value) {
                return D.ComponentManager.destroy(_this16, value);
            });
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
            return this._region ? this._region.getElement(this) : null;
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
            var _this18 = this;

            this.chain(mapObj(this._option('items'), function () {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                var name = arguments[1];

                var opt = D.isFunction(options) ? options.call(_this18) : options;
                if (D.isString(opt)) opt = { region: opt };

                return _this18.app[options.isModule ? '_createModule' : '_createView'](name, parent).then(function (item) {
                    var i = item;
                    i.moduleOptions = options;
                    _this18._items[name] = item;
                    return item;
                });
            }));
        }
    }, {
        key: '_initializeRegions',
        value: function _initializeRegions() {
            var _this19 = this;

            this._regions = {};
            return this.chain(this.closeRegions, map(this.$$('[data-region]'), function (el) {
                var region = _this19._createRegion(el);
                _this19._regions[region.name] = region;
            }));
        }
    }, {
        key: '_renderItems',
        value: function _renderItems() {
            var _this20 = this;

            return this.chain(mapObj(this.items, function (item) {
                var region = item.moduleOptions.region;

                if (!region) return;
                if (!_this20.regions[region]) _this20.error('Region: ' + region + ' is not defined');
                _this20.regions[region].show(item);
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
            _get(Object.getPrototypeOf(ActionCreator.prototype), '_initializeEvents', this).call(this, this._actions);
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
            var _this22 = this;

            var disabledClass = this.app.options.disabledClass;

            var _ref4 = this._option('dataForActions') || {};

            var dataForAction = _ref4[name];

            var _ref5 = this._option('actionCallbacks') || {};

            var actionCallback = _ref5[name];

            return function (e) {
                var target = D.Adapter.getEventTarget(event);
                if (D.Adapter.hasClass(target, disabledClass)) return;
                D.Adapter.addClass(target, disabledClass);

                var data = _this22._getActionPayload(target);
                _this22.chain(D.isFunction(dataForAction) ? dataForAction.call(_this22, data, e) : data, function (payload) {
                    return payload !== false ? _this22.module.dispatch(name, payload) : false;
                }, function (result) {
                    return result !== false ? actionCallback && actionCallback.call(_this22, result) : false;
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
            var _this24 = this;

            this._dataBinding = {};
            mapObj(this._option('bindings'), function (value, key) {
                var model = _this24.bindings[key] = _this24.module.store[key];
                if (!model) _this24._error('No model:', key);

                if (!value) return;
                _this24._dataBinding[key] = { model: model, value: value, fn: function fn() {
                        if (value === true && _this24._region) _this24.render(_this24.renderOptions);
                        if (D.isString(value)) _this24._option(value);
                    } };
            });
        }
    }, {
        key: '_bindData',
        value: function _bindData() {
            var _this25 = this;

            mapObj(this._dataBinding, function (value) {
                return _this25.listenTo(value.model, 'change', value.fn);
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

            for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                args[_key11] = arguments[_key11];
            }

            (_get2 = _get(Object.getPrototypeOf(View.prototype), '_setRegion', this)).call.apply(_get2, [this].concat(args));
            this._bindData();
        }
    }, {
        key: '_close',
        value: function _close() {
            var _get3;

            for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                args[_key12] = arguments[_key12];
            }

            this.chain((_get3 = _get(Object.getPrototypeOf(View.prototype), '_close', this)).call.apply(_get3, [this].concat(args)), this._unbindData, this);
        }
    }, {
        key: '_serializeData',
        value: function _serializeData() {
            var _this26 = this;

            var data = _get(Object.getPrototypeOf(View.prototype), '_serializeData', this).call(this);
            mapObj(this.bindings, function (value, key) {
                return data[key] = value.get(true);
            });
            mapObj(this._option('dataForTemplate'), function (value, key) {
                return data[key] = value.call(_this26, data);
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
            return _get(Object.getPrototypeOf(Module.prototype), '_initialize', this).call(this);
        }
    }, {
        key: 'dispatch',
        value: function dispatch(name, payload) {
            this._store.dispatch(name, payload);
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
            var _this28 = this;

            return this.chain(_get(Object.getPrototypeOf(Module.prototype), '_beforeRender', this).call(this), function () {
                return _this28._store._loadEagerModels();
            });
        }
    }, {
        key: '_afterRender',
        value: function _afterRender() {
            var _this29 = this;

            return this.chain(_get(Object.getPrototypeOf(Module.prototype), '_afterRender', this).call(this), function () {
                return _this29._store._loadLazyModels();
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

D.Region = function (_D$Base2) {
    _inherits(Region, _D$Base2);

    function Region(mod, el, name) {
        _classCallCheck(this, Region);

        var _this30 = _possibleConstructorReturn(this, Object.getPrototypeOf(Region).call(this, name || 'Region', {
            app: mod.app,
            _el: el,
            module: mod
        }));

        if (!_this30._el) _this30.error('The DOM element for region is required');
        return _this30;
    }

    _createClass(Region, [{
        key: 'show',
        value: function show(renderable) {
            var _this31 = this;

            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (this._isCurrent(renderable)) {
                if (renderable.forceRender === false) return this.Promise.resolve(this._current);
                return this._current._render(options, true);
            }

            return this.chain(D.isString(renderable) ? this.app._createModule(renderable) : renderable, function (item) {
                if (!(item instanceof D.Renderable)) _this31.error('The item is expected to be an instance of Renderable');
                return item;
            }, [function (item) {
                return _this31.chain(item._region && item._region.close(), item);
            }, function () {
                return _this31.close();
            }], function (_ref6) {
                var _ref7 = _slicedToArray(_ref6, 1);

                var item = _ref7[0];

                _this31._current = item;
                var attr = item.module ? item.module.name + ':' + item.name : item.name;
                _this31._getElement().setAttribute('data-current', attr);
                return item._setRegion(_this31);
            }, function (item) {
                return item._render(options, false);
            });
        }
    }, {
        key: 'close',
        value: function close() {
            var _this32 = this;

            return this.chain(this._current && this._current.close(), function () {
                return delete _this32._current;
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
        key: '_delegateDomEvent',
        value: function _delegateDomEvent(renderable, name, selector, fn) {
            D.Adapter.delegateDomEvent(this, renderable, name, selector, fn);
        }
    }, {
        key: '_undelegateDomEvents',
        value: function _undelegateDomEvents(renderable) {
            D.Adapter.undelegateDomEvents(this, renderable);
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
        key: '_load',
        value: function _load(renderable) {
            var id = renderable.id;
            if (this._templateCache[id]) return this._templateCache[id];
            return this._templateCache[id] = this._option('load', renderable);
        }
    }, {
        key: '_execute',
        value: function _execute(renderable, data, template) {
            return this._option('execute', renderable, data, renderable._element, template);
        }
    }]);

    return TemplateEngine;
}(D.Base);

D.Store = function (_D$Base4) {
    _inherits(Store, _D$Base4);

    function Store(mod, options) {
        _classCallCheck(this, Store);

        var _this34 = _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this, 'Store', options, {
            app: mod.app,
            module: mod,
            _models: {}
        }));

        _this34._callbacks = _this34._option('callbacks');
        _this34.app.delegateEvent(_this34);
        return _this34;
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
            if (!callback) this.error('No action callback for name: ' + name);
            return this.chain(callback.call(this._callbackContext, p));
        }
    }, {
        key: '_initialize',
        value: function _initialize() {
            var _this35 = this;

            this._initializeModels();
            this._callbackContext = Object.assign({
                models: this.models,
                module: this.module,
                app: this.app
            }, D.Request);

            mapObj(this._callbacks, function (value, key) {
                if (key.slice(0, 4) !== 'app.') return;
                _this35.listenTo(_this35.app, key, function (payload) {
                    return value.call(_this35._callbackContext, payload);
                });
            });
        }
    }, {
        key: '_initializeModels',
        value: function _initializeModels() {
            var _this36 = this;

            mapObj(this._option('models'), function (value, key) {
                var v = (D.isFunction(value) ? value.call(_this36) : v) || {};
                if (v.shared === true) {
                    _this36._models[key] = _this36.app.viewport.store[key];
                    return;
                }
                _this36._models[key] = _this36.app._createModel(_this36, v);
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

        var _this37 = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this, 'Model', options, {
            app: store.module.app,
            module: store.module,
            store: store
        }));

        _this37._data = _this37._option('data') || {};
        _this37._idKey = _this37._option('idKey') || _this37.app.options.idKey;
        _this37._params = Object.assign({}, _this37._option('params'));
        _this37.app.delegateEvent(_this37);
        return _this37;
    }

    _createClass(Model, [{
        key: 'set',
        value: function set(data, trigger) {
            var d = this._option('parse', data);
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
            var _this39 = this;

            var _app$options = this.app.options;
            var scriptRoot = _app$options.scriptRoot;
            var getResource = _app$options.getResource;
            var amd = _app$options.amd;
            var fullPath = scriptRoot + '/' + path;

            return this.Promise.create(function (resolve, reject) {
                if (amd) {
                    require([fullPath], function (obj) {
                        return resolve(obj);
                    }, function (e) {
                        return reject(e);
                    });
                } else if (getResource) {
                    resolve(getResource.call(_this39.app, fullPath));
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
            return this.loadResource(path + '/' + this.app.options.fileNames.router);
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
            defaultRegion: root.document.body,
            disabledClass: 'disabled',
            attributesReferToId: ['for', 'data-target', 'data-parent'],
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
            this._templateEngine = this._option('templateEngine');
            this.registerLoader('default', new D.Loader(), true);
            this._region = this._createRegion(this._option('defaultRegion'), 'Region');
        }
    }, {
        key: 'registerLoader',
        value: function registerLoader(name, loader, isDefault) {
            this.loaders[name] = loader;
            if (isDefault) this._defaultLoader = loader;
            return this;
        }
    }, {
        key: 'start',
        value: function start(defaultHash) {
            var _this41 = this;

            if (defaultHash) this._router = new D.Router(this);

            return this.chain(defaultHash ? this._router._mountRoutes(this._option('routers')) : false, this._region.show(this._option('viewport')), function (viewport) {
                return _this41.viewport = viewport;
            }, function () {
                return defaultHash && _this41._router._start(defaultHash);
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
            this.viewport.regions[region].show(moduleName, options);
        }
    }, {
        key: '_getLoader',
        value: function _getLoader(name, mod) {
            return name && this._loaders[name] || mod && mod._loader || this._defaultLoader;
        }
    }, {
        key: '_createModule',
        value: function _createModule(name, parent) {
            var _this42 = this;

            var _D$Loader$_analyse = D.Loader._analyse(name);

            var moduleName = _D$Loader$_analyse.name;
            var loaderName = _D$Loader$_analyse.loader;
            var loader = this._getLoader(loaderName, parent);

            return this.chain(loader.loadModule(moduleName), function () {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                return typeCache.createModule(options.type, moduleName, _this42, parent, loader, options);
            });
        }
    }, {
        key: '_createView',
        value: function _createView(name, mod) {
            var _this43 = this;

            var _D$Loader$_analyse2 = D.Loader._analyse(name);

            var viewName = _D$Loader$_analyse2.name;
            var loaderName = _D$Loader$_analyse2.loader;
            var loader = this._getLoader(loaderName, mod);

            return this.chain(loader.loadView(viewName, mod), function () {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                return typeCache.createView(options.type, viewName, _this43, mod, loader, options);
            });
        }
    }, {
        key: '_createRegion',
        value: function _createRegion(el, name, mod) {
            var _D$Loader$_analyse3 = D.Loader._analyse(name);

            var regionName = _D$Loader$_analyse3.name;
            var type = _D$Loader$_analyse3.loader;

            return typeCache.createRegion(type, mod, el, regionName);
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

var PUSH_STATE_SUPPORTED = root.history && 'pushState' in root.history;
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
            var _router,
                _this44 = this;

            this.pattern.lastIndex = 0;
            var args = this.pattern.exec(hash).slice(1),
                handlers = this.router._getInterceptors(this.path);

            handlers.push(this.fn);
            return (_router = this.router).chain.apply(_router, _toConsumableArray(map(handlers, function (fn, i) {
                return function (prev) {
                    return fn.apply(_this44.router, i > 0 ? [prev].concat(args) : args);
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

        var _this45 = _possibleConstructorReturn(this, Object.getPrototypeOf(Router).call(this, 'Router', {}, {
            app: app,
            _routes: [],
            _interceptors: {},
            _started: false
        }));

        _this45._EVENT_HANDLER = function () {
            return _this45._dispath(_this45._getHash());
        };
        return _this45;
    }

    _createClass(Router, [{
        key: 'navigate',
        value: function navigate(path, trigger) {
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
            if (this._started) return;
            D.Adapter.addEventListener(root, 'hashchange', this._EVENT_HANDLER, false);

            var hash = this._getHash() || defaultPath;
            if (hash) this.navigate(hash);
            this._started = true;
        }
    }, {
        key: '_stop',
        value: function _stop() {
            D.Adapter.removeEventListener(root, 'hashchange', this._EVENT_HANDLER);
            this._started = false;
        }
    }, {
        key: '_dispath',
        value: function _dispath(path) {
            if (path === this._previousHash) return;
            this._previousHash = path;

            for (var i = 0; i < this.routes.length; i++) {
                var route = this.routes[i];
                if (route.match(path)) {
                    route.handle(path);
                    return;
                }
            }
        }
    }, {
        key: '_mountRoutes',
        value: function _mountRoutes() {
            var _this46 = this;

            var paths = slice.call(arguments);
            return this.chain(map(paths, function (path) {
                return _this46.app._getLoader(path).loadRouter(path);
            }), function (options) {
                return map(options, function (option, i) {
                    return _this46._addRoute(paths[i], option);
                });
            });
        }
    }, {
        key: '_addRoute',
        value: function _addRoute(path, options) {
            var _this47 = this;

            var routes = options.routes;
            var interceptors = options.interceptors;

            mapObj(D.isFunction(routes) ? routes.apply(this) : routes, function (value, key) {
                var p = (path + key).replace(/^\/|\/$/g, '');
                _this47._routes.unshift(new Route(_this47.app, _this47, p, options[value]));
            });

            mapObj(D.isFunction(interceptors) ? interceptors.apply(this) : interceptors, function (value, key) {
                var p = (path + key).replace(/^\/|\/$/g, '');
                _this47._interceptors[p] = options[value];
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

            if (this.interceptors['']) result.unshift(this.interceptors['']);
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
