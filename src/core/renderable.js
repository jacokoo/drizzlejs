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
