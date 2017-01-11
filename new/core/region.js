D.Region = class Region extends Base {

    constructor (parent, name, defs, el) {
        super(parent, name, null, defs);

        this._el = el;
    }

    _show (renderable, state, noRender) {
        let r = renderable;

        if (this._current && isString(r) && this._current.name === r) {
            if (noRender === true) return Promise.resolve(this._current);
            r = this._current;
        }

        if (!isString(r)) {
            this.show(r, state, noRender);
            return Promise.resolve(r);
        }

        return Loader._createModule(this._parent, r).then(function(mod) {
            this.show(mod, state, noRender);
            return mod;
        });
    }

    show (renderable, state, noRender) {
        if (!(renderable instanceof Renderable)) {
            throw new Error(`${this._name}: Only Renderable can be show.`);
        }

        if (renderable === this._current) {
            if (noRender !== true) this._current._render(state, true);
            return;
        }

        renderable._region && renderable._region.close();
        this._current && this._current.close();

        this._current = renderable;
        this._element.setAttribute('data-current', renderable._name);
        renderable._region = this;
        renderable._render(state, false);
    }

    close () {
        this._current && this._current._close();
        delete this._current;
    }

    get _element () {
        return this._el;
    }
};
