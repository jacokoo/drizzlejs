D.Region = class Region extends Base {

    constructor (parent, name, defs) {
        super(parent, name, null, defs);

        this._el = parent.$(defs.id);
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
        this.destroy();

        this._current = renderable;
        this._element.setAttribute('data-current', renderable._name);
        renderable._setRegion(this);
        renderable._render(state, false);

        if (renderable instanceof Module) renderable.dispatch(STATE_INIT_ACTION);

        this.addDisposable(() => {
            this._current.destroy();
            delete this._current;
        });
    }

    _update () {
        if (!this._current) return;

        const el = this._parent.$(this._def('id'));
        if (el !== this._el) this._el = el;
        if (this._el === null) return;

        this._current.render();
    }

    get _element () {
        return this._el;
    }
};
