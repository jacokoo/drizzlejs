D.Model = function(app, module, options) {
    this.app = app;
    this.module = module;
    options || (options = {});
    this.params = D.assign({}, options.params);

    D.Model.__super__.constructor.call(this, 'D', options);
    this.app.delegateEvent(this);
};

D.extend(D.Model, D.Base, {
    initialize: function() {
        this.data = this.options.data || {};
    },

    url: function() {
        return this.option('url') || '';
    },

    getFullUrl: function() {
        return D.Request.url(this);
    },

    getParams: function() {
        return D.assign({}, this.params);
    },

    set: function(data, trigger) {
        var parse = this.options.parse,
            d = D.isFunction(parse) ? parse.call(this, data) : data;

        this.data = this.options.root ? d[this.options.root] : d;
        if (trigger) this.changed();
        return this;
    },

    changed: function() { this.trigger('change'); },

    clear: function(trigger) {
        this.data = D.isArray(this.data) ? [] : {};
        if (trigger) this.changed();
        return this;
    }
});

D.assign(D.Model, D.Factory);
