D.Region = class Region extends D.Base {
    constructor (mod, el, name) {
        super(name || 'Region', {
            app: mod.app,
            _el: el,
            module: mod
        });

        if (!this._el) this.error('The DOM element for region is required');
    }

    show (renderable, options = {}) {
        if (this._isCurrent(renderable)) {
            if (renderable.forceRender === false) return this.Promise.resolve(this._current);
            return this._current._render(options, true);
        }

        return this.chain(
            D.isString(renderable) ? this.app._createModule(renderable) : renderable,
            (item) => {
                if (!(item instanceof D.Renderable)) this.error('The item is expected to be an instance of Renderable');
                return item;
            }, [
                (item) => this.chain(item._region && item._region.close(), item),
                () => this.close()
            ],
            ([item]) => {
                this._current = item;
                const attr = item.module ? `${item.module.name}:${item.name}` : item.name;
                this._getElement().setAttribute('data-current', attr);
                return item._setRegion(this);
            },
            (item) => item._render(options, false)
        );
    }

    close () {
        return this.chain(
            this._current && this._current.close(),
            () => delete this._current,
            this
        );
    }

    $$ (selector) {
        return this._getElement().querySelectorAll(selector);
    }

    _isCurrent (renderable) {
        if (!this._current) return false;
        if (this._current.name === renderable) return true;
        if (renderable && renderable.id === this._current.id) return true;
        return false;
    }

    _getElement () {
        return this._el;
    }

    _empty () {
        this._getElement().innerHTML = '';
    }

    _delegateDomEvent (renderable, name, selector, fn) {
        D.Adapter.delegateDomEvent(this, renderable, name, selector, fn);
    }

    _undelegateDomEvents (renderable) {
        D.Adapter.undelegateDomEvents(this, renderable);
    }
};
