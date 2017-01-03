/*!
 * DrizzleJS v0.4.15
 * -------------------------------------
 * Copyright (c) 2017 Jaco Koo <jaco.koo@guyong.in>
 * Distributed under MIT license
 */

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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Drizzle = {},
    D = Drizzle,
    slice = [].slice,
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
    var key = void 0;
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
                return result[key] = clone(value);
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
    assign = function assign(target) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var t = target;
    t && map(args, function (arg) {
        return arg && mapObj(arg, function (value, key) {
            return t[key] = value;
        });
    });
    return t;
},
    extend = function extend(theChild, theParent, obj) {
    var child = theChild;
    assign(child, theParent);

    function Class() {
        this.constructor = theChild;
    }
    Class.prototype = theParent.prototype;
    child.prototype = new Class();
    assign(child.prototype, obj);
    child.__super__ = theParent.prototype;

    return child;
},
    typeCache = {
    View: {}, Region: {}, Module: {}, Model: {}, Store: {},

    register: function register(type, name, clazz) {
        this[type][name] = clazz;
    },
    create: function create(type, name) {
        var Clazz = this[type][name] || D[type];

        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
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
    var name = '[object ' + item + ']';
    D['is' + item] = function (obj) {
        return D.toString.call(obj) === name;
    };
});

map(['Module', 'View', 'Region', 'Model', 'Store'], function (item) {
    D['register' + item] = function (name, clazz) {
        return typeCache.register(item, name, clazz);
    };
    typeCache['create' + item] = function (name) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
        }

        return typeCache.create.apply(typeCache, [item, name].concat(args));
    };
});

assign(D, {
    assign: assign,

    uniqueId: function uniqueId() {
        var prefix = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        return '' + prefix + ++counter;
    },
    adapt: function adapt(obj) {
        assign(D.Adapter, obj);
    },


    extend: extend
});

D.Adapter = {
    Promise: Promise,

    ajax: function ajax(params) {
        var xhr = new XMLHttpRequest();
        var data = '';
        if (params.data) data = mapObj(params.data, function (v, k) {
            return k + '=' + encodeURIComponent(v);
        }).join('&');
        xhr.open(params.type, data && params.type === 'GET' ? params.url + '?' + data : params.url, true);
        var promise = new Promise(function (resolve, reject) {
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    resolve(JSON.parse(this.response));
                    return;
                }
                reject(xhr);
            };

            xhr.onerror = function () {
                reject(xhr);
            };
        });
        if (data) xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        params.beforeRequest && params.beforeRequest(xhr);
        xhr.send(data);
        return promise;
    },
    exportError: function exportError() {},
    ajaxResult: function ajaxResult(args) {
        return args[0];
    },
    getFormData: function getFormData(el) {
        throw new Error('getFormData is not implemented', el);
    },
    eventPrevented: function eventPrevented(e) {
        return e.defaultPrevented;
    },
    addEventListener: function addEventListener(el, name, handler, useCapture) {
        el.addEventListener(name, handler, useCapture);
    },
    removeEventListener: function removeEventListener(el, name, handler) {
        el.removeEventListener(name, handler);
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

D.Promise = function Promiser(context) {
    this.context = context;
};

D.assign(D.Promise.prototype, {
    create: function create(fn) {
        var _this = this;

        return new D.Adapter.Promise(function (resolve, reject) {
            fn.call(_this.context, resolve, reject);
        });
    },
    resolve: function resolve(data) {
        return D.Adapter.Promise.resolve(data);
    },
    reject: function reject(data) {
        return D.Adapter.Promise.reject(data);
    },
    parallel: function parallel(items) {
        var _this2 = this;

        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
        }

        return this.create(function (resolve, reject) {
            var result = [],
                thenables = [],
                indexMap = {};
            map(items, function (item, i) {
                var value = void 0;
                try {
                    value = D.isFunction(item) ? item.apply(_this2.context, args) : item;
                } catch (e) {
                    D.Adapter.exportError(e);
                    reject(e);
                    return;
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
    },
    chain: function chain() {
        var _this3 = this;

        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
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
                var value = void 0;
                try {
                    value = D.isFunction(ring) ? ring.apply(_this3.context, prev != null ? [prev] : []) : ring;
                } catch (e) {
                    D.Adapter.exportError(e);
                    reject(e);
                    return;
                }

                value && value.then ? value.then(nextRing, reject) : nextRing(value);
            }
        };

        if (args.length === 0) return this.resolve();

        return this.create(function (resolve, reject) {
            doRing(args, args.shift(), resolve, reject);
        });
    }
});

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
        for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            args[_key6 - 1] = arguments[_key6];
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

        assign(target, {
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

                for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                    args[_key7 - 1] = arguments[_key7];
                }

                args.unshift(name + id) && me.trigger.apply(me, args);
            }
        });
        return this;
    }
};

D.Request = {
    get: function get(model, options) {
        return this._ajax('GET', model, model.getParams(), options);
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
        urlSuffix && parts.push(parts.pop() + urlSuffix);

        return parts.join('/');
    },
    _ajax: function _ajax(method, model, data, options) {
        var params = assign({ type: method }, options);

        params.data = assign({}, data, params.data);
        params.url = this._url(model);

        return model.Promise.create(function (resolve, reject) {
            D.Adapter.ajax(params, model).then(function () {
                for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                    args[_key8] = arguments[_key8];
                }

                model.set(D.Adapter.ajaxResult(args), !params.slient);
                resolve(args);
            }, function () {
                for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                    args[_key9] = arguments[_key9];
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
        var destructor = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

        this._defaultHandler = { creator: creator, destructor: destructor };
    },
    register: function register(name, creator) {
        var destructor = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

        this._handlers[name] = { creator: creator, destructor: destructor };
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

        return renderable.chain(handler.creator(renderable, dom, opt, name), function (component) {
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

D.Base = function Base(name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var defaults = arguments[2];

    this.options = options;
    this.id = D.uniqueId('D');
    this.name = name;
    this.Promise = new D.Promise(this);

    assign(this, defaults);
    if (options.mixin) this._mixin(options.mixin);
    this._loadedPromise = this._initialize();
};

D.assign(D.Base.prototype, {
    _initialize: function _initialize() {},
    _option: function _option(key) {
        var value = this.options[key];

        for (var _len10 = arguments.length, args = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
            args[_key10 - 1] = arguments[_key10];
        }

        return D.isFunction(value) ? value.apply(this, args) : value;
    },
    _error: function _error(message) {
        if (!D.isString(message)) throw message;

        for (var _len11 = arguments.length, rest = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
            rest[_key11 - 1] = arguments[_key11];
        }

        throw new Error('[' + (this.module ? this.module.name + ':' : '') + this.name + '] ' + message + ' ' + rest.join(' '));
    },
    _mixin: function _mixin(obj) {
        var _this6 = this;

        mapObj(obj, function (value, key) {
            var old = _this6[key];
            if (!old) {
                _this6[key] = value;
                return;
            }

            if (D.isFunction(old)) {
                _this6[key] = function () {
                    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                        args[_key12] = arguments[_key12];
                    }

                    args.unshift(old);
                    return value.apply(_this6, args);
                };
            }
        });
    },
    chain: function chain() {
        var _Promise;

        return (_Promise = this.Promise).chain.apply(_Promise, arguments);
    }
});

D.Renderable = function Renderable(name, app, mod, loader, options) {
    var moduleOptions = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

    D.Renderable.__super__.constructor.call(this, name, options, {
        app: app,
        moduleOptions: moduleOptions,
        module: mod,
        components: {},
        _loader: loader,
        _componentMap: {},
        _events: {}
    });
    this._eventHandlers = this._option('handlers');
    app.delegateEvent(this);
};

extend(D.Renderable, D.Base, {
    _initialize: function _initialize() {
        var _this7 = this;

        this._templateEngine = this._option('templateEngine') || this.module && this.module._templateEngine || this.app._templateEngine;
        return this.chain([this._templateEngine._load(this), this._initializeEvents()], function (_ref) {
            var _ref2 = _slicedToArray(_ref, 1);

            var template = _ref2[0];
            return _this7._template = template;
        });
    },
    render: function render(options) {
        return this._render(options == null ? this.renderOptions : options, true);
    },
    $: function $(id) {
        return this.$$('#' + this._wrapDomId(id))[0];
    },
    $$: function $$(selector) {
        return this._getElement().querySelectorAll(selector);
    },
    _render: function _render(options, update) {
        var _this8 = this;

        if (!this._region) this._error('Region is null');

        this.renderOptions = options == null ? this.renderOptions || {} : options;
        return this.chain(this._loadedPromise, this._destroyComponents, function () {
            return _this8.trigger('beforeRender');
        }, function () {
            return _this8._option('beforeRender');
        }, this._beforeRender, this._serializeData, function (data) {
            return _this8._renderTemplate(data, update);
        }, this._renderComponents, this._afterRender, function () {
            return _this8._option('afterRender');
        }, function () {
            return _this8.trigger('afterRender');
        }, this);
    },
    _setRegion: function _setRegion(region) {
        this._region = region;
        this._bindEvents();
    },
    _close: function _close() {
        var _this9 = this;

        if (!this._region) return this.Promise.resolve(this);

        return this.chain(function () {
            return _this9.trigger('beforeClose');
        }, function () {
            return _this9._option('beforeClose');
        }, this._beforeClose, [this._unbindEvents, this._destroyComponents, function () {
            return _this9._region._empty(_this9);
        }], this._afterClose, function () {
            return _this9._option('afterClose');
        }, function () {
            return _this9.trigger('afterClose');
        }, function () {
            return delete _this9._region;
        }, this);
    },
    _getElement: function _getElement() {
        return this._region ? this._region._getElement(this) : null;
    },
    _serializeData: function _serializeData() {
        return {
            Global: this.app.global,
            Self: this
        };
    },
    _renderTemplate: function _renderTemplate(data, update) {
        this._templateEngine._execute(this, data, this._template, update);
    },
    _initializeEvents: function _initializeEvents(events) {
        var _this10 = this;

        mapObj(events || this._option('events'), function (value, key) {
            var items = key.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/),
                result = { key: key };

            if (items.length !== 2) _this10._error('Invalid event key');
            result.eventType = items[0];
            if (items[1].slice(-1) === '*') {
                result.id = _this10._wrapDomId(items[1].slice(0, -1));
                result.haveStar = true;
                result.selector = '[id^=' + result.id + ']';
            } else {
                result.id = _this10._wrapDomId(items[1]);
                result.selector = '#' + result.id;
            }
            result.handler = _this10._createEventHandler(value, result);
            _this10._events[key] = result;
        });
    },
    _getEventTarget: function _getEventTarget(target, id) {
        var el = this._getElement();
        var current = target;
        while (current !== el) {
            var cid = current.getAttribute('id');
            if (cid && cid.slice(0, id.length) === id) return current;
            current = current.parentNode;
        }
    },
    _createEventHandler: function _createEventHandler(handlerName, _ref3) {
        var _this11 = this;

        var haveStar = _ref3.haveStar;
        var id = _ref3.id;
        var disabledClass = this.app.options.disabledClass;

        return function () {
            for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                args[_key13] = arguments[_key13];
            }

            if (!_this11._eventHandlers[handlerName]) _this11._error('No event handler for name:', handlerName);

            var e = args[0];
            var target = _this11._getEventTarget(e.target, id);
            if (D.Adapter.hasClass(target, disabledClass)) return;
            if (haveStar) args.unshift(target.getAttribute('id').slice(id.length));
            _this11._eventHandlers[handlerName].apply(_this11, args);
        };
    },
    _bindEvents: function _bindEvents() {
        var _this12 = this;

        mapObj(this._events, function (value) {
            _this12._region._delegateDomEvent(_this12, value.eventType, value.selector, value.handler);
        });
    },
    _unbindEvents: function _unbindEvents() {
        this._region._undelegateDomEvents(this);
    },
    _renderComponents: function _renderComponents() {
        var _this13 = this;

        return this.chain(map(this._option('components'), function (item) {
            var i = D.isFunction(item) ? item.call(_this13) : item;
            return i ? D.ComponentManager._create(_this13, i) : null;
        }), function (components) {
            return map(components, function (item) {
                if (!item) return;
                var id = item.id;
                var component = item.component;
                var index = item.index;var value = _this13.components[id];
                D.isArray(value) ? value.push(component) : _this13.components[id] = value ? [value, component] : component;
                _this13._componentMap[index] = item;
            });
        });
    },
    _destroyComponents: function _destroyComponents() {
        var _this14 = this;

        this.components = {};
        mapObj(this._componentMap, function (value) {
            return D.ComponentManager._destroy(_this14, value);
        });
        this._componentMap = {};
    },
    _wrapDomId: function _wrapDomId(id) {
        return this.id + id;
    },
    _beforeRender: function _beforeRender() {},
    _afterRender: function _afterRender() {},
    _beforeClose: function _beforeClose() {},
    _afterClose: function _afterClose() {}
});

D.RenderableContainer = function RenderableContainer() {
    D.RenderableContainer.__super__.constructor.apply(this, arguments);
};

extend(D.RenderableContainer, D.Renderable, {
    _initialize: function _initialize() {
        var promise = D.RenderableContainer.__super__._initialize.call(this);

        this.items = {};
        return this.chain(promise, this._initializeItems);
    },
    _afterRender: function _afterRender() {
        return this.chain(this._initializeRegions, this._renderItems);
    },
    _afterClose: function _afterClose() {
        return this._closeRegions();
    },
    _initializeItems: function _initializeItems() {
        var _this15 = this;

        this.chain(mapObj(this._option('items'), function () {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var name = arguments[1];

            var opt = D.isFunction(options) ? options.call(_this15) : options;
            if (D.isString(opt)) opt = { region: opt };

            return _this15.app[options.isModule ? '_createModule' : '_createView'](name, _this15, opt).then(function (item) {
                _this15.items[name] = item;
                return item;
            });
        }));
    },
    _initializeRegions: function _initializeRegions() {
        var _this16 = this;

        this.regions = {};
        return this.chain(this._closeRegions, function () {
            map(_this16.$$('[data-region]'), function (el) {
                var region = _this16._createRegion(el);
                _this16.regions[region.name] = region;
            });
        });
    },
    _renderItems: function _renderItems() {
        var _this17 = this;

        return this.chain(mapObj(this.items, function (item) {
            var region = item.moduleOptions.region;

            if (!region) return null;
            if (!_this17.regions[region]) _this17._error('Region: ' + region + ' is not defined');
            return _this17.regions[region].show(item);
        }), this);
    },
    _createRegion: function _createRegion(el) {
        var name = el.getAttribute('data-region');
        return this.app._createRegion(el, name, this);
    },
    _closeRegions: function _closeRegions() {
        var regions = this.regions;
        if (!regions) return this;
        this.regions = {};
        return this.chain(mapObj(regions, function (region) {
            return region.close();
        }), this);
    }
});

D.ActionCreator = function ActionCreator() {
    D.ActionCreator.__super__.constructor.apply(this, arguments);
};

D.extend(D.ActionCreator, D.Renderable, {
    _initializeEvents: function _initializeEvents() {
        var su = D.ActionCreator.__super__._initializeEvents;
        su.call(this);
        su.call(this, this._option('actions'));
    },
    _createEventHandler: function _createEventHandler(name, obj) {
        var su = D.ActionCreator.__super__._createEventHandler;
        var isAction = !!(this._option('actions') || {})[obj.key];
        return isAction ? this._createAction(name, obj) : su.call(this, name, obj);
    },
    _createAction: function _createAction(name, _ref4) {
        var _this18 = this;

        var id = _ref4.id;
        var disabledClass = this.app.options.disabledClass;

        var _ref5 = this._option('dataForActions') || {};

        var dataForAction = _ref5[name];

        var _ref6 = this._option('actionCallbacks') || {};

        var actionCallback = _ref6[name];


        return function (e) {
            var target = _this18._getEventTarget(e.target, id);
            if (D.Adapter.hasClass(target, disabledClass)) return;
            D.Adapter.addClass(target, disabledClass);

            var data = _this18._getActionPayload(target);
            _this18.chain(D.isFunction(dataForAction) ? dataForAction.call(_this18, data, e) : data, function (payload) {
                return payload !== false ? _this18.module.dispatch(name, payload) : false;
            }, function (result) {
                return result !== false ? actionCallback && actionCallback.call(_this18, result) : false;
            }).then(function () {
                return D.Adapter.removeClass(target, disabledClass);
            }, function () {
                return D.Adapter.removeClass(target, disabledClass);
            });
        };
    },
    _getActionPayload: function _getActionPayload(target) {
        var rootEl = this._getElement();
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
});

D.View = function View() {
    D.View.__super__.constructor.apply(this, arguments);
};

extend(D.View, D.ActionCreator, {
    _initialize: function _initialize() {
        this.bindings = {};
        return this.chain(D.View.__super__._initialize.call(this), this._initializeDataBinding);
    },
    _initializeDataBinding: function _initializeDataBinding() {
        var _this19 = this;

        this._dataBinding = {};
        mapObj(this._option('bindings'), function (value, key) {
            var model = _this19.bindings[key] = _this19.module.store.models[key];
            if (!model) _this19._error('No model:', key);

            if (!value) return;
            _this19._dataBinding[key] = { model: model, value: value, fn: function fn() {
                    if (value === true && _this19._region) _this19.render(_this19.renderOptions);
                    if (D.isString(value)) _this19._option(value);
                } };
        });
    },
    _bindData: function _bindData() {
        var _this20 = this;

        mapObj(this._dataBinding, function (value) {
            return _this20.listenTo(value.model, 'changed', value.fn);
        });
    },
    _unbindData: function _unbindData() {
        this.stopListening();
    },
    _setRegion: function _setRegion() {
        for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
            args[_key14] = arguments[_key14];
        }

        D.View.__super__._setRegion.apply(this, args);
        this._bindData();
    },
    _close: function _close() {
        for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
            args[_key15] = arguments[_key15];
        }

        this.chain(D.View.__super__._close.apply(this, args), this._unbindData, this);
    },
    _serializeData: function _serializeData() {
        var _this21 = this;

        var data = D.View.__super__._serializeData.call(this);
        mapObj(this.bindings, function (value, key) {
            return data[key] = value.get(true);
        });
        mapObj(this._option('dataForTemplate'), function (value, key) {
            return data[key] = value.call(_this21, data);
        });
        return data;
    }
});

D.Module = function Module() {
    D.Module.__super__.constructor.apply(this, arguments);
};

D.extend(D.Module, D.RenderableContainer, {
    _initialize: function _initialize() {
        this._initializeStore();
        return D.Module.__super__._initialize.call(this);
    },
    dispatch: function dispatch(name, payload) {
        return this.store.dispatch(name, payload);
    },
    _initializeStore: function _initializeStore() {
        this.store = this.app._createStore(this, this._option('store'));
    },
    _afterClose: function _afterClose() {
        delete this.app._modules[this.name + '--' + this.id];
        this.store._destory();
        return D.Module.__super__._afterClose.call(this);
    },
    _beforeRender: function _beforeRender() {
        var _this22 = this;

        this.app._modules[this.name + '--' + this.id] = this;
        return this.chain(D.Module.__super__._beforeRender.call(this), function () {
            return _this22.store._loadEagerModels();
        });
    },
    _afterRender: function _afterRender() {
        var _this23 = this;

        return this.chain(D.Module.__super__._afterRender.call(this), function () {
            return _this23.store._loadLazyModels();
        });
    }
});

var CAPTURES = ['blur', 'focus', 'scroll', 'resize'];

D.Region = function Region(app, mod, el, name) {
    D.Region.__super__.constructor.call(this, name || 'Region', {}, {
        app: app,
        module: mod,
        _el: el,
        _delegated: {}
    });

    if (!this._el) this._error('The DOM element for region is required');
    app.delegateEvent(this);
};

extend(D.Region, D.Base, {
    show: function show(renderable, options) {
        var _this24 = this;

        if (this._isCurrent(renderable)) {
            if (options && options.forceRender === false) return this.Promise.resolve(this._current);
            return this._current._render(options, true);
        }

        return this.chain(D.isString(renderable) ? this.app._createModule(renderable) : renderable, function (item) {
            if (!(item instanceof D.Renderable)) {
                _this24._error('The item is expected to be an instance of Renderable');
            }
            return item;
        }, [function (item) {
            return _this24.chain(item._region && item._region.close(), item);
        }, function () {
            return _this24._current && _this24.close();
        }], function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 1);

            var item = _ref8[0];

            _this24._current = item;
            var attr = item.module ? item.module.name + ':' + item.name : item.name;
            _this24._getElement().setAttribute('data-current', attr);
            item._setRegion(_this24);
            return item;
        }, function (item) {
            return item._render(options, false);
        });
    },
    close: function close() {
        var _this25 = this;

        return this.chain(this._current && this._current._close(), function () {
            return delete _this25._current;
        }, this);
    },
    $$: function $$(selector) {
        return this._getElement().querySelectorAll(selector);
    },
    _isCurrent: function _isCurrent(renderable) {
        if (!this._current) return false;
        if (this._current.name === renderable) return true;
        if (renderable && renderable.id === this._current.id) return true;
        return false;
    },
    _getElement: function _getElement() {
        return this._el;
    },
    _empty: function _empty() {
        this._getElement().innerHTML = '';
    },
    _createDelegateListener: function _createDelegateListener(name) {
        var _this26 = this;

        return function () {
            for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
                args[_key16] = arguments[_key16];
            }

            if (!_this26._delegated[name]) return;
            var e = args[0];
            var target = e.target;

            map(_this26._delegated[name].items, function (item) {
                if (D.Adapter.eventPrevented(e)) return;
                var els = _this26._getElement().querySelectorAll(item.selector);
                var matched = false;
                for (var i = 0; i < els.length; i++) {
                    var el = els[i];
                    if (el === target || el.contains(target)) {
                        matched = el;
                        break;
                    }
                }
                matched && item.fn.apply(item.renderable, args.concat([matched]));
            });
        };
    },
    _delegateDomEvent: function _delegateDomEvent(renderable, name, selector, fn) {
        var obj = this._delegated[name];
        if (!obj) {
            obj = this._delegated[name] = { listener: this._createDelegateListener(name), items: [] };
            D.Adapter.addEventListener(this._getElement(), name, obj.listener, CAPTURES.indexOf(name) !== -1);
        }
        obj.items.push({ selector: selector, fn: fn, renderable: renderable });
    },
    _undelegateDomEvents: function _undelegateDomEvents(renderable) {
        var _this27 = this;

        mapObj(this._delegated, function (value, key) {
            var items = [],
                obj = value;
            map(obj.items, function (item) {
                if (item.renderable !== renderable) items.push(item);
            });
            obj.items = items;
            if (items.length === 0) {
                delete _this27._delegated[key];
                D.Adapter.removeEventListener(_this27._getElement(), key, obj.listener);
            }
        });
    }
});

D.TemplateEngine = function TemplateEngine(options) {
    D.TemplateEngine.__super__.constructor.call(this, 'Template Engine', options, { _templateCache: {} });
};

extend(D.TemplateEngine, D.Base, {
    executeIdReplacement: function executeIdReplacement(el, renderable) {
        var _this28 = this;

        var used = {};
        map(el.querySelectorAll('[id]'), function (item) {
            var id = item.getAttribute('id');
            if (used[id]) _this28._error('Dom ID: ' + id + ' is already used');
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
    },
    _load: function _load(renderable) {
        var id = renderable.id;
        if (this._templateCache[id]) return this._templateCache[id];
        return this._templateCache[id] = this._loadIt(renderable);
    },
    _loadIt: function _loadIt(renderable) {
        if (renderable instanceof Drizzle.Module) {
            return renderable._loader.loadModuleResource(renderable, 'templates');
        }

        return function () {
            return renderable.module._template;
        };
    },
    _execute: function _execute(renderable, data, template /* , update */) {
        var el = renderable._getElement();
        el.innerHTML = template(data);
        this.executeIdReplacement(el, renderable);
    }
});

D.Store = function Store(mod, options) {
    var _this29 = this;

    D.Store.__super__.constructor.call(this, 'Store', options, {
        app: mod.app,
        module: mod,
        models: {}
    });

    this.app.delegateEvent(this);

    this._callbacks = this._option('callbacks');
    mapObj(this._callbacks, function (value, key) {
        if (key.slice(0, 4) === 'app.') {
            _this29.listenTo(_this29.app, key, function (payload) {
                return value.call(_this29._callbackContext, payload);
            });
            return;
        }

        if (key.slice(0, 7) === 'shared.') {
            var name = key.slice(7),
                model = _this29.models[name];
            if (!model || model.store === _this29) _this29._error('Can not bind to model: ' + key);
            _this29.listenTo(model, 'changed', function () {
                return value.call(_this29._callbackContext);
            });
        }
    });
};

extend(D.Store, D.Base, {
    dispatch: function dispatch(name, payload) {
        var callback = void 0,
            n = name,
            p = payload;
        if (D.isObject(n)) {
            p = n.payload;
            n = n.name;
        }

        callback = this._callbacks[n];
        if (!callback) this._error('No action callback for name: ' + name);
        return this.chain(callback.call(this._callbackContext, p));
    },
    _initialize: function _initialize() {
        this._initializeModels();
        this._callbackContext = assign({
            app: this.app,
            models: this.models,
            module: this.module,
            chain: this.chain
        }, D.Request);

        this._callbackContext.Promise = new D.Promise(this._callbackContext);
    },
    _initializeModels: function _initializeModels() {
        var _this30 = this;

        mapObj(this._option('models'), function (value, key) {
            var v = (D.isFunction(value) ? value.call(_this30) : value) || {};
            if (v.shared === true) {
                if (_this30.app.viewport) {
                    _this30.models[key] = _this30.app.viewport.store.models[key];
                    return;
                }
                if (_this30.module.name === _this30.app._option('viewport')) {
                    _this30._error('Can not define shared model in viewport');
                }
                if (_this30.module.module && _this30.module.module.name === _this30.app._option('viewport')) {
                    _this30.models[key] = _this30.module.module.store.models[key];
                }
                return;
            }

            if (v.replaceable === true) {
                var modelMap = _this30.module.moduleOptions.models || {};
                if (modelMap[key] && _this30.module.module && _this30.module.module.store.models[modelMap[key]]) {
                    _this30.models[key] = _this30.module.module.store.models[modelMap[key]];
                    return;
                }
            }

            _this30.models[key] = _this30.app._createModel(_this30, v, key);
        });
    },
    _loadEagerModels: function _loadEagerModels() {
        var _this31 = this;

        return this.chain(mapObj(this.models, function (model) {
            if (model.store !== _this31) return null;
            return model.options.autoLoad === true ? D.Request.get(model) : null;
        }));
    },
    _loadLazyModels: function _loadLazyModels() {
        var _this32 = this;

        return this.chain(mapObj(this.models, function (model) {
            if (model.store !== _this32) return null;
            var autoLoad = model.options.autoLoad;

            return autoLoad && autoLoad !== true ? D.Request.get(model) : null;
        }));
    },
    _destory: function _destory() {
        this.stopListening();
    }
});

D.Model = function Model(store, options, name) {
    D.Model.__super__.constructor.call(this, name || 'Model', options, {
        app: store.module.app,
        module: store.module,
        store: store
    });

    this.data = clone(this._option('data')) || {};
    this._idKey = this._option('idKey') || this.app.options.idKey;
    this.params = assign({}, this._option('params'));
    this.app.delegateEvent(this);
};

D.extend(D.Model, D.Base, {
    getFullUrl: function getFullUrl() {
        return D.Request._url(this);
    },
    set: function set(data, trigger) {
        var d = this.options.parse ? this._option('parse', data) : data;
        this.data = this.options.root ? d[this.options.root] : d;
        if (trigger) this.changed();
    },
    getParams: function getParams() {
        return this.params;
    },
    get: function get(cloneIt) {
        return cloneIt ? clone(this.data) : this.data;
    },
    clear: function clear(trigger) {
        this.data = D.isArray(this.data) ? [] : {};
        if (trigger) this.changed();
    },
    changed: function changed() {
        this.trigger('changed');
    },
    _url: function _url() {
        return this._option('url') || '';
    }
});

D.Loader = function Loader(app, options) {
    D.Loader.__super__.constructor.call(this, 'Loader', options, { app: app });
};

D.assign(D.Loader, {
    _analyse: function _analyse(name) {
        if (!D.isString(name)) {
            return { loader: null, name: name };
        }

        var args = name.split(':'),
            loader = args.length > 1 ? args.shift() : null;

        return { loader: loader, name: args.shift(), args: args };
    }
});

D.extend(D.Loader, D.Base, {
    loadResource: function loadResource(path) {
        var _this33 = this;

        var _app$options = this.app.options;
        var scriptRoot = _app$options.scriptRoot;
        var getResource = _app$options.getResource;
        var amd = _app$options.amd;
        var fullPath = scriptRoot + '/' + path;

        return this.Promise.create(function (resolve, reject) {
            if (amd) {
                require([fullPath], resolve, reject);
            } else if (getResource) {
                resolve(getResource.call(_this33.app, fullPath));
            } else {
                resolve(require('./' + fullPath));
            }
        });
    },
    loadModuleResource: function loadModuleResource(mod, path) {
        return this.loadResource(mod.name + '/' + path);
    },
    loadModule: function loadModule(name) {
        return this.loadResource(name + '/index');
    },
    loadView: function loadView(name, mod) {
        return this.loadModuleResource(mod, 'view-' + name);
    },
    loadRouter: function loadRouter(path) {
        var name = 'router';
        return this.loadResource(path ? path + '/' + name : name);
    }
});

D.Application = function Application(options) {
    D.Application.__super__.constructor.call(this, options && options.name || 'Application', assign({
        scriptRoot: 'app',
        urlRoot: '',
        urlSuffix: '',
        caseSensitiveHash: false,
        container: root && root.document.body,
        disabledClass: 'disabled',
        getResource: null,
        idKey: 'id',
        viewport: 'viewport'
    }, options), {
        global: {},
        _modules: {},
        _loaders: {}
    });
};

D.extend(D.Application, D.Base, {
    _initialize: function _initialize() {
        this._templateEngine = this._option('templateEngine') || new D.TemplateEngine();
        this.registerLoader('default', new D.Loader(this), true);
        this._region = this._createRegion(this._option('container'), 'Region');
    },
    registerLoader: function registerLoader(name, loader, isDefault) {
        this._loaders[name] = loader;
        if (isDefault) this._defaultLoader = loader;
        return this;
    },
    start: function start(defaultHash) {
        var _router,
            _this34 = this;

        if (defaultHash) this._router = new D.Router(this);

        return this.chain(defaultHash ? (_router = this._router)._mountRoutes.apply(_router, _toConsumableArray(this._option('routers'))) : false, this._region.show(this._option('viewport')), function (viewport) {
            return _this34.viewport = viewport;
        }, function () {
            return defaultHash && _this34._router._start(defaultHash);
        }, this);
    },
    stop: function stop() {
        this.off();
        this._region.close();
        if (this._router) this._router._stop();
    },
    navigate: function navigate(hash, trigger) {
        if (!this._router) return;
        this._router.navigate(hash, trigger);
    },
    dispatch: function dispatch(name, payload) {
        var n = D.isObject(name) ? name.name : name,
            p = D.isObject(name) ? name.payload : payload;
        this.trigger('app.' + n, p);
    },
    show: function show(region, moduleName, options) {
        return this.viewport.regions[region].show(moduleName, options);
    },
    _getLoader: function _getLoader(name, mod) {
        return name && this._loaders[name] || mod && mod._loader || this._defaultLoader;
    },
    _createModule: function _createModule(name, parentModule, moduleOptions) {
        var _this35 = this;

        var _D$Loader$_analyse = D.Loader._analyse(name);

        var moduleName = _D$Loader$_analyse.name;
        var loaderName = _D$Loader$_analyse.loader;
        var loader = this._getLoader(loaderName, parent);

        return this.chain(loader.loadModule(moduleName), function () {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            return typeCache.createModule(options.type, moduleName, _this35, parentModule, loader, options, moduleOptions);
        });
    },
    _createView: function _createView(name, mod, moduleOptions) {
        var _this36 = this;

        var _D$Loader$_analyse2 = D.Loader._analyse(name);

        var viewName = _D$Loader$_analyse2.name;
        var loaderName = _D$Loader$_analyse2.loader;
        var loader = this._getLoader(loaderName, mod);

        return this.chain(loader.loadView(viewName, mod), function () {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            return typeCache.createView(options.type, viewName, _this36, mod, loader, options, moduleOptions);
        });
    },
    _createRegion: function _createRegion(el, name, mod) {
        var _D$Loader$_analyse3 = D.Loader._analyse(name);

        var regionName = _D$Loader$_analyse3.name;
        var type = _D$Loader$_analyse3.loader;

        return typeCache.createRegion(type, this, mod, el, regionName);
    },
    _createStore: function _createStore(mod) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return typeCache.createStore(options.type, mod, options);
    },
    _createModel: function _createModel(store) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var name = arguments[2];

        return typeCache.createModel(options.type, store, options, name);
    }
});

assign(D.Application.prototype, D.Event);

var PUSH_STATE_SUPPORTED = root && root.history && 'pushState' in root.history;
var ROUTER_REGEXPS = [/:([\w\d]+)/g, '([^\/]+)', /\*([\w\d]+)/g, '(.*)'];

function Route(app, router, path, fn) {
    var pattern = path.replace(ROUTER_REGEXPS[0], ROUTER_REGEXPS[1]).replace(ROUTER_REGEXPS[2], ROUTER_REGEXPS[3]);

    this.pattern = new RegExp('^' + pattern + '$', app.options.caseSensitiveHash ? 'g' : 'gi');

    this.app = app;
    this.router = router;
    this.path = path;
    this.fn = fn;
}

assign(Route.prototype, {
    match: function match(hash) {
        this.pattern.lastIndex = 0;
        return this.pattern.test(hash);
    },
    handle: function handle(hash) {
        var _router2,
            _this37 = this;

        this.pattern.lastIndex = 0;
        var args = this.pattern.exec(hash).slice(1),
            handlers = this.router._getInterceptors(this.path);

        handlers.push(this.fn);
        return (_router2 = this.router).chain.apply(_router2, _toConsumableArray(map(handlers, function (fn, i) {
            return function (prev) {
                return fn.apply(_this37.router, i > 0 ? [prev].concat(args) : args);
            };
        })));
    }
});

D.Router = function Router(app) {
    var _this38 = this;

    D.Router.__super__.constructor.call(this, 'Router', {}, {
        app: app,
        _routes: [],
        _interceptors: {},
        _started: false
    });

    this._prefix = app._option('routerPrefix') || '#!/';
    this._EVENT_HANDLER = function () {
        return _this38._dispath(_this38._getHash());
    };
};

extend(D.Router, D.Base, {
    navigate: function navigate(path, trigger) {
        if (!this._started) return;
        if (PUSH_STATE_SUPPORTED) {
            root.history.pushState({}, root.document.title, this._prefix + path);
        } else {
            root.location.replace(this._prefix + path);
        }

        if (trigger !== false) this._dispath(path);
    },
    _start: function _start(defaultPath) {
        if (this._started || !root) return;
        D.Adapter.addEventListener(root, 'hashchange', this._EVENT_HANDLER, false);

        var hash = this._getHash() || defaultPath;
        this._started = true;
        if (hash) this.navigate(hash);
    },
    _stop: function _stop() {
        if (!this._started) return;
        D.Adapter.removeEventListener(root, 'hashchange', this._EVENT_HANDLER);
        this._started = false;
    },
    _dispath: function _dispath(path) {
        if (!path || path === this._previousHash) return;
        this._previousHash = path;

        for (var i = 0; i < this._routes.length; i++) {
            var route = this._routes[i];
            if (route.match(path)) {
                route.handle(path);
                return;
            }
        }
    },
    _mountRoutes: function _mountRoutes() {
        var _this39 = this;

        var paths = slice.call(arguments);
        return this.chain(map(paths, function (path) {
            return _this39.app._getLoader(path).loadRouter(path);
        }), function (options) {
            return map(options, function (option, i) {
                return _this39._addRoute(paths[i], option);
            });
        });
    },
    _addRoute: function _addRoute(path, options) {
        var _this40 = this;

        var routes = options.routes;
        var interceptors = options.interceptors;


        mapObj(D.isFunction(routes) ? routes.apply(this) : routes, function (value, key) {
            var p = (path + '/' + key).replace(/^\/|\/$/g, '');
            _this40._routes.unshift(new Route(_this40.app, _this40, p, options[value]));
        });

        mapObj(D.isFunction(interceptors) ? interceptors.apply(this) : interceptors, function (value, key) {
            var p = (path + '/' + key).replace(/^\/|\/$/g, '');
            _this40._interceptors[p] = options[value];
        });
    },
    _getInterceptors: function _getInterceptors(path) {
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
    },
    _getHash: function _getHash() {
        var hash = root.location.hash;
        if (hash.slice(0, this._prefix.length) !== this._prefix) return '';
        return hash.slice(this._prefix.length);
    }
});

var PAGE_DEFAULT_OPTIONS = {
    pageSize: 10,
    pageKey: '_page',
    pageSizeKey: 'pageSize',
    recordCountKey: 'recordCount',
    params: function params(item) {
        return item;
    }
};

D.PageableModel = function PageableModel(store, options) {
    D.PageableModel.__super__.constructor.call(this, store, options);

    this.data = this._option('data') || [];
    this._p = {
        page: this._option('page') || 1,
        pageCount: 0,
        pageSize: this._option('pageSize') || PAGE_DEFAULT_OPTIONS.pageSize,
        pageKey: this._option('pageKey') || PAGE_DEFAULT_OPTIONS.pageKey,
        pageSizeKey: this._option('pageSizeKey') || PAGE_DEFAULT_OPTIONS.pageSizeKey,
        recordCountKey: this._option('recordCountKey') || PAGE_DEFAULT_OPTIONS.recordCountKey
    };
};

assign(D.PageableModel, {
    setDefault: function setDefault(defaults) {
        assign(PAGE_DEFAULT_OPTIONS, defaults);
    }
});

extend(D.PageableModel, D.Model, {
    set: function set() {
        var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var trigger = arguments[1];

        this._p.recordCount = data[this._p.recordCountKey] || 0;
        this._p.pageCount = Math.ceil(this._p.recordCount / this._p.pageSize);
        D.PageableModel.__super__.set.call(this, data, trigger);
    },
    getParams: function getParams() {
        var _p = this._p;
        var page = _p.page;
        var pageKey = _p.pageKey;
        var pageSizeKey = _p.pageSizeKey;
        var pageSize = _p.pageSize;

        var params = this.params;
        params[pageKey] = page;
        params[pageSizeKey] = pageSize;
        return PAGE_DEFAULT_OPTIONS.params(params);
    },
    clear: function clear(trigger) {
        this._p.page = 1;
        this._p.recordCount = 0;
        this._p.pageCount = 0;
        D.PageableModel.__super__.clear.call(this, trigger);
    },
    turnToPage: function turnToPage(page) {
        if (page <= this._p.pageCount && page >= 1) this._p.page = page;
        return this;
    },
    firstPage: function firstPage() {
        return this.turnToPage(1);
    },
    lastPage: function lastPage() {
        return this.turnToPage(this._p.pageCount);
    },
    nextPage: function nextPage() {
        return this.turnToPage(this._p.page + 1);
    },
    prevPage: function prevPage() {
        return this.turnToPage(this._p.page - 1);
    },
    getPageInfo: function getPageInfo() {
        var _p2 = this._p;
        var page = _p2.page;
        var pageSize = _p2.pageSize;
        var recordCount = _p2.recordCount;
        var pageCount = _p2.pageCount;

        var result = void 0;
        if (this.data && this.data.length > 0) {
            result = { page: page, start: (page - 1) * pageSize + 1, end: page * pageSize, total: recordCount, pageCount: pageCount };
        } else {
            result = { page: page, start: 0, end: 0, total: 0, pageCount: pageCount };
        }

        if (result.end > result.total) result.end = result.total;
        return result;
    }
});

D.registerModel('pageable', D.PageableModel);

D.MultiRegion = function MultiRegion() {
    D.MultiRegion.__super__.constructor.apply(this, arguments);
};

D.extend(D.MultiRegion, D.Region, {
    _initialize: function _initialize() {
        this._items = {};
        this._elements = {};
    },
    activate: function activate() {},
    show: function show(renderable) {
        var _this41 = this;

        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var opt = renderable.moduleOptions,
            str = D.isString(renderable);
        var key = options.key;
        if (!str && !(renderable instanceof D.Renderable)) {
            this._error('The item is expected to be an instance of Renderable');
        }

        if (!key && opt && opt.key) key = opt.key;
        if (!key) this._error('Region key is required');
        var item = this._items[key];

        if (this._isCurrent(key, item, renderable)) {
            if (options.forceRender === false) return this.Promise.resolve(item);
            return item.render(options);
        }

        return this.chain(str ? this.app._createModule(renderable) : renderable, [function (obj) {
            return _this41.chain(obj._region && obj._region.close(), obj);
        }, function () {
            return _this41.chain(item && item._close(), function () {
                delete _this41._items[key];
                delete _this41._elements[key];
            });
        }], function (_ref9) {
            var _ref10 = _slicedToArray(_ref9, 1);

            var obj = _ref10[0];

            var attr = obj.module ? obj.module.name + ':' + obj.name : obj.name,
                el = _this41._getElement(obj, key);

            _this41._items[key] = obj;
            el.setAttribute('data-current', attr);
            obj._setRegion(_this41);
            return obj._render(options, false);
        });
    },
    _createElement: function _createElement() {
        var el = root.document.createElement('div');
        this._el.appendChild(el);
        return el;
    },
    _getElement: function _getElement(item, key) {
        if (!item) return this._el;
        var k = key || item.renderOptions.key || item.moduleOptions.key;
        if (!this._elements[k]) this._elements[k] = this._createElement(k, item);
        return this._elements[k];
    },
    _isCurrent: function _isCurrent(key, item, renderable) {
        if (!item) return false;
        return item.name === renderable || renderable && renderable.id === item.id;
    },
    _empty: function _empty(item) {
        if (!item) {
            D.MultiRegion.__super__._empty.call(this);
            return;
        }

        var el = this._getElement(item);
        el.parentNode.removeChild(el);
    },
    close: function close() {
        var _this42 = this;

        return this.chain(mapObj(this._items, function (item) {
            return item._close();
        }), function () {
            _this42._elements = {};
            _this42._items = {};
            delete _this42._current;
        }, this);
    }
});
return Drizzle;
}));
