D.Model = class Model extends D.Base {
    constructor (store, options) {
        super('Model', options, {
            app: store.module.app,
            module: store.module,
            store,
            _data: this._option('data') || {},
            _idKey: this._option('idKey') || app.options.idKey,
            _params: Object.assign({}, this._option('params'))
        });
        app.delegateEvent(this);
    }

    get fullUrl () { return D.Request._url(this); }

    get params () { return this._params; }

    get data () { return this._data; }

    set (data, trigger) {
        data = this._option('parse', data);
        this._data = this.options.root ? data[this.options.root] : data;
        if (trigger) this.changed();
    }

    get (cloneIt) {
        return cloneIt ? clone(this._data) : this._data;
    }

    clear (trigger) {
        this._data = D.isArray(this._data) ? [] : {};
        if (trigger) this.changed();
    }

    changed () { this.trigger('changed'); }

    _url () {
        return this._option('url') || '';
    }
};
