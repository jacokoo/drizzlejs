D.Model = class Model extends D.Base {
    constructor (store, options) {
        super('Model', options, {
            app: store.module.app,
            module: store.module,
            store
        });

        this._data = this._option('data') || {};
        this._idKey = this._option('idKey') || this.app.options.idKey;
        this._params = Object.assign({}, this._option('params'));
        this.app.delegateEvent(this);
    }

    get fullUrl () { return D.Request._url(this); }

    get params () { return this._params; }

    get data () { return this._data; }

    set (data, trigger) {
        const d = this._option('parse', data);
        this._data = this.options.root ? d[this.options.root] : d;
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
