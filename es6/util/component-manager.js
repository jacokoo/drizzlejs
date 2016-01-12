D.ComponentManager = {
    _handlers: {},
    _componentCache: {},

    setDefaultHandler (creator, destructor = EMPTY) {
        this._defaultHandler = { creator, destructor };
    },

    register (name, creator, destructor) {
        this.handlers[name] = { creator, destructor: destructor || EMPTY };
    },

    _create (renderable, options) {
        const { name, id, selector, options: opt } = options;
        if (!name) renderable.error('Component name can not be null');

        const handler = this._handlers[name] || this._defaultHandler;
        if (!handler) renderable.error('No handler for component:', name);

        const dom = selector ? renderable.$$(selector) : renderable.$(id);
        const uid = id ? id : D.uniqueId('comp');

        return renderable.chain(handler.creator(renderable, dom, opt), (component) => {
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
