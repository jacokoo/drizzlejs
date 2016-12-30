const Drizzle = {},
    D = Drizzle,
    slice = [].slice,
    map = (arr, fn) => {
        const result = [];
        if (!arr) return result;
        if (arr.map) return arr.map(fn);

        for (let i = 0; i < arr.length; i ++) {
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },

    mapObj = (obj, fn) => {
        const result = [];
        let key;
        if (!obj) return result;

        for (key in obj) {
            if (D.hasOwnProperty.call(obj, key)) result.push(fn(obj[key], key, obj));
        }

        return result;
    },

    clone = (target) => {
        if (D.isObject(target)) {
            const result = {};
            mapObj(target, (value, key) => result[key] = clone(value));
            return result;
        }

        if (D.isArray(target)) {
            return map(target, (value) => clone(value));
        }

        return target;
    },

    assign = (target, ...args) => {
        const t = target;
        t && map(args, (arg) => arg && mapObj(arg, (value, key) => t[key] = value));
        return t;
    },

    extend = (theChild, theParent, obj) => {
        const child = theChild;
        assign(child, theParent);

        function Class () { this.constructor = theChild; }
        Class.prototype = theParent.prototype;
        child.prototype = new Class();
        assign(child.prototype, obj);
        child.__super__ = theParent.prototype;

        return child;
    },

    typeCache = {
        View: {}, Region: {}, Module: {}, Model: {}, Store: {},

        register (type, name, clazz) {
            this[type][name] = clazz;
        },

        create (type, name, ...args) {
            const Clazz = this[type][name] || D[type];
            return new Clazz(...args);
        }
    };

let counter = 0, root = null;

if (typeof window !== 'undefined') {
    root = window;
}

map(['Function', 'Array', 'String', 'Object'], (item) => {
    const name = `[object ${item}]`;
    D[`is${item}`] = function(obj) {
        return D.toString.call(obj) === name;
    };
});

map(['Module', 'View', 'Region', 'Model', 'Store'], (item) => {
    D['register' + item] = (name, clazz) => typeCache.register(item, name, clazz);
    typeCache['create' + item] = (name, ...args) => typeCache.create(item, name, ...args);
});

assign(D, {
    assign,

    uniqueId (prefix = '') {
        return `${prefix}${++counter}`;
    },

    adapt (obj) {
        assign(D.Adapter, obj);
    },

    extend
});

D.Adapter = {
    Promise,

    ajax (params) {
        const xhr = new XMLHttpRequest();
        let data = '';
        if (params.data) data = mapObj(params.data, (v, k) => `${k}=${encodeURIComponent(v)}`).join('&');
        xhr.open(params.type, (data && params.type === 'GET') ? params.url + '?' + data : params.url, true);
        const promise = new Promise((resolve, reject) => {
            xhr.onload = function() {
                if (this.status >= 200 && this.status < 400) {
                    resolve(JSON.parse(this.response));
                    return;
                }
                reject(xhr);
            };

            xhr.onerror = () => {
                reject(xhr);
            };
        });
        if (data) xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        params.beforeRequest && params.beforeRequest(xhr);
        xhr.send(data);
        return promise;
    },

    exportError () {},

    ajaxResult (args) { return args[0]; },

    getFormData (el) { throw new Error('getFormData is not implemented', el); },

    eventPrevented (e) { return e.defaultPrevented; },

    addEventListener (el, name, handler, useCapture) {
        el.addEventListener(name, handler, useCapture);
    },

    removeEventListener (el, name, handler) {
        el.removeEventListener(name, handler);
    },

    hasClass (el, clazz) { return el.classList.contains(clazz); },

    addClass (el, clazz) { el.classList.add(clazz); },

    removeClass (el, clazz) { el.classList.remove(clazz); }
};

D.Promise = function Promiser (context) {
    this.context = context;
};

D.assign(D.Promise.prototype, {
    create (fn) {
        return new D.Adapter.Promise((resolve, reject) => {
            fn.call(this.context, resolve, reject);
        });
    },

    resolve (data) {
        return D.Adapter.Promise.resolve(data);
    },

    reject (data) {
        return D.Adapter.Promise.reject(data);
    },

    parallel (items, ...args) {
        return this.create((resolve, reject) => {
            const result = [], thenables = [], indexMap = {};
            map(items, (item, i) => {
                let value;
                try {
                    value = D.isFunction(item) ? item.apply(this.context, args) : item;
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

            D.Adapter.Promise.all(thenables).then((as) => {
                mapObj(indexMap, (key, value) => result[value] = as[key]);
                resolve(result);
            }, (as) => {
                reject(as);
            });
        });
    },

    chain (...args) {
        let prev = null;
        const doRing = (rings, ring, resolve, reject) => {
            const nextRing = (data) => {
                prev = data;
                rings.length === 0 ? resolve(prev) : doRing(rings, rings.shift(), resolve, reject);
            };

            if (D.isArray(ring)) {
                ring.length === 0 ? nextRing([]) :
                    this.parallel(ring, ...(prev != null ? [prev] : [])).then(nextRing, reject);
            } else {
                let value;
                try {
                    value = D.isFunction(ring) ? ring.apply(this.context, prev != null ? [prev] : []) : ring;
                } catch (e) {
                    D.Adapter.exportError(e);
                    reject(e);
                    return;
                }

                value && value.then ? value.then(nextRing, reject) : nextRing(value);
            }
        };

        if (args.length === 0) return this.resolve();

        return this.create((resolve, reject) => {
            doRing(args, args.shift(), resolve, reject);
        });
    }
});

D.Event = {
    on (name, fn, ctx) {
        this._events || (this._events = {});
        (this._events[name] || (this._events[name] = [])).push({ fn, ctx });
    },

    off (name, fn) {
        if (!this._events || !name || !this._events[name]) return;
        if (!fn) {
            delete this._events[name];
            return;
        }

        const result = [];
        map(this._events[name], (item) => {if (item.fn !== fn) result.push(item);});

        if (result.length === 0) {
            delete this._events[name];
            return;
        }
        this._events[name] = result;
    },

    trigger (name, ...args) {
        if (!name || !this._events || !this._events[name]) return this;
        map(this._events[name], (item) => item.fn.apply(item.ctx, args));
    },

    delegateEvent (to) {
        const me = this, id = '--' + to.id, target = to;

        assign(target, {
            _listeners: {},

            listenTo (obj, name, fn, ctx) {
                (target._listeners[name] || (target._listeners[name] = [])).push({ fn, obj });
                obj.on(name, fn, ctx || target);
            },

            stopListening (obj, name, fn) {
                mapObj(target._listeners, (value, key) => {
                    const result = [];
                    map(value, (item) => {
                        let offIt = fn && (item.fn === fn && name === key && obj === item.obj);
                        offIt = offIt || (!fn && name && (name === key && obj === item.obj));
                        offIt = offIt || (!fn && !name && obj && obj === item.obj);
                        offIt = offIt || (!fn && !name && !obj);
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

            on (name, fn, ctx) {
                target.listenTo(me, name + id, fn, ctx);
            },

            off (name, fn) {
                target.stopListening(me, (name && name + id), fn);
            },

            trigger (name, ...args) {
                if (!name) return target;
                args.unshift(name + id) && me.trigger(...args);
            }
        });
        return this;
    }
};

D.Request = {
    get (model, options) {
        return this._ajax('GET', model, model.getParams(), options);
    },

    post (model, options) {
        return this._ajax('POST', model, model.data, options);
    },

    put (model, options) {
        return this._ajax('PUT', model, model.data, options);
    },

    del (model, options) {
        return this._ajax('DELETE', model, model.data, options);
    },

    save (model, options) {
        return model.data && model.data[model._idKey] ? this.put(model, options) : this.post(model, options);
    },

    _url (model) {
        const parts = [],
            prefix = model.module._option('urlPrefix', model) || '',
            urlRoot = model.app._option('urlRoot', model) || '',
            urlSuffix = model.app._option('urlSuffix', model) || '';
        let base = model._url() || '';

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

    _ajax (method, model, data, options) {
        const params = assign({ type: method }, options);

        params.data = assign({}, data, params.data);
        params.url = this._url(model);

        return model.Promise.create((resolve, reject) => {
            D.Adapter.ajax(params, model).then((...args) => {
                model.set(D.Adapter.ajaxResult(args), !params.slient);
                resolve(args);
            }, (...args) => reject(args));
        });
    }
};

D.ComponentManager = {
    _handlers: {},
    _componentCache: {},

    setDefaultHandler (creator, destructor = () => {}) {
        this._defaultHandler = { creator, destructor };
    },

    register (name, creator, destructor = () => {}) {
        this._handlers[name] = { creator, destructor };
    },

    _create (renderable, options) {
        const { name, id, selector, options: opt } = options;
        if (!name) renderable._error('Component name can not be null');

        const handler = this._handlers[name] || this._defaultHandler;
        if (!handler) renderable._error('No handler for component:', name);

        const dom = selector ? renderable.$$(selector) : renderable.$(id);
        const uid = id ? id : D.uniqueId('comp');

        return renderable.chain(handler.creator(renderable, dom, opt, name), (component) => {
            const cid = renderable.id + uid,
                cache = this._componentCache[cid],
                obj = { id: cid, handler, index: D.uniqueId(cid), options: opt };

            D.isArray(cache) ? cache.push(obj) : this._componentCache[cid] = cache ? [cache, obj] : obj;
            return { id, component, index: obj.index };
        });
    },

    _destroy (renderable, obj) {
        const id = renderable.id + obj.id, cache = this._componentCache[id];
        let current = cache;

        if (D.isArray(cache)) {
            this._componentCache[id] = [];
            map(cache, (item) => {
                item.index !== obj.index ? this._componentCache[id].push(item) : current = item;
            });
            this._componentCache[id].length === 0 && delete this._componentCache[id];
        } else {
            delete this._componentCache[id];
        }

        current.handler.destructor(renderable, obj.component, current.options);
    }
};

D.Base = function Base (name, options = {}, defaults) {
    this.options = options;
    this.id = D.uniqueId('D');
    this.name = name;
    this.Promise = new D.Promise(this);

    assign(this, defaults);
    if (options.mixin) this._mixin(options.mixin);
    this._loadedPromise = this._initialize();
};

D.assign(D.Base.prototype, {
    _initialize () {
    },

    _option (key, ...args) {
        const value = this.options[key];
        return D.isFunction(value) ? value.apply(this, args) : value;
    },

    _error (message, ...rest) {
        if (!D.isString(message)) throw message;
        throw new Error(`[${this.module ? this.module.name + ':' : ''}${this.name}] ${message} ${rest.join(' ')}`);
    },

    _mixin (obj) {
        mapObj(obj, (value, key) => {
            const old = this[key];
            if (!old) {
                this[key] = value;
                return;
            }

            if (D.isFunction(old)) {
                this[key] = (...args) => {
                    args.unshift(old);
                    return value.apply(this, args);
                };
            }
        });
    },

    chain (...args) {
        return this.Promise.chain(...args);
    }
});

D.Renderable = function Renderable (name, app, mod, loader, options, moduleOptions = {}) {
    D.Renderable.__super__.constructor.call(this, name, options, {
        app,
        moduleOptions,
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
    _initialize () {
        this._templateEngine = this._option('templateEngine')
            || this.module && this.module._templateEngine || this.app._templateEngine;
        return this.chain(
            [this._templateEngine._load(this), this._initializeEvents()],
            ([template]) => this._template = template
        );
    },

    render (options) {
        return this._render(options == null ? this.renderOptions : options, true);
    },

    $ (id) {
        return this.$$('#' + this._wrapDomId(id))[0];
    },

    $$ (selector) {
        return this._getElement().querySelectorAll(selector);
    },

    _render (options, update) {
        if (!this._region) this._error('Region is null');

        this.renderOptions = options == null ? this.renderOptions || {} : options;
        return this.chain(
            this._loadedPromise,
            this._destroyComponents,
            () => this.trigger('beforeRender'),
            () => this._option('beforeRender'),
            this._beforeRender,
            this._serializeData,
            (data) => this._renderTemplate(data, update),
            this._renderComponents,
            this._afterRender,
            () => this._option('afterRender'),
            () => this.trigger('afterRender'),
            this
        );
    },

    _setRegion (region) {
        this._region = region;
        this._bindEvents();
    },

    _close () {
        if (!this._region) return this.Promise.resolve(this);

        return this.chain(
            () => this.trigger('beforeClose'),
            () => this._option('beforeClose'),
            this._beforeClose,
            [this._unbindEvents, this._destroyComponents, () => this._region._empty(this)],
            this._afterClose,
            () => this._option('afterClose'),
            () => this.trigger('afterClose'),
            () => delete this._region,
            this
        );
    },

    _getElement () {
        return this._region ? this._region._getElement(this) : null;
    },

    _serializeData () {
        return {
            Global: this.app.global,
            Self: this
        };
    },

    _renderTemplate (data, update) {
        this._templateEngine._execute(this, data, this._template, update);
    },

    _initializeEvents (events) {
        mapObj(events || this._option('events'), (value, key) => {
            const items = key.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/), result = { key };

            if (items.length !== 2) this._error('Invalid event key');
            result.eventType = items[0];
            if (items[1].slice(-1) === '*') {
                result.id = this._wrapDomId(items[1].slice(0, -1));
                result.haveStar = true;
                result.selector = `[id^=${result.id}]`;
            } else {
                result.id = this._wrapDomId(items[1]);
                result.selector = `#${result.id}`;
            }
            result.handler = this._createEventHandler(value, result);
            this._events[key] = result;
        });
    },

    _getEventTarget (target, id) {
        const el = this._getElement();
        let current = target;
        while (current !== el) {
            const cid = current.getAttribute('id');
            if (cid && cid.slice(0, id.length) === id) return current;
            current = current.parentNode;
        }
    },

    _createEventHandler (handlerName, { haveStar, id }) {
        const { disabledClass } = this.app.options;
        return (...args) => {
            if (!this._eventHandlers[handlerName]) this._error('No event handler for name:', handlerName);

            const e = args[0];
            const target = this._getEventTarget(e.target, id);
            if (D.Adapter.hasClass(target, disabledClass)) return;
            if (haveStar) args.unshift(target.getAttribute('id').slice(id.length));
            this._eventHandlers[handlerName].apply(this, args);
        };
    },

    _bindEvents () {
        mapObj(this._events, (value) => {
            this._region._delegateDomEvent(this, value.eventType, value.selector, value.handler);
        });
    },

    _unbindEvents () {
        this._region._undelegateDomEvents(this);
    },

    _renderComponents () {
        return this.chain(map(this._option('components'), (item) => {
            const i = D.isFunction(item) ? item.call(this) : item;
            return i ? D.ComponentManager._create(this, i) : null;
        }), (components) => map(components, (item) => {
            if (!item) return;
            const { id, component, index } = item, value = this.components[id];
            D.isArray(value) ? value.push(component) : (this.components[id] = (value ? [value, component] : component));
            this._componentMap[index] = item;
        }));
    },

    _destroyComponents () {
        this.components = {};
        mapObj(this._componentMap, (value) => D.ComponentManager._destroy(this, value));
        this._componentMap = {};
    },

    _wrapDomId (id) {
        return this.id + id;
    },

    _beforeRender () {},
    _afterRender () {},
    _beforeClose () {},
    _afterClose () {}
});

D.RenderableContainer = function RenderableContainer () {
    D.RenderableContainer.__super__.constructor.apply(this, arguments);
};

extend(D.RenderableContainer, D.Renderable, {
    _initialize () {
        const promise = D.RenderableContainer.__super__._initialize.call(this);

        this.items = {};
        return this.chain(promise, this._initializeItems);
    },

    _afterRender () {
        return this.chain(this._initializeRegions, this._renderItems);
    },

    _afterClose () {
        return this._closeRegions();
    },

    _initializeItems () {
        this.chain(mapObj(this._option('items'), (options = {}, name) => {
            let opt = D.isFunction(options) ? options.call(this) : options;
            if (D.isString(opt)) opt = { region: opt };

            return this.app[options.isModule ? '_createModule' : '_createView'](name, this, opt).then((item) => {
                this.items[name] = item;
                return item;
            });
        }));
    },

    _initializeRegions () {
        this.regions = {};
        return this.chain(this._closeRegions, () => {
            map(this.$$('[data-region]'), (el) => {
                const region = this._createRegion(el);
                this.regions[region.name] = region;
            });
        });
    },

    _renderItems () {
        return this.chain(mapObj(this.items, (item) => {
            const { region } = item.moduleOptions;
            if (!region) return null;
            if (!this.regions[region]) this._error(`Region: ${region} is not defined`);
            return this.regions[region].show(item);
        }), this);
    },

    _createRegion (el) {
        const name = el.getAttribute('data-region');
        return this.app._createRegion(el, name, this);
    },

    _closeRegions () {
        const regions = this.regions;
        if (!regions) return this;
        this.regions = {};
        return this.chain(mapObj(regions, (region) => region.close()), this);
    }
});

D.ActionCreator = function ActionCreator () {
    D.ActionCreator.__super__.constructor.apply(this, arguments);
};

D.extend(D.ActionCreator, D.Renderable, {
    _initializeEvents () {
        const su = D.ActionCreator.__super__._initializeEvents;
        su.call(this);
        su.call(this, this._option('actions'));
    },

    _createEventHandler (name, obj) {
        const su = D.ActionCreator.__super__._createEventHandler;
        const isAction = !!(this._option('actions') || {})[obj.key];
        return isAction ? this._createAction(name, obj) : su.call(this, name, obj);
    },

    _createAction (name, { id }) {
        const { disabledClass } = this.app.options,
            { [name]: dataForAction } = this._option('dataForActions') || {},
            { [name]: actionCallback } = this._option('actionCallbacks') || {};

        return (e) => {
            const target = this._getEventTarget(e.target, id);
            if (D.Adapter.hasClass(target, disabledClass)) return;
            D.Adapter.addClass(target, disabledClass);

            const data = this._getActionPayload(target);
            this.chain(
                D.isFunction(dataForAction) ? dataForAction.call(this, data, e) : data,
                (payload) => payload !== false ? this.module.dispatch(name, payload) : false,
                (result) => result !== false ? actionCallback && actionCallback.call(this, result) : false
            ).then(
                () => D.Adapter.removeClass(target, disabledClass),
                () => D.Adapter.removeClass(target, disabledClass)
            );
        };
    },

    _getActionPayload (target) {
        const rootEl = this._getElement();
        let current = target, targetName = false;
        while (current && current !== rootEl && current.tagName !== 'FORM') current = current.parentNode;

        current || (current = rootEl);
        const data = current.tagName === 'FORM' ? D.Adapter.getFormData(current) : {};
        map(current.querySelectorAll('[data-name][data-value]'), (item) => {
            if (item === target) {
                targetName = target.getAttribute('data-name');
                data[targetName] = target.getAttribute('data-value');
                return;
            }

            const name = item.getAttribute('data-name');
            if (targetName && targetName === name) return;

            const value = item.getAttribute('data-value'), v = data[name];
            D.isArray(v) ? v.push(value) : (data[name] = v == null ? value : [v, value]);
        });
        return data;
    }
});

D.View = function View () {
    D.View.__super__.constructor.apply(this, arguments);
};

extend(D.View, D.ActionCreator, {
    _initialize () {
        this.bindings = {};
        return this.chain(D.View.__super__._initialize.call(this), this._initializeDataBinding);
    },

    _initializeDataBinding () {
        this._dataBinding = {};
        mapObj(this._option('bindings'), (value, key) => {
            const model = this.bindings[key] = this.module.store.models[key];
            if (!model) this._error('No model:', key);

            if (!value) return;
            this._dataBinding[key] = { model, value, fn: () => {
                if (value === true && this._region) this.render(this.renderOptions);
                if (D.isString(value)) this._option(value);
            } };
        });
    },

    _bindData () {
        mapObj(this._dataBinding, (value) => this.listenTo(value.model, 'changed', value.fn));
    },

    _unbindData () {
        this.stopListening();
    },

    _setRegion (...args) {
        D.View.__super__._setRegion.apply(this, args);
        this._bindData();
    },

    _close (...args) {
        this.chain(D.View.__super__._close.apply(this, args), this._unbindData, this);
    },

    _serializeData () {
        const data = D.View.__super__._serializeData.call(this);
        mapObj(this.bindings, (value, key) => data[key] = value.get(true));
        mapObj(this._option('dataForTemplate'), (value, key) => data[key] = value.call(this, data));
        return data;
    }

});

D.Module = function Module () {
    D.Module.__super__.constructor.apply(this, arguments);
};

D.extend(D.Module, D.RenderableContainer, {
    _initialize () {
        this.app._modules[`${this.name}--${this.id}`] = this;
        this._initializeStore();
        return D.Module.__super__._initialize.call(this);
    },

    dispatch (name, payload) {
        return this.store.dispatch(name, payload);
    },

    _initializeStore () {
        this.store = this.app._createStore(this, this._option('store'));
    },

    _afterClose () {
        delete this.app._modules[`${this.name}--${this.id}`];
        this.store._destory();
        return D.Module.__super__._afterClose.call(this);
    },

    _beforeRender () {
        return this.chain(D.Module.__super__._beforeRender.call(this), () => this.store._loadEagerModels());
    },

    _afterRender () {
        return this.chain(D.Module.__super__._afterRender.call(this), () => this.store._loadLazyModels());
    }
});

const CAPTURES = ['blur', 'focus', 'scroll', 'resize'];

D.Region = function Region (app, mod, el, name) {
    D.Region.__super__.constructor.call(this, name || 'Region', {}, {
        app,
        module: mod,
        _el: el,
        _delegated: {}
    });

    if (!this._el) this._error('The DOM element for region is required');
    app.delegateEvent(this);
};

extend(D.Region, D.Base, {
    show (renderable, options) {
        if (this._isCurrent(renderable)) {
            if (options && options.forceRender === false) return this.Promise.resolve(this._current);
            return this._current._render(options, true);
        }

        return this.chain(
            D.isString(renderable) ? this.app._createModule(renderable) : renderable,
            (item) => {
                if (!(item instanceof D.Renderable)) {
                    this._error('The item is expected to be an instance of Renderable');
                }
                return item;
            }, [
                (item) => this.chain(item._region && item._region.close(), item),
                () => this._current && this.close()
            ],
            ([item]) => {
                this._current = item;
                const attr = item.module ? `${item.module.name}:${item.name}` : item.name;
                this._getElement().setAttribute('data-current', attr);
                item._setRegion(this);
                return item;
            },
            (item) => item._render(options, false)
        );
    },

    close () {
        return this.chain(
            this._current && this._current._close(),
            () => delete this._current,
            this
        );
    },

    $$ (selector) {
        return this._getElement().querySelectorAll(selector);
    },

    _isCurrent (renderable) {
        if (!this._current) return false;
        if (this._current.name === renderable) return true;
        if (renderable && renderable.id === this._current.id) return true;
        return false;
    },

    _getElement () {
        return this._el;
    },

    _empty () {
        this._getElement().innerHTML = '';
    },

    _createDelegateListener (name) {
        return (...args) => {
            if (!this._delegated[name]) return;
            const e = args[0];
            const { target } = e;
            map(this._delegated[name].items, (item) => {
                if (D.Adapter.eventPrevented(e)) return;
                const els = this._getElement().querySelectorAll(item.selector);
                let matched = false;
                for (let i = 0; i < els.length; i ++) {
                    const el = els[i];
                    if (el === target || el.contains(target)) {
                        matched = el;
                        break;
                    }
                }
                matched && item.fn.apply(item.renderable, args.concat([matched]));
            });
        };
    },

    _delegateDomEvent (renderable, name, selector, fn) {
        let obj = this._delegated[name];
        if (!obj) {
            obj = this._delegated[name] = { listener: this._createDelegateListener(name), items: [] };
            D.Adapter.addEventListener(this._getElement(), name, obj.listener, CAPTURES.indexOf(name) !== -1);
        }
        obj.items.push({ selector, fn, renderable });
    },

    _undelegateDomEvents (renderable) {
        mapObj(this._delegated, (value, key) => {
            const items = [], obj = value;
            map(obj.items, (item) => {
                if (item.renderable !== renderable) items.push(item);
            });
            obj.items = items;
            if (items.length === 0) {
                delete this._delegated[key];
                D.Adapter.removeEventListener(this._getElement(), key, obj.listener);
            }
        });
    }
});

D.TemplateEngine = function TemplateEngine (options) {
    D.TemplateEngine.__super__.constructor.call(this, 'Template Engine', options, { _templateCache: {} });
};

extend(D.TemplateEngine, D.Base, {
    executeIdReplacement (el, renderable) {
        const used = {};
        map(el.querySelectorAll('[id]'), (item) => {
            const id = item.getAttribute('id');
            if (used[id]) this._error(`Dom ID: ${id} is already used`);
            used[id] = true;
            item.setAttribute('id', renderable._wrapDomId(id));
        });

        const attrs = this._option('attributesReferToId') || ['for', 'data-target', 'data-parent'];

        map(attrs, (attr) => map(el.querySelectorAll(`[${attr}]`), (item) => {
            const value = item.getAttribute(attr),
                withHash = value.charAt(0) === '#',
                wrapped = withHash ? `#${renderable._wrapDomId(value.slice(1))}` : renderable._wrapDomId(value);
            item.setAttribute(attr, wrapped);
        }));
    },

    _load (renderable) {
        const id = renderable.id;
        if (this._templateCache[id]) return this._templateCache[id];
        return this._templateCache[id] = this._loadIt(renderable);
    },

    _loadIt (renderable) {
        if (renderable instanceof Drizzle.Module) {
            return renderable._loader.loadModuleResource(renderable, 'templates');
        }

        return () => renderable.module._template;
    },

    _execute (renderable, data, template /* , update */) {
        const el = renderable._getElement();
        el.innerHTML = template(data);
        this.executeIdReplacement(el, renderable);
    }

});

D.Store = function Store (mod, options) {
    D.Store.__super__.constructor.call(this, 'Store', options, {
        app: mod.app,
        module: mod,
        models: {}
    });

    this.app.delegateEvent(this);

    this._callbacks = this._option('callbacks');
    mapObj(this._callbacks, (value, key) => {
        if (key.slice(0, 4) === 'app.') {
            this.listenTo(this.app, key, (payload) => value.call(this._callbackContext, payload));
            return;
        }

        if (key.slice(0, 7) === 'shared.') {
            const name = key.slice(7), model = this.models[name];
            if (!model || model.store === this) this._error(`Can not bind to model: ${key}`);
            this.listenTo(model, 'changed', () => value.call(this._callbackContext));
        }
    });
};

extend(D.Store, D.Base, {
    dispatch (name, payload) {
        let callback, n = name, p = payload;
        if (D.isObject(n)) {
            p = n.payload;
            n = n.name;
        }

        callback = this._callbacks[n];
        if (!callback) this._error(`No action callback for name: ${name}`);
        return this.chain(callback.call(this._callbackContext, p));
    },

    _initialize () {
        this._initializeModels();
        this._callbackContext = assign({
            app: this.app,
            models: this.models,
            module: this.module,
            chain: this.chain
        }, D.Request);

        this._callbackContext.Promise = new D.Promise(this._callbackContext);
    },

    _initializeModels () {
        mapObj(this._option('models'), (value, key) => {
            const v = (D.isFunction(value) ? value.call(this) : value) || {};
            if (v.shared === true) {
                if (this.app.viewport) {
                    this.models[key] = this.app.viewport.store.models[key];
                    return;
                }
                if (this.module.name === this.app._option('viewport')) {
                    this._error('Can not define shared model in viewport');
                }
                if (this.module.module && this.module.module.name === this.app._option('viewport')) {
                    this.models[key] = this.module.module.store.models[key];
                }
                return;
            }

            if (v.replaceable === true) {
                const modelMap = this.module.moduleOptions.models || {};
                if (modelMap[key] && this.module.module && this.module.module.store.models[modelMap[key]]) {
                    this.models[key] = this.module.module.store.models[modelMap[key]];
                    return;
                }
            }

            this.models[key] = this.app._createModel(this, v);
        });
    },

    _loadEagerModels () {
        return this.chain(mapObj(this.models, (model) => {
            if (model.store !== this) return null;
            return model.options.autoLoad === true ? D.Request.get(model) : null;
        }));
    },

    _loadLazyModels () {
        return this.chain(mapObj(this.models, (model) => {
            if (model.store !== this) return null;
            const { autoLoad } = model.options;
            return autoLoad && autoLoad !== true ? D.Request.get(model) : null;
        }));
    },

    _destory () {
        this.stopListening();
    }
});

D.Model = function Model (store, options) {
    D.Model.__super__.constructor.call(this, 'Model', options, {
        app: store.module.app,
        module: store.module,
        store
    });

    this.data = clone(this._option('data')) || {};
    this._idKey = this._option('idKey') || this.app.options.idKey;
    this.params = assign({}, this._option('params'));
    this.app.delegateEvent(this);
};

D.extend(D.Model, D.Base, {
    getFullUrl () { return D.Request._url(this); },

    set (data, trigger) {
        const d = this.options.parse ? this._option('parse', data) : data;
        this.data = this.options.root ? d[this.options.root] : d;
        if (trigger) this.changed();
    },

    getParams () { return this.params; },

    get (cloneIt) {
        return cloneIt ? clone(this.data) : this.data;
    },

    clear (trigger) {
        this.data = D.isArray(this.data) ? [] : {};
        if (trigger) this.changed();
    },

    changed () { this.trigger('changed'); },

    _url () {
        return this._option('url') || '';
    }
});

D.Loader = function Loader (app, options) {
    D.Loader.__super__.constructor.call(this, 'Loader', options, { app });
};

D.assign(D.Loader, {
    _analyse (name) {
        if (!D.isString(name)) {
            return { loader: null, name };
        }

        const args = name.split(':'),
            loader = args.length > 1 ? args.shift() : null;

        return { loader, name: args.shift(), args };
    }
});

D.extend(D.Loader, D.Base, {
    loadResource (path) {
        const { scriptRoot, getResource, amd } = this.app.options,
            fullPath = `${scriptRoot}/${path}`;

        return this.Promise.create((resolve, reject) => {
            if (amd) {
                require([fullPath], resolve, reject);
            } else if (getResource) {
                resolve(getResource.call(this.app, fullPath));
            } else {
                resolve(require(`./${fullPath}`));
            }
        });
    },

    loadModuleResource (mod, path) {
        return this.loadResource(`${mod.name}/${path}`);
    },

    loadModule (name) {
        return this.loadResource(`${name}/index`);
    },

    loadView (name, mod) {
        return this.loadModuleResource(mod, `view-${name}`);
    },

    loadRouter (path) {
        const name = 'router';
        return this.loadResource(path ? `${path}/${name}` : name);
    }
});

D.Application = function Application (options) {
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
    _initialize () {
        this._templateEngine = this._option('templateEngine') || new D.TemplateEngine();
        this.registerLoader('default', new D.Loader(this), true);
        this._region = this._createRegion(this._option('container'), 'Region');
    },

    registerLoader (name, loader, isDefault) {
        this._loaders[name] = loader;
        if (isDefault) this._defaultLoader = loader;
        return this;
    },

    start (defaultHash) {
        if (defaultHash) this._router = new D.Router(this);

        return this.chain(
            defaultHash ? this._router._mountRoutes(...this._option('routers')) : false,
            this._region.show(this._option('viewport')),
            (viewport) => this.viewport = viewport,
            () => defaultHash && this._router._start(defaultHash),
            this
        );
    },

    stop () {
        this.off();
        this._region.close();
        if (this._router) this._router._stop();
    },

    navigate (hash, trigger) {
        if (!this._router) return;
        this._router.navigate(hash, trigger);
    },

    dispatch (name, payload) {
        const n = D.isObject(name) ? name.name : name,
            p = D.isObject(name) ? name.payload : payload;
        this.trigger(`app.${n}`, p);
    },

    show (region, moduleName, options) {
        return this.viewport.regions[region].show(moduleName, options);
    },

    _getLoader (name, mod) {
        return name && this._loaders[name] || mod && mod._loader || this._defaultLoader;
    },

    _createModule (name, parentModule, moduleOptions) {
        const { name: moduleName, loader: loaderName } = D.Loader._analyse(name),
            loader = this._getLoader(loaderName, parent);

        return this.chain(loader.loadModule(moduleName), (options = {}) => {
            return typeCache.createModule(options.type, moduleName, this, parentModule, loader, options, moduleOptions);
        });
    },

    _createView (name, mod, moduleOptions) {
        const { name: viewName, loader: loaderName } = D.Loader._analyse(name),
            loader = this._getLoader(loaderName, mod);

        return this.chain(loader.loadView(viewName, mod), (options = {}) => {
            return typeCache.createView(options.type, viewName, this, mod, loader, options, moduleOptions);
        });
    },

    _createRegion (el, name, mod) {
        const { name: regionName, loader: type } = D.Loader._analyse(name);
        return typeCache.createRegion(type, this, mod, el, regionName);
    },

    _createStore (mod, options = {}) {
        return typeCache.createStore(options.type, mod, options);
    },

    _createModel (store, options = {}) {
        return typeCache.createModel(options.type, store, options);
    }
});

assign(D.Application.prototype, D.Event);

const PUSH_STATE_SUPPORTED = root && root.history && ('pushState' in root.history);
const ROUTER_REGEXPS = [/:([\w\d]+)/g, '([^\/]+)', /\*([\w\d]+)/g, '(.*)'];

function Route (app, router, path, fn) {
    const pattern = path
          .replace(ROUTER_REGEXPS[0], ROUTER_REGEXPS[1])
          .replace(ROUTER_REGEXPS[2], ROUTER_REGEXPS[3]);

    this.pattern = new RegExp(`^${pattern}$`, app.options.caseSensitiveHash ? 'g' : 'gi');

    this.app = app;
    this.router = router;
    this.path = path;
    this.fn = fn;
}

assign(Route.prototype, {
    match (hash) {
        this.pattern.lastIndex = 0;
        return this.pattern.test(hash);
    },

    handle (hash) {
        this.pattern.lastIndex = 0;
        const args = this.pattern.exec(hash).slice(1),
            handlers = this.router._getInterceptors(this.path);

        handlers.push(this.fn);
        return this.router.chain(...map(handlers, (fn, i) => {
            return (prev) => fn.apply(this.router, (i > 0 ? [prev].concat(args) : args));
        }));
    }
});

D.Router = function Router (app) {
    D.Router.__super__.constructor.call(this, 'Router', {}, {
        app,
        _routes: [],
        _interceptors: {},
        _started: false
    });

    this._prefix = app._option('routerPrefix') || '#!/';
    this._EVENT_HANDLER = () => this._dispath(this._getHash());
};

extend(D.Router, D.Base, {
    navigate (path, trigger) {
        if (!this._started) return;
        if (PUSH_STATE_SUPPORTED) {
            root.history.pushState({}, root.document.title, this._prefix + path);
        } else {
            root.location.replace(this._prefix + path);
        }

        if (trigger !== false) this._dispath(path);
    },

    _start (defaultPath) {
        if (this._started || !root) return;
        D.Adapter.addEventListener(root, 'hashchange', this._EVENT_HANDLER, false);

        const hash = this._getHash() || defaultPath;
        this._started = true;
        if (hash) this.navigate(hash);
    },

    _stop () {
        if (!this._started) return;
        D.Adapter.removeEventListener(root, 'hashchange', this._EVENT_HANDLER);
        this._started = false;
    },

    _dispath (path) {
        if (!path || path === this._previousHash) return;
        this._previousHash = path;

        for (let i = 0; i < this._routes.length; i++) {
            const route = this._routes[i];
            if (route.match(path)) {
                route.handle(path);
                return;
            }
        }
    },

    _mountRoutes () {
        const paths = slice.call(arguments);
        return this.chain(
            map(paths, (path) => this.app._getLoader(path).loadRouter(path)),
            (options) => map(options, (option, i) => this._addRoute(paths[i], option))
        );
    },

    _addRoute (path, options) {
        const { routes, interceptors } = options;

        mapObj(D.isFunction(routes) ? routes.apply(this) : routes, (value, key) => {
            const p = `${path}/${key}`.replace(/^\/|\/$/g, '');
            this._routes.unshift(new Route(this.app, this, p, options[value]));
        });

        mapObj(D.isFunction(interceptors) ? interceptors.apply(this) : interceptors, (value, key) => {
            const p = `${path}/${key}`.replace(/^\/|\/$/g, '');
            this._interceptors[p] = options[value];
        });
    },

    _getInterceptors (path) {
        const result = [], items = path.split('/');

        items.pop();
        while (items.length > 0) {
            const key = items.join('/');
            if (this._interceptors[key]) result.unshift(this._interceptors[key]);
            items.pop();
        }

        if (this._interceptors['']) result.unshift(this._interceptors['']);
        return result;
    },

    _getHash () {
        const hash = root.location.hash;
        if (hash.slice(0, this._prefix.length) !== this._prefix) return '';
        return hash.slice(this._prefix.length);
    }

});

const PAGE_DEFAULT_OPTIONS = {
    pageSize: 10,
    pageKey: '_page',
    pageSizeKey: 'pageSize',
    recordCountKey: 'recordCount',
    params: (item) => item
};

D.PageableModel = function PageableModel (store, options) {
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
    setDefault (defaults) {
        assign(PAGE_DEFAULT_OPTIONS, defaults);
    }
});

extend(D.PageableModel, D.Model, {
    set (data = {}, trigger) {
        this._p.recordCount = data[this._p.recordCountKey] || 0;
        this._p.pageCount = Math.ceil(this._p.recordCount / this._p.pageSize);
        D.PageableModel.__super__.set.call(this, data, trigger);
    },

    getParams () {
        const { page, pageKey, pageSizeKey, pageSize } = this._p;
        const params = this.params;
        params[pageKey] = page;
        params[pageSizeKey] = pageSize;
        return PAGE_DEFAULT_OPTIONS.params(params);
    },

    clear (trigger) {
        this._p.page = 1;
        this._p.recordCount = 0;
        this._p.pageCount = 0;
        D.PageableModel.__super__.clear.call(this, trigger);
    },

    turnToPage (page) {
        if (page <= this._p.pageCount && page >= 1) this._p.page = page;
        return this;
    },

    firstPage () { return this.turnToPage(1); },

    lastPage () { return this.turnToPage(this._p.pageCount); },

    nextPage () { return this.turnToPage(this._p.page + 1); },

    prevPage () { return this.turnToPage(this._p.page - 1); },

    getPageInfo () {
        const { page, pageSize, recordCount, pageCount } = this._p;
        let result;
        if (this.data && this.data.length > 0) {
            result = { page, start: (page - 1) * pageSize + 1, end: page * pageSize, total: recordCount, pageCount };
        } else {
            result = { page, start: 0, end: 0, total: 0, pageCount };
        }

        if (result.end > result.total) result.end = result.total;
        return result;
    }
});

D.registerModel('pageable', D.PageableModel);

D.MultiRegion = function MultiRegion () {
    D.MultiRegion.__super__.constructor.apply(this, arguments);
};

D.extend(D.MultiRegion, D.Region, {
    _initialize () {
        this._items = {};
        this._elements = {};
    },

    activate () {},

    show (renderable, options = {}) {
        const opt = renderable.moduleOptions, str = D.isString(renderable);
        let key = options.key;
        if (!str && !(renderable instanceof D.Renderable)) {
            this._error('The item is expected to be an instance of Renderable');
        }

        if (!key && opt && opt.key) key = opt.key;
        if (!key) this._error('Region key is required');
        const item = this._items[key];

        if (this._isCurrent(key, item, renderable)) {
            if (options.forceRender === false) return this.Promise.resolve(item);
            return item.render(options);
        }

        return this.chain(
            str ? this.app._createModule(renderable) : renderable,
            [
                (obj) => this.chain(obj._region && obj._region.close(), obj),
                () => this.chain(item && item._close(), () => {
                    delete this._items[key];
                    delete this._elements[key];
                })
            ],
            ([obj]) => {
                const attr = obj.module ? `${obj.module.name}:${obj.name}` : obj.name,
                    el = this._getElement(obj, key);

                this._items[key] = obj;
                el.setAttribute('data-current', attr);
                obj._setRegion(this);
                return obj._render(options, false);
            }
        );
    },

    _createElement () {
        const el = root.document.createElement('div');
        this._el.appendChild(el);
        return el;
    },

    _getElement (item, key) {
        if (!item) return this._el;
        const k = key || item.renderOptions.key || item.moduleOptions.key;
        if (!this._elements[k]) this._elements[k] = this._createElement(k, item);
        return this._elements[k];
    },

    _isCurrent (key, item, renderable) {
        if (!item) return false;
        return item.name === renderable || (renderable && renderable.id === item.id);
    },

    _empty (item) {
        if (!item) {
            D.MultiRegion.__super__._empty.call(this);
            return;
        }

        const el = this._getElement(item);
        el.parentNode.removeChild(el);
    },

    close () {
        return this.chain(
            mapObj(this._items, (item) => item._close()),
            () => {
                this._elements = {};
                this._items = {};
                delete this._current;
            },
            this
        );
    }
});
