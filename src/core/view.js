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
                if (!value) return;
                me.listenTo(model, 'change', function() {
                    if (value === true && me.region) me.render(me.renderOptions);
                    if (D.isString(value)) me.option(value);
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
        return chain(this, this.bindData, this);
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
        var me = this;
        mapObj(me.option('events'), function(value, key) {
            var star, wid, items, handler;
            if (!me.eventHandlers[value]) me.error('No event handler:' + value);
            items = me.analyseEventKey(key);
            star = items[2];
            wid = items[3];

            handler = function(e) {
                var target = Adapter.getEventTarget(e), args = [e];
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
            actionCallback = (me.option('actionCallbacks') || {})[name],
            disabled = me.app.options.disabledClass;

        return function(e) {
            var target, rootEl, data;
            rootEl = target = Adapter.getEventTarget(e);
            if (Adapter.hasClass(target, disabled)) return;
            Adapter.addClass(target, disabled);

            while (rootEl && rootEl !== el && rootEl.tagName !== 'FORM') {
                rootEl = rootEl.parentNode;
            }

            data = me.getActionData(rootEl, target);
            if (D.isFunction(dataForAction)) data = dataForAction.call(me, data, e);

            chain(me, data, function(d) {
                if (d !== false) return me.module.dispatch(name, d);
                return false;
            }, function(d) {
                if (d !== false) return actionCallback && actionCallback.call(this, d);
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
            data[key] = value.get(true);
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
        }, this);

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

    register: function(name, creator, destructor) {
        this.handlers[name] = { creator: creator, destructor: destructor || FN };
    },

    create: function(view, options) {
        var me = this, handler, dom, id;
        if (!options || !options.name) view.error('Component name can not be null');

        handler = me.handlers[options.name] || Adapter.componentHandler(options.name);
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
