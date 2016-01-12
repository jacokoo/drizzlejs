D.Renderable = class Renderable extends D.Base {
    constructor (name, app, mod, loader, options) {
        super(name, options, {
            app,
            module: mod,
            components: {},
            _loader: loader,
            _componentMap: {},
            _events: {}
        });
        this._eventHandlers = this._option('handlers');
        this._templateEngine = this._option('templateEngine') || mod && mod._templateEngine || app._templateEngine;
        app.delegateEvent(this);
    }

    _initialize () {
        return this.chain(
            [this._templateEngine._load(this), this._initializeEvents()],
            ([template]) => this._template = template
        );
    }

    render (options) {
        return this._render(options, true);
    }

    $ (id) {
        return this.$$('#' + this._wrapDomId(id))[0];
    }

    $$ (selector) {
        return this._element.querySelectorAll(selector);
    }

    _render (options = {}, update) {
        if (!this.region) this.error('Region is null');

        this.renderOptions = options;
        return this.chain(
            this._loadedPromise,
            this._destroyComponents,
            () => this.trigger('beforeRender'),
            () => this._option('beforeRender'),
            this._beforeRender,
            this._serializeData,
            this._renderTemplate,
            this._renderComponents,
            this._afterRender,
            () => this._option('afterRender'),
            () => this.trigger('afterRender'),
            this
        );
    }

    _setRegion (region) {
        this._region = region;
        this._bindEvents();
    }

    _close () {
        if (!this._region) return this.Promise.resolve(this);

        return this.chain(
            () => this.trigger('beforeClose'),
            () => this._option('beforeClose'),
            this._beforeClose,
            [this._unbindEvents, this.destroyComponents, () => this._region._empty(this)],
            this._afterClose,
            () => this._option('afterClose'),
            () => this.trigger('afterClose'),
            () => delete this._region,
            this
        );
    }

    get _element () {
        return this._region ? this._region.getElement(this) : null;
    }

    _serializeData () {
        return {
            Global: this.app.global,
            Self: this
        };
    }

    _renderTemplate (data) {
        this._templateEngine._execute(this, data, this._template);
    }

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
    }

    _createEventHandler (handlerName, { haveStar, id }) {
        const { disabledClass } = this.app.options;
        return (event) => {
            if (!this._eventHandlers[handlerName]) this._error('No event handler for name:', handlerName);

            const target = D.Adapter.getEventTarget(event), args = [event];
            if (D.Adapter.hasClass(target, disabledClass)) return;
            if (haveStar) args.unshift(target.getAttribute('id').slice(id.length));
            this._eventHandlers[handlerName].apply(this, args);
        };
    }

    _bindEvents () {
        mapObj(this._events, (value) => {
            this._region._delegateDomEvent(this, value.eventType, value.selector, value.handler);
        });
    }

    _unbindEvents () {
        this._region._undelegateDomEvents(this);
    }

    _renderComponents () {
        this.chain(map(this._option('components'), (item) => {
            const i = D.isFunction(item) ? item.call(this) : item;
            return i ? D.ComponentManager.create(this, i) : null;
        }), (components) => map(components, (item) => {
            if (!item) return;
            const { id, component, index } = item, value = this.components[id];
            D.isArray(value) ? value.push(component) : (this.components[id] = value ? [value, component] : component);
            this._componentMap[index] = item;
        }));
    }

    _destroyComponents () {
        this.components = {};
        mapObj(this._componentMap, (value) => D.ComponentManager.destroy(this, value));
    }

    _wrapDomId (id) {
        return this.id + id;
    }

    _beforeRender () {}
    _afterRender () {}
    _beforeClose () {}
    _afterClose () {}
};
