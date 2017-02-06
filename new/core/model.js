D.Model = class Model extends Base {

    _initialize () {
        this.data = clone(this._def('data')) || {};
        this.params = clone(this._def('params')) || {};

        this._bindings = {};
    }

    set (data, trigger) {
        const d = (this._defs.parse || (s => s)).call(this, data) || {};
        this.data = this._defs.root ? d[this._defs.root] : d;
        if (trigger) this.changed();
    }

    clear (trigger) {
        this.data = isArray(this.data) ? [] : {};
        if (trigger) this.changed();
    }

    changed () {
        mapObj(this._bindings, v => this._doUpdateBinding(v));
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
        return d;
    }

    _doUpdateBinding (binding) {
        binding.data = clone(this.data);
    }

    _removeBinding(id) {
        delete this._bindings[id];
    }

};
