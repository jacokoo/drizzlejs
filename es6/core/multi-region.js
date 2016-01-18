D.MultiRegion = class MultiRegion extends D.Region {
    _initialize () {
        this._items = {};
        this._elements = {};
    }

    activate () {}

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
    }

    _createElement () {
        const el = root.document.createElement('div');
        this._el.appendChild(el);
        return el;
    }

    _getElement (item, key) {
        if (!item) return this._el;
        const k = key || item.renderOptions.key || item.moduleOptions.key;
        if (!this._elements[k]) this._elements[k] = this._createElement(k, item);
        return this._elements[k];
    }

    _isCurrent (key, item, renderable) {
        if (!item) return false;
        return item.name === renderable || (renderable && renderable.id === item.id);
    }

    _empty (item) {
        if (!item) {
            super._empty();
            return;
        }

        const el = this._getElement(item);
        el.parentNode.removeChild(el);
    }

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
};
