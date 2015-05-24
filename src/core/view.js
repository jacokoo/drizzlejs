D.View = function(name, module, loader, options) {
    this.app = module.app;
    this.name = name;
    this.module = module;
    this.loader = loader;
    this.components = {};
    this.eventKeys = {};

    D.View.__super__.constructor.call(this, 'V', options || {});
    this.eventHandlers = this.option('handlers') || {};
    this.app.delegateEvent(this);
};

D.extend(D.View, D.Base, {
    initialize: function() {
        if (this.options.mixin) this.mixin(this.options.mixin);
        this.loadedPromise = this.loadTemplate();
    },

    loadTemplate: function() {
        var template;
        if (this.module.separatedTemplate === true) {
            template = this.option('template') || this.name;
            return this.Promise.chain(this.app.getLoader(template)
                .loadSeparatedTemplate(this, template), function(t) {
                this.template = t;
            });
        }
        return this.Promise.chain(this.module.loadedPromise, function() {
            this.template = this.module.template;
        });
    },

    bindData: function() {
        return this.Promise.chain(this.module.loadedPromise, function() {
            var bind = this.option('bind') || {}, me = this;
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

        return this.Promise.chain(function() {
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
        mapObj(this.option('events'), function(value, key) {
            var star, wid, items, handler, me = this;

            if (!me.eventHandlers[value]) me.error('No event handler:' + value);
            items = me.analyseEventKey(key);
            star = items[2];
            wid = items[3];

            handler = function(e) {
                var target = e.target || e.srcElement, args = [e];
                if (A.hasClass(target, me.app.options.disabledClass)) return;
                if (star) args.unshift(target.getAttribute('id').slice(wid.length));
                me.eventHandlers[value].apply(me, args);
            };

            me.delegateEvent(key, handler);
        }, this);
    },

    bindActions: function() {
        mapObj(this.option('actions'), function(value, key) {
            if (D.isString(value)) this.delegateEvent(key, this.createActionEventHandler(value));
        }, this);
    },

    createActionEventHandler: function(name) {
        var el = this.getElement(), me = this,
            dataForAction = (this.option('dataForAction') || {})[name],
            disabled = this.app.options.disabledClass;

        return function(e) {
            var target, rootEl, data;
            rootEl = target = e.target || e.srcElement;
            if (A.hasClass(target, disabled)) return;
            A.addClass(target, disabled);

            while (rootEl && rootEl !== el && rootEl.tagName !== 'FORM') {
                rootEl = rootEl.parentNode;
            }

            data = me.getActionData(rootEl, target);
            if (D.isFunction(dataForAction)) data = dataForAction.call(me, data, e);

            me.Promise.chain(data, function(d) {
                if (d !== false) return me.module.dispatch(name, d);
            }, function() {
                A.removeClass(target, disabled);
            });
        };
    },

    getActionData: function(el, target) {
        var data, containsTarget = false, name, value, v;
        el || (el = this.getElement());
        data = el.tagName === 'FORM' ? A.getFormData(el) : {};

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

        return this.Promise.chain(this.loadedPromise, this.destroyComponents, function() {
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
        var used = {}, id, me = this, withHash;
        this.virtualEl.innerHTML = this.template(data);
        map(this.virtualEl.querySelectorAll('[id]'), function(item) {
            id = item.getAttribute('id');
            if (used[id]) me.error(id + ' already used');
            used[id] = true;
            item.setAttribute('id', me.wrapDomId(id));
        });

        map(this.app.options.attributesReferToId, function(attr) {
            map(me.virtualEl.querySelectorAll('[' + attr + ']'), function(item) {
                id = item.getAttribute(attr);
                withHash = id.charAt(0) === '#';
                item.setAttribute(attr, withHash ? '#' + me.wrapDomId(id.slice(1)) : me.wrapDomId(id));
            });
        });

        this.updateDom();
    },

    updateDom: function() {
        this.getElement().innerHTML = this.virtualEl.innerHTML;
    },

    renderComponent: function() {
        return this.Promise.chain(map(this.option('components'), function(item) {
            if (D.isFunction(item)) item = item.call(this);
            return item ? D.View.ComponentManager.create(this, item) : null;
        }, this), function(components) {
            map(components, function(item) {
                if (!item) return;
                this.components[item.id] = item.component;
            }, this);
        });
    },

    destroyComponents: function() {
        mapObj(this.components, function(component, id) {
            D.View.ComponentManager.destroy(id, this, component);
        });

        this.components = {};
    },

    beforeClose: FN,
    beforeRender: FN,
    afterRender: FN,
    afterClose: FN
});

D.assign(D.View, D.Factory);

D.View.ComponentManager = {
    handlers: {},
    componentCache: {},
    createDefaultHandler: A.componentHandler(),

    register: function(name, creator, destructor) {
        this.handlers[name] = { creator: creator, destructor: destructor || FN };
    },

    create: function(view, options) {
        var handler, dom, id, me = this;
        if (!options || !options.name) this.error('Component name can not be null');

        handler = this.handlers[options.name] || this.createDefaultHandler(options.name);
        dom = options.selector ? view.$$(options.selector) : view.$(options.id);
        id = options.id || D.uniqueId('comp');

        return view.Promise.chain(handler.creator(view, dom, options.options), function(component) {
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
