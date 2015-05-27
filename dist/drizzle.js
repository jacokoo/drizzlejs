/*!
 * DrizzleJS v0.3.4
 * -------------------------------------
 * Copyright (c) 2015 Jaco Koo <jaco.koo@guyong.in>
 * Distributed under MIT license
 */

'use strict';

(function(root, factory) {
    var handlebars;

    if (typeof define === 'function' && define.amd) {
        define(['handlebars.runtime'], function(Handlebars) {
            return factory(root, Handlebars['default']);
        });
    } else if (typeof exports === 'object') {
        handlebars = require('handlebars/runtime')['default'];
        module.exports = factory(root, handlebars);
    } else {
        root.Drizzle = factory(root, root.Handlebars);
    }
})(window, function(root, handlebars) {
    var Drizzle = {}, D = Drizzle,
        counter = 0,
        toString = Drizzle.toString,
        has = Drizzle.hasOwnProperty,
        slice = [].slice,
        FN = function() {},

    chain = function(obj) {
        return obj.Promise.chain.apply(obj.Promise, slice.call(arguments, 1));
    },

    parent = function(obj) {
        return obj.__super__.constructor;
    },

    mapObj = function(obj, fn, ctx) {
        var result = [], i;
        if (!obj) return result;

        for (i in obj) {
            if (has.call(obj, i)) result.push(fn.call(ctx, obj[i], i));
        }
        return result;
    },

    map = function(arr, fn, ctx) {
        var result = [], i;
        if (!arr) return result;
        if (arr.map) return arr.map(fn, ctx);

        for (i = 0; i < arr.length; i++) {
            result.push(fn.call(ctx, arr[i], i));
        }
        return result;
    },

    assign = function(target) {
        if (!target) return target;
        map(slice.call(arguments, 1), function(arg) {
            if (!arg) return;
            mapObj(arg, function(value, key) {
                target[key] = value;
            });
        });
        return target;
    },

    extend = function(child, theParent, obj) {
        mapObj(theParent, function(value, key) {
            if (has.call(theParent, key)) child[key] = value;
        });

        function Ctor() { this.constructor = child; }
        Ctor.prototype = theParent.prototype;
        child.prototype = new Ctor();
        child.__super__ = theParent.prototype;

        mapObj(obj, function(value, key) {
            child.prototype[key] = value;
        });

        return child;
    },

    compose = function() {
        return slice.call(arguments).join('/').replace(/\/{2,}/g, '/')
            .replace(/^\/|\/$/g, '');
    },

    Application, Base, Loader, Model, Module, MultiRegion,
    PageableModel, Region, Router, View, Layout, Adapter,
    Event, Factory, Helpers, Request, Promise, SimpleLoader;

    map(['Function', 'Array', 'String', 'Object'], function(value) {
        Drizzle['is' + value] = function(obj) {
            return toString.call(obj) === '[object ' + value + ']';
        };
    });

    Drizzle.uniqueId = function(prefix) {
        return (prefix || '') + (++counter);
    };

    Drizzle.assign = assign;

    Drizzle.extend = extend;

    Adapter = D.Adapter = {
        Promise: root.Promise,
        ajax: null,
        hasClass: function(el, name) { return el.classList.contains(name); },
        addClass: function(el, name) { return el.classList.add(name); },
        removeClass: function(el, name) { return el.classList.remove(name); },

        componentHandler: function(name) {
            return {
                creator: function() {
                    throw new Error('Component [' + name + '] is not defined');
                }
            };
        },

        delegateDomEvent: FN,

        undelegateDomEvents: FN,

        getFormData: FN
    };


    Promise = D.Promise = function(context) {
        this.context = context;
    };

    assign(Promise.prototype, {
        create: function(fn) {
            var ctx = this.context;
            return new Adapter.Promise(function(resolve, reject) {
                fn.call(ctx, resolve, reject);
            });
        },

        resolve: function(data) {
            return Adapter.Promise.resolve(data);
        },

        reject: function(data) {
            return Adapter.Promise.reject(data);
        },

        when: function(obj) {
            var args = slice.call(arguments, 1), result;
            result = D.isFunction(obj) ? obj.apply(this.context, args) : obj;
            return Adapter.Promise.resolve(result);
        },

        chain: function() {
            var me = this, args, prev = null, doRing = function(rings, resolve, reject, ring, i) {
                var promise;
                if (D.isArray(ring)) {
                    promise = Adapter.Promise.all(map(ring, function(item) {
                        return me.when.apply(me, i > 0 ? [item, prev] : [item]);
                    }));
                } else {
                    promise = me.when.apply(me, i > 0 ? [ring, prev] : [ring]);
                }

                promise.then(function(data) {
                    prev = data;
                    rings.length === 0 ? resolve(prev) : doRing(rings, resolve, reject, rings.shift(), i + 1);
                }, function(data) {
                    reject(data);
                });
            };

            args = slice.call(arguments);
            if (args.length === 0) return me.resolve();

            return me.create(function(resolve, reject) {
                doRing(args, resolve, reject, args.shift(), 0);
            });
        }
    });


    Event = D.Event = {
        on: function(name, callback, context) {
            this.events || (this.events = {});
            this.events[name] || (this.events[name] = []);
            this.events[name].push({fn: callback, ctx: context});
            return this;
        },

        off: function(name, callback, context) {
            if (!this.events || !name || !this.events[name]) return this;
            if (!callback) return (delete this.events[name]) && this;
            map(this.events[name], function(item) {
                var result = [];
                if (item.fn !== callback || (context && context !== item.ctx)) {
                    result.push(item);
                }
                this.events[name] = result;
            }, this);

            if (!this.events[name].length) delete this.events[name];
            return this;
        },

        trigger: function(name) {
            var args;
            if (!name || !this.events || !this.events[name]) return this;
            args = slice.call(arguments, 1);

            map(this.events[name], function(item) {
                item.fn.apply(item.ctx, args);
            });
            return this;
        },

        delegateEvent: function(target) {
            var me = this, id = '--' + target.id;
            Drizzle.assign(target, {
                on: function(name, callback) {
                    target.listenTo(me, name + id, callback);
                    return this;
                },

                off: function(name, callback) {
                    target.stopListening(me, (name && name + id), callback);
                    return this;
                },

                trigger: function(name) {
                    var args;
                    if (!name) return this;

                    args = slice.call(arguments);
                    args.unshift(name + id);
                    me.trigger.apply(me, args);
                    return this;
                },

                listenTo: function(obj, name, callback) {
                    this.listeners || (this.listeners = {});
                    this.listeners[name] || (this.listeners[name] = []);
                    this.listeners[name].push({obj: obj, fn: callback});

                    obj.on(name, callback, this);
                    return this;
                },

                stopListening: function(obj, name, callback) {
                    if (!this.listeners) return this;

                    if (!obj) {
                        mapObj(this.listeners, function(value, key) {
                            map(value, function(item) {
                                item.obj.off(key, item.fn, this);
                            }, this);
                        }, this);
                        this.listeners = {};
                        return this;
                    }

                    mapObj(this.listeners, function(value, key) {
                        if (name && name !== key) return;

                        this.listeners[key] = [];
                        map(value, function(item) {
                            if (item.obj !== obj || (callback && callback !== item.fn)) {
                                this.listeners[key].push(item);
                            } else {
                                item.obj.off(key, item.fn, this);
                            }
                        }, this);
                    }, this);

                    return this;
                }
            });
            return this;
        }
    };


    Request = D.Request = {
        url: function(model) {
            var options = model.app.options,
                base = model.url(),
                urls = [options.urlRoot];

            if (model.module.options.urlPrefix) {
                urls.push(model.module.options.urlPrefix);
            }

            urls.push(model.module.name);

            while (base.indexOf('../') === 0) {
                urls.pop();
                base = base.slice(3);
            }
            urls.push(base);

            if (model.data.id) urls.push(model.data.id);

            if (options.urlSuffix) {
                urls.push(urls.pop() + options.urlSuffix);
            }

            return compose.apply(null, urls);
        },

        get: function(model, options) {
            return this.ajax({type: 'GET'}, model, model.getParams(), options);
        },

        post: function(model, options) {
            return this.ajax({type: 'POST'}, model, model.data, options);
        },

        put: function(model, options) {
            return this.ajax({type: 'PUT'}, model, model.data, options);
        },

        del: function(model, options) {
            return this.ajax({type: 'DELETE'}, model, model.data, options);
        },

        save: function(model, options) {
            return model.data.id ? this.put(model, options) : this.post(model, options);
        },

        ajax: function(params, model, data, options) {
            options || (options = {});
            assign(params, options);
            assign(data, options.data);

            params.url = this.url(model);
            params.data = data;

            return new Adapter.Promise(function(resolve, reject) {
                Adapter.ajax(params).then(function() {
                    var args = slice.call(arguments), resp = args[0];
                    model.set(resp).changed();
                    resolve(args);
                }, function() {
                    reject(slice.call(arguments));
                });
            });
        }
    };


    Factory = D.Factory = {

        types: {},

        register: function(name, type) { this.types[name] = type; },

        create: function(type) {
            var args = slice.call(arguments, 1),
                result, child, Ctor = function() {};

            type = this.types[type] || this;
            Ctor.prototype = type.prototype;
            child = new Ctor();
            result = type.apply(child, args);

            return Object(result) === result ? result : child;
        }

    };


    Base = D.Base = function(idPrefix, options) {
        this.options = options || {};
        this.id = D.uniqueId(idPrefix);
        this.Promise = new Promise(this);
        this.initialize();
    };

    assign(Base.prototype, {
        initialize: FN,

        option: function(key) {
            var value = this.options[key];
            return D.isFunction(value) ? value.call(this) : value;
        },

        error: function(message) {
            var msg;
            if (!D.isString(message)) throw message;

            msg = this.module ? ['[', this.module.name, ':'] : ['['];
            msg = msg.concat([this.name, '] ', message]);
            throw new Error(msg.join(''));
        },

        mixin: function(mixins) {
            var old, me = this;
            if (!mixins) return;
            mapObj(mixins, function(value, key) {
                if (D.isFunction(value)) {
                    old = me[key];
                    me[key] = function() {
                        var args = slice.call(arguments);
                        if (old) args.unshift(old);
                        return value.apply(me, args);
                    };
                } else {
                    if (!me[key]) me[key] = value;
                }
            });
        }
    });


    (function() {
        var defaultOptions = {
            scriptRoot: 'app',
            urlRoot: '',
            urlSuffix: '',
            caseSensitiveHash: false,
            defaultRegion: root.document.body,
            disabledClass: 'disabled',
            attributesReferToId: ['for', 'data-target', 'data-parent'],

            fileNames: {
                module: 'index',
                templates: 'templates',
                view: 'view-',
                template: 'template-',
                router: 'router'
            },

            pagination: {
                pageSize: 10,
                pageKey: '_page',
                pageSizeKey: '_pageSize',
                recordCountKey: 'recordCount'
            }
        };

        Application = Drizzle.Application = function(options) {
            var opt = assign({}, defaultOptions, options);
            this.modules = {};
            this.global = {};
            this.loaders = {};
            this.regions = [];

            parent(Application).call(this, 'A', opt);
        };

        extend(Application, Base, {
            initialize: function() {
                this.registerLoader(new SimpleLoader(this));
                this.registerLoader(new Loader(this), true);
                this.setRegion(new Region(this, null, this.options.defaultRegion));
                mapObj(Helpers, function(value, key) {
                    this.registerHelper(key, value);
                }, this);
            },

            registerLoader: function(loader, isDefault) {
                this.loaders[loader.name] = loader;
                if (isDefault) this.defaultLoader = loader;
            },

            registerHelper: function(name, fn) {
                var me = this;
                handlebars.registerHelper(name, function() {
                    var args = slice.call(arguments);
                    return fn.apply(this, [me, handlebars].concat(args));
                });
            },

            getLoader: function(name) {
                var loader = Loader.analyse(name).loader;
                return loader && this.loader[loader] ? this.loaders[loader] : this.defaultLoader;
            },

            setRegion: function(region) {
                this.region = region;
                this.regions.unshift(region);
            },

            load: function() {
                return chain(this, map(arguments, function(name) {
                    return this.getLoader(name).loadModule(name);
                }));
            },

            show: function(name, options) {
                return this.region.show(name, options);
            },

            destory: function() {
                this.off();
                return chain(this, map(this.regions, function(region) {
                    return region.close();
                }));
            },

            startRoute: function(defaultRoute) {
                var paths = slice.call(arguments, 1), router = this.router;
                if (!this.router) {
                    router = this.router = new Router(this);
                }
                return chain(this, router.mountRoutes.apply(router, paths), function() {
                    return router.start(defaultRoute);
                });
            },

            navigate: function(path, trigger) {
                return this.router.navigate(path, trigger);
            },

            dispatch: function(name, payload) {
                if (!payload) {
                    payload = name.payload;
                    name = name.name;
                }
                this.trigger('app.' + name, payload);
            },

            message: {
                success: function(title, content) { alert(content || title); },
                info: function(title, content) { alert(content || title); },
                error: function(title, content) { alert(content || title); }
            }
        });

        assign(Application.prototype, Event);
    })();


    Model = D.Model = function(app, module, options) {
        this.app = app;
        this.module = module;
        options || (options = {});
        this.params = assign({}, options.params);

        parent(Model).call(this, 'D', options);
        this.app.delegateEvent(this);
    };

    extend(Model, Base, {
        initialize: function() {
            this.data = this.options.data || {};
        },

        url: function() {
            return this.option('url') || '';
        },

        getFullUrl: function() {
            return Request.url(this);
        },

        getParams: function() {
            return assign({}, this.params);
        },

        set: function(data, trigger) {
            var parse = this.options.parse,
                d = D.isFunction(parse) ? parse.call(this, data) : data;

            this.data = this.options.root ? d[this.options.root] : d;
            if (trigger) this.changed();
            return this;
        },

        changed: function() { this.trigger('change'); },

        clear: function(trigger) {
            this.data = D.isArray(this.data) ? [] : {};
            if (trigger) this.changed();
            return this;
        }
    });

    assign(Model, Factory);


    Region = D.Region = function(app, module, el, name) {
        this.app = app;
        this.module = module;
        this.el = el;
        this.name = name || 'default';
        if (!el) this.error('The DOM element for region is not found');

        parent(Region).call(this, 'R');
    };

    extend(Region, Base, {
        isCurrent: function(item) {
            if (!this.current) return false;
            if (D.isObject(item) && item.id === this.current.id) return true;
            if (D.isString(item) && Loader.analyse(item).name === this.current.name) return true;

            return false;
        },

        show: function(item, options) {
            options || (options = {});
            if (this.isCurrent(item)) {
                if (options.forceRender === false) return this.Promise.resolve(this.current);
                return this.current.render();
            }

            if (D.isString(item)) item = this.app.getLoader(item).loadModule(item);
            return chain(this, item, function(obj) {
                if (!obj.render && !obj.setRegion) this.error('Can not render ' + obj);
                return obj;
            }, [function(obj) {
                return chain(this, obj.region && obj.region.close(), obj);
            }, function() {
                return this.close();
            }], function(arg) {
                var obj = arg[0], name = obj.module ? obj.module.name + ':' + obj.name : obj.name;
                this.current = obj;
                this.getElement().setAttribute('data-current', name);
                return obj.setRegion(this);
            }, function(obj) {
                return obj.render(options);
            });
        },

        close: function() {
            return chain(this, this.current && this.current.close(), delete this.current, this);
        },

        getElement: function() {
            return this.el;
        },

        $$: function(selector) { return this.el.querySelectorAll(selector); },

        empty: function() { this.el.innerHTML = ''; },

        delegateDomEvent: function(item, name, selector, fn) {
            var n = name + '.events' + this.id + item.id;
            Adapter.delegateDomEvent(this.el, n, selector, fn);
        },

        undelegateDomEvents: function(item) {
            Adapter.undelegateDomEvents(this.el, '.events' + this.id + item.id);
        }
    });

    assign(Region, Factory);


    View = D.View = function(name, mod, loader, options) {
        this.app = mod.app;
        this.name = name;
        this.module = mod;
        this.loader = loader;
        this.components = {};
        this.eventKeys = {};

        parent(View).call(this, 'V', options || {});
        this.eventHandlers = this.option('handlers') || {};
        this.app.delegateEvent(this);
    };

    extend(View, Base, {
        initialize: function() {
            if (this.options.mixin) this.mixin(this.options.mixin);
            this.loadedPromise = this.loadTemplate();
        },

        loadTemplate: function() {
            var template;
            if (this.module.separatedTemplate === true) {
                template = this.option('template') || this.name;
                return chain(this, this.app.getLoader(template)
                    .loadSeparatedTemplate(this, template), function(t) {
                    this.template = t;
                });
            }
            return chain(this, this.module.loadedPromise, function() {
                this.template = this.module.template;
            });
        },

        bindData: function() {
            return chain(this, this.module.loadedPromise, function() {
                var me = this, bind = me.option('bind') || {};
                this.data = {};

                mapObj(bind, function(value, key) {
                    var model = me.data[key] = me.module.store[key];
                    if (!model) me.error('No model:' + key);
                    if (value !== true) return;
                    me.listenTo(model, 'change', function() {
                        if (me.region) me.render(me.renderOptions);
                    });
                });
            });
        },

        unbindData: function() {
            this.stopListening();
            delete this.data;
        },

        getElement: function() {
            return this.region ? this.region.getElement(this) : null;
        },

        wrapDomId: function(id) { return this.id + id; },

        $: function(id) {
            return this.$$('#' + this.wrapDomId(id))[0];
        },

        $$: function(selector) {
            return this.getElement().querySelectorAll(selector);
        },

        setRegion: function(region) {
            this.region = region;
            this.virtualEl = this.getElement().cloneNode();
            this.bindEvents();
            this.bindActions();
            this.bindData();
            return this;
        },

        close: function() {
            if (!this.region) return this.Promise.resolve(this);

            return chain(this, function() {
                return this.option('beforeClose');
            }, this.beforeClose, [
                this.unbindEvents, this.unbindData, this.destroyComponents, function() {
                    return this.region.empty(this);
                }
            ], function() {
                return this.option('afterClose');
            }, this.afterClose, function() {
                delete this.region;
            }, this);
        },

        analyseEventKey: function(token) {
            var items, star, wid, id;
            if (this.eventKeys[token]) return this.eventKeys[token];

            items = token.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/);
            id = items[1];
            if (!id) this.error('Id is required');

            star = id.slice(-1) === '*';
            wid = this.wrapDomId(star ? id.slice(0, -1) : id);
            this.eventKeys[token] = [
                items[0], id, star, wid, star ? '[id^=' + wid + ']' : '#' + wid
            ];
            return this.eventKeys[token];
        },

        bindEvents: function() {
            var me = this, star, wid, items, handler;
            mapObj(me.option('events'), function(value, key) {
                if (!me.eventHandlers[value]) me.error('No event handler:' + value);
                items = me.analyseEventKey(key);
                star = items[2];
                wid = items[3];

                handler = function(e) {
                    var target = e.target || e.srcElement, args = [e];
                    if (Adapter.hasClass(target, me.app.options.disabledClass)) return;
                    if (star) args.unshift(target.getAttribute('id').slice(wid.length));
                    me.eventHandlers[value].apply(me, args);
                };

                me.delegateEvent(key, handler);
            });
        },

        bindActions: function() {
            mapObj(this.option('actions'), function(value, key) {
                if (D.isString(value)) this.delegateEvent(key, this.createActionEventHandler(value));
            }, this);
        },

        createActionEventHandler: function(name) {
            var me = this, el = me.getElement(),
                dataForAction = (me.option('dataForAction') || {})[name],
                disabled = me.app.options.disabledClass;

            return function(e) {
                var target, rootEl, data;
                rootEl = target = e.target || e.srcElement;
                if (Adapter.hasClass(target, disabled)) return;
                Adapter.addClass(target, disabled);

                while (rootEl && rootEl !== el && rootEl.tagName !== 'FORM') {
                    rootEl = rootEl.parentNode;
                }

                data = me.getActionData(rootEl, target);
                if (D.isFunction(dataForAction)) data = dataForAction.call(me, data, e);

                chain(me, data, function(d) {
                    if (d !== false) return me.module.dispatch(name, d);
                }, function() {
                    Adapter.removeClass(target, disabled);
                });
            };
        },

        getActionData: function(el, target) {
            var data, containsTarget = false, name, value, v;
            el || (el = this.getElement());
            data = el.tagName === 'FORM' ? Adapter.getFormData(el) : {};

            map(el.querySelectorAll('[data-name][data-value]'), function(item) {
                containsTarget = containsTarget || item === target;
                name = item.getAttribute('data-name');
                value = item.getAttribute('data-value');
                v = data[name];
                if (!v) {
                    data[name] = value;
                } else {
                    if (!D.isArray(v)) v = data[name] = [data[name]];
                    v.push(value);
                }
            });

            if (containsTarget) {
                name = target.getAttribute('data-name');
                data[name] = target.getAttribute('data-value');
            }

            return data;
        },

        delegateEvent: function(token, handler) {
            var items = this.analyseEventKey(token), name = items[0], selector = items[4];
            this.region.delegateDomEvent(this, name, selector, handler);
        },

        unbindEvents: function() {
            this.region.undelegateDomEvents(this);
        },

        render: function(options) {
            if (!this.region) this.error('Region is null');
            this.renderOptions = options || {};

            return chain(this, this.loadedPromise, this.destroyComponents, function() {
                return this.option('beforeRender');
            },
            this.beforeRender, this.serializeData, this.renderTemplate,
            this.renderComponent, this.afterRender, function() {
                return this.option('afterRender');
            }, this);
        },

        serializeData: function() {
            var data = {};
            mapObj(this.data, function(value, key) {
                data[key] = value.data;
            });
            mapObj(this.option('dataForTemplate'), function(value, key) {
                data[key] = value.call(this, data);
            }, this);
            data.Global = this.app.global;
            data.View = this;
            return data;
        },

        renderTemplate: function(data) {
            var used = {}, me = this, withHash, id;
            me.virtualEl.innerHTML = me.template(data);
            map(me.virtualEl.querySelectorAll('[id]'), function(item) {
                id = item.getAttribute('id');
                if (used[id]) me.error(id + ' already used');
                used[id] = true;
                item.setAttribute('id', me.wrapDomId(id));
            });

            map(me.app.options.attributesReferToId, function(attr) {
                map(me.virtualEl.querySelectorAll('[' + attr + ']'), function(item) {
                    id = item.getAttribute(attr);
                    withHash = id.charAt(0) === '#';
                    item.setAttribute(attr, withHash ? '#' + me.wrapDomId(id.slice(1)) : me.wrapDomId(id));
                });
            });

            me.updateDom();
        },

        updateDom: function() {
            this.getElement().innerHTML = this.virtualEl.innerHTML;
        },

        renderComponent: function() {
            return chain(this, map(this.option('components'), function(item) {
                if (D.isFunction(item)) item = item.call(this);
                return item ? View.ComponentManager.create(this, item) : null;
            }, this), function(components) {
                map(components, function(item) {
                    if (!item) return;
                    this.components[item.id] = item.component;
                }, this);
            });
        },

        destroyComponents: function() {
            mapObj(this.components, function(component, id) {
                View.ComponentManager.destroy(id, this, component);
            });

            this.components = {};
        },

        beforeClose: FN,
        beforeRender: FN,
        afterRender: FN,
        afterClose: FN
    });

    assign(View, Factory);

    View.ComponentManager = {
        handlers: {},
        componentCache: {},
        createDefaultHandler: Adapter.componentHandler(),

        register: function(name, creator, destructor) {
            this.handlers[name] = { creator: creator, destructor: destructor || FN };
        },

        create: function(view, options) {
            var me = this, handler, dom, id;
            if (!options || !options.name) view.error('Component name can not be null');

            handler = me.handlers[options.name] || me.createDefaultHandler(options.name);
            dom = options.selector ? view.$$(options.selector) : view.$(options.id);
            id = options.id || D.uniqueId('comp');

            return chain(view, handler.creator(view, dom, options.options), function(component) {
                me.componentCache[view.id + id] = { handler: handler, id: id, options: options.options };
                return { id: id, component: component };
            });
        },

        destroy: function(id, view, component) {
            var info = this.componentCache[view.id + id];
            delete this.componentCache[view.id + id];
            if (info.handler.destructor) info.handler.destructor(view, component, info.options);
        }
    };


    Module = D.Module = function(name, app, loader, options) {
        this.name = name;
        this.app = app;
        this.loader = loader;
        options || (options = {});

        this.separatedTemplate = options.separatedTemplate === true;
        parent(Module).call(this, 'M', options);

        this.app.modules[this.id] = this;
        this.actions = this.option('actions') || {};
        this.app.delegateEvent(this);
    };

    extend(Module, Base, {
        initialize: function() {
            if (this.options.mixin) this.mixin(this.options.mixin);
            this.loadedPromise = chain(this, [this.loadTemplate(), this.loadItems()]);

            this.initLayout();
            this.initStore();
            this.actionContext = assign({
                store: this.store
            }, Request);
        },

        initLayout: function() {
            var options = this.option('layout');
            this.layout = new Layout('layout', this, this.loader, options);
        },

        initStore: function() {
            this.store = {};
            this.autoLoadAfterRender = [];
            this.autoLoadBeforeRender = [];

            mapObj(this.option('store') || {}, function(value, name) {
                if (D.isFunction(value)) value = value.call(this) || {};
                if (value.autoLoad) {
                    (value.autoLoad === true ? this.autoLoadBeforeRender : this.autoLoadAfterRender).push(name);
                }
                this.store[name] = Model.create(value.type, this.app, this, value);
            }, this);
        },

        loadTemplate: function() {
            if (!this.separatedTemplate) {
                return chain(this, this.loader.loadTemplate(this), function(template) {
                    this.template = template;
                });
            }
        },

        loadItems: function() {
            var me = this;
            this.items = {};
            this.inRegionItems = {};

            return chain(me, mapObj(me.option('items') || {}, function(options, name) {
                var method;
                if (D.isFunction(options)) options = options.call(me);
                if (D.isString(options)) options = {region: options};

                method = options.isModule ? 'loadModule' : 'loadView';
                me.app.getLoader(name)[method](name, me, options).then(function(obj) {
                    obj.moduleOptions = options;
                    me.items[obj.name] = obj;
                    if (options.region) me.inRegionItems[options.region] = obj;
                });
            }));
        },

        setRegion: function(region) {
            this.region = region;
            return chain(this, function() {
                return this.layout.setRegion(region);
            }, function() {
                return this.layout.render();
            }, this.bindGlobalAction, this.initRegions, this);
        },

        bindGlobalAction: function() {
            var ctx = this.actionContext;
            mapObj(this.actions, function(value, key) {
                if (key.slice(0, 4) !== 'app.') return;
                this.listenTo(this.app, key, function(payload) {
                    value.call(ctx, payload);
                });
            });
        },

        close: function() {
            return chain(this, function() {
                return this.option('beforeClose');
            }, this.beforeClose, function() {
                return this.layout.close();
            }, this.closeRegions, this.afterClose, function() {
                return this.option('afterClose');
            }, function() {
                this.stopListening();
                delete this.app.modules[this.id];
                delete this.region;
                return this;
            });
        },

        render: function(options) {
            if (!this.region) this.error('region is null');
            this.renderOptions = options || {};

            return chain(this, this.loadedPromise, function() {
                return this.option('beforeRender');
            }, this.beforeRender, this.fetchDataBeforeRender, this.renderItems, this.afterRender, function() {
                return this.option('afterRender');
            }, this.fetchDataAfterRender, this);
        },

        closeRegions: function() {
            var regions = this.regions;
            delete this.regions;

            return chain(this, mapObj(regions, function(region) {
                return region.close();
            }));
        },

        initRegions: function() {
            var id, type;
            if (this.regions) this.closeRegions();
            this.regions = {};
            map(this.layout.$$('[data-region]'), function(item) {
                id = item.getAttribute('data-region');
                type = item.getAttribute('region-type');
                this.regions[id] = Region.create(type, this.app, this, item, id);
            }, this);
        },

        renderItems: function() {
            return chain(this, mapObj(this.inRegionItems, function(item, name) {
                if (!this.regions[name]) this.error('Region:' + name + ' is not defined');
                this.regions[name].show(item);
            }, this));
        },

        fetchDataBeforeRender: function() {
            return chain(this, map(this.autoLoadBeforeRender, function(item) {
                return Request.get(this.store[item]);
            }, this));
        },

        fetchDataAfterRender: function() {
            return chain(this, map(this.autoLoadAfterRender, function(item) {
                return Request.get(this.store[item]);
            }, this));
        },

        dispatch: function(name, payload) {
            var handler;
            if (!payload) {
                payload = name.payload;
                name = name.name;
            }

            handler = this.actions[name];
            if (!D.isFunction(handler)) this.error('No action handler for ' + name);
            return chain(this, function() {
                handler.call(this.actionContext, payload);
            });
        },

        beforeClose: FN,
        beforeRender: FN,
        afterRender: FN,
        afterClose: FN
    });

    Layout = Module.Layout = function() {
        parent(Layout).apply(this, arguments);
    };

    extend(Layout, View, {
        initialize: function() {
            this.isLayout = true;
            this.loadedPromise = this.loadTemplate();
        },

        bindActions: FN,
        bindData: FN
    });


    Loader = D.Loader = function(app) {
        this.app = app;
        this.name = 'loader';
        this.fileNames = app.options.fileNames;
        parent(Loader).call(this, 'L');
    };

    Loader.analyse = function(name) {
        var names, loader = null;
        if (!D.isString(name)) {
            return { loader: null, name: name };
        }

        names = name.split(':');
        if (names.length < 2) {
            name = names.shift();
        } else {
            loader = names.shift();
            name = names.shift();
        }

        return { loader: loader, name: name, args: names };
    };

    extend(Loader, Base, {
        loadResource: function(path) {
            path = compose(this.app.options.scriptRoot, path);
            return this.Promise.create(function(resolve, reject) {
                if (this.app.options.amd) {
                    require([path], function(obj) {
                        resolve(obj);
                    }, function(e) {
                        reject(e);
                    });
                } else {
                    resolve(require('./' + path));
                }
            });
        },

        loadModuleResource: function(mod, path) {
            return this.loadResource(compose(mod.name, path));
        },

        loadModule: function(path, parentModule) {
            var name = Loader.analyse(path).name;
            path = compose(name, this.fileNames.module);
            return chain(this, this.loadResource(compose(path)), function(options) {
                var mod = new Module(name, this.app, this, options);
                if (parentModule) mod.module = parentModule;
                return mod;
            });
        },

        loadView: function(name, mod) {
            var n = Loader.analyse(name).name, path = this.fileNames.view + n;
            return chain(this, this.loadModuleResource(mod, path), function(options) {
                options || (options = {});
                return View.create(options.type, n, mod, this, options);
            });
        },

        loadTemplate: function(mod) {
            return this.loadModuleResource(mod, this.fileNames.templates);
        },

        loadSeparatedTemplate: function(view, name) {
            return this.loadModuleResource(view.module, this.fileNames.template + name);
        },

        loadRouter: function(path) {
            var name = Loader.analyse(path).name;
            return this.loadResource(compose(name, this.fileNames.router));
        }
    });

    SimpleLoader = D.SimpleLoader = function() {
        parent(SimpleLoader).apply(this, arguments);
        this.name = 'simple';
    };

    extend(SimpleLoader, Loader, {
        loadModule: function(name, parentModule) {
            var n = Loader.analyse(name).name,
                mod = new Module(n, this.app, this, {separatedTemplate: true});

            if (parentModule) mod.module = parentModule;

            return this.Promise.resolve(mod);
        },

        loadView: function(name, mod) {
            name = Loader.analyse(name).name;
            return this.Promise.resolve(new View(name, mod, this, {}));
        }
    });


    (function() {
        var pushStateSupported = root.history && ('pushState' in root.history),
            routerRegexps = [
                /:([\w\d]+)/g, '([^\/]+)',
                /\*([\w\d]+)/g, '(.*)'
            ], Route;


        Route = function(app, router, path, fn) {
            var pattern = path.replace(routerRegexps[0], routerRegexps[1])
                .replace(routerRegexps[2], routerRegexps[3]);
            this.pattern = new RegExp('^' + pattern + '$', app.options.caseSensitiveHash ? 'g' : 'gi');

            this.app = app;
            this.router = router;
            this.path = path;
            this.fn = fn;
        };

        assign(Route.prototype, {
            match: function(hash) {
                this.pattern.lastIndex = 0;
                return this.pattern.test(hash);
            },

            handle: function(hash) {
                var me = this, p = me.router.Promise, args, handlers;
                me.pattern.lastIndex = 0;
                args = me.pattern.exec(hash).slice(1);

                handlers = me.router.getInterceptors(me.path);
                handlers.push(me.fn);

                return p.chain.apply(p, map(handlers, function(route, i) {
                    return function(prev) {
                        return route.apply(me.router, (i > 0 ? [prev].concat(args) : args));
                    };
                }));
            }
        });

        Router = D.Router = function(app) {
            this.app = app;
            this.routes = [];
            this.routeMap = {};
            this.interceptors = {};
            this.started = false;
            parent(Router).call(this, 'R');
        };

        extend(Router, Base, {
            initialize: function() {
                this.addRoute('/', this.app.options.defaultRouter || {});
            },

            getHash: function() {
                return root.location.hash.slice(1);
            },

            start: function(defaultPath) {
                var key, me = this, hash;
                if (me.started) return;
                me.started = true;
                key = pushStateSupported ? 'popstate.dr' : 'hashchange.dr';

                Adapter.delegateDomEvent(root, key, null, function() { me.dispatch(me.getHash()); });
                hash = me.getHash() || defaultPath;
                if (hash) me.navigate(hash);
            },

            stop: function() {
                Adapter.undelegateDomEvents(root, '.dr');
            },

            dispatch: function(hash) {
                var i, route;
                if (hash === this.previousHash) return;
                this.previousHash = hash;

                for (i = 0; i < this.routes.length; i++) {
                    route = this.routes[i];
                    if (route.match(hash)) {
                        route.handle(hash);
                        return;
                    }
                }
            },

            navigate: function(path, trigger) {
                trigger = trigger !== false;
                if (pushStateSupported) {
                    root.history.pushState({}, root.document.title, '#' + path);
                } else {
                    root.location.replace('#' + path);
                }

                if (trigger) this.dispatch(path);
            },

            mountRoutes: function() {
                var paths = slice.call(arguments), me = this;
                return chain(me, map(paths, function(path) {
                    return me.app.getLoader(path).loadRouter(path);
                }), function(routers) {
                    map(routers, function(router, i) { me.addRoute(paths[i], router); });
                }, this);
            },

            addRoute: function(path, router) {
                var routes = router.routes, interceptors = router.interceptors;
                if (D.isFunction(routes)) routes = routes.call(this);
                if (D.isFunction(interceptors)) interceptors = interceptors.call(this);

                mapObj(interceptors, function(value, key) {
                    this.interceptors[compose(path, key)] = router[value];
                }, this);

                mapObj(routes, function(value, key) {
                    this.routes.unshift(new Route(this.app, this, compose(path, key), router[value]));
                }, this);
            },

            getInterceptors: function(path) {
                var result = [], items = path.split('/'), key;

                items.pop();
                while (items.length > 0) {
                    key = items.join('/');
                    if (this.interceptors[key]) result.unshift(this.interceptors[key]);
                    items.pop();
                }

                if (this.interceptors['']) result.unshift(this.interceptors['']);
                return result;
            }
        });
    })();


    Helpers = D.Helpers = {
        layout: function(app, H, options) {
            return this.View.isLayout ? options.fn(this) : '';
        },

        view: function(app, H, name, options) {
            return !this.isLayout && this.View.name === name ? options.fn(this) : '';
        }
    };


    PageableModel = D.PageableModel = function() {
        var defaults = this.app.options.pagination;
        parent(PageableModel).apply(this, arguments);

        this.pagination = {
            page: this.options.page || 1,
            pageCount: 0,
            pageSize: this.options.pageSize || defaults.pageSize,
            pageKey: this.options.pageKey || defaults.pageKey,
            pageSizeKey: this.options.pageSizeKey || defaults.pageSizeKey,
            recordCountKey: this.options.recordCountKey || defaults.recordCountKey
        };
    };

    extend(PageableModel, Model, {
        initialize: function() {
            this.data = this.options.data || [];
        },

        set: function(data) {
            var p = this.pagination;
            data || (data = {});
            p.recordCount = data[p.recordCountKey] || 0;
            p.pageCount = Math.ceil(p.recordCount / p.pageSize);
            PageableModel.__super__.set.call(this, data);
        },

        getParams: function() {
            var params = PageableModel.__super__.getParams.call(this) || {},
                p = this.pagination;
            params[p.pageKey] = p.page;
            params[p.pageSizeKey] = p.pageSize;

            return params;
        },

        clear: function() {
            this.pagination.page = 1;
            this.pagination.recordCount = 0;
            this.pagination.pageCount = 0;
            PageableModel.__super__.clear.call(this);
        },

        turnToPage: function(page) {
            if (page <= this.pagination.pageCount || page >= 1) this.pagination.page = page;
            return this;
        },

        firstPage: function() { return this.turnToPage(1); },
        lastPage: function() { this.turnToPage(this.pagination.pageCount); },
        nextPage: function() { this.turnToPage(this.pagination.page + 1); },
        prevPage: function() { this.turnToPage(this.pagination.page - 1); },

        getPageInfo: function() {
            var p = this.pagination, d;
            if (this.data.length > 0) {
                d = {
                    page: p.page, start: (p.page - 1) * p.pageSize + 1,
                    end: p.page * p.pageSize, total: p.recordCount
                };
            } else {
                d = { page: p.page, start: 0, end: 0, total: 0 };
            }

            if (d.end > d.total) d.end = d.total;
            return d;
        }
    });

    Model.register('pageable', PageableModel);


    MultiRegion = D.MultiRegion = function() {
        parent(MultiRegion).apply(this, arguments);
        this.items = {};
        this.elements = {};
    };

    extend(MultiRegion, Region, {
        activate: FN,

        createElement: function() {
            var el = root.document.createElement('div');
            this.el.appendChild(el);
            return el;
        },

        getKey: function(item) {
            var key = null;
            if (item.moduleOptions) key = item.moduleOptions.key;
            if (!key && item.renderOptions) key = item.renderOptions.key;
            if (!key) this.error('Region key is require');

            return key;
        },

        getElement: function(item) {
            var key;
            if (!item) return this.el;
            key = this.getKey(item);

            this.items[key] = item;
            this.elements[key] || (this.elements[key] = this.createElement(key, item));
            return this.elements[key];
        },

        empty: function(item) {
            var el;
            if (item) {
                el = this.getElement(item);
                el.parentNode.removeChild(el);
            } else {
                this.el.innerHTML = '';
            }
        },

        close: function() {
            var items = this.items;
            delete this.current;
            this.elements = {};
            this.items = {};

            return chain(this, mapObj(items, function(item) {
                return item.close();
            }));
        }
    });


    return Drizzle;
});
