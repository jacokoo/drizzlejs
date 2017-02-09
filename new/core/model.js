D.Model = class Model extends Base {

    _initialize () {
        this.data = clone(this._def('data')) || {};
        this.params = clone(this._def('params')) || {};

        this._bindings = {};
    }

    set (data, slient) {
        const d = (this._defs.parse || (s => s)).call(this, data) || {};
        this.data = this._defs.root ? d[this._defs.root] : d;
        if (!slient) this.changed();
    }

    clear (slient) {
        this.data = isArray(this.data) ? [] : {};
        if (!slient) this.changed();
    }

    changed () {
        this._doUpdateBinding();
        this._changed = true;
    }

    _getBinded () {
        const result = [];
        if (!this._changed) return result;

        this._changed = false;
        mapObj(this._bindings, v => result.push(v._renderable));
        return result;
    }

    _createBinding (renderable) {
        const d = { _renderable: renderable };
        mapObj(this._def('mixin'), (value, key) => d[key] = value);
        this._doUpdateBinding(d);
        this._bindings[renderable.id] = d;

        this.addDisposable(() => {
            delete this._bindings[renderable.id];
        });
        return d;
    }

    _doUpdateBinding (binding) {
        const data = clone(this.data);
        const fn = v => v.data = data;

        binding ? fn(binding) : mapObj(this._bindings, fn);
    }

    _removeBinding(id) {
        delete this._bindings[id];
    }

};
