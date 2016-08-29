D.Model = function Model (store, options) {
    D.Model.__super__.constructor.call(this, 'Model', options, {
        app: store.module.app,
        module: store.module,
        store
    });

    this.data = clone(this._option('data'));
    this._idKey = this._option('idKey') || this.app.options.idKey;
    this.params = assign({}, this._option('params'));
    this.app.delegateEvent(this);
};

D.extend(D.Model, D.Base, {
    getFullUrl () { return D.Request._url(this); },

    set (data, trigger) {
        const d = this.options.parse ? this._option('parse', data) : data;
        this.data = this.options.root ? d[this.options.root] : d;
        if (trigger) this.changed();
    },

    getParams () { return this.params; },

    get (cloneIt) {
        return cloneIt ? clone(this.data) : this.data;
    },

    clear (trigger) {
        this.data = D.isArray(this.data) ? [] : {};
        if (trigger) this.changed();
    },

    changed () { this.trigger('changed'); },

    _url () {
        return this._option('url') || '';
    }
});
