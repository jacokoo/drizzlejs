Model = D.Model = function(app, module, options) {
    this.app = app;
    this.module = module;
    options || (options = {});
    this.idKey = options.idKey || app.options.idKey;
    this.params = assign({}, options.params);

    parent(Model).call(this, 'D', options);
    this.app.delegateEvent(this);
};

extend(Model, Base, {
    initialize: function() {
        this.data = this.options.data || {};
    },

    url: function() {
        return this.option('url') || '';
    },

    getFullUrl: function() {
        return Request.url(this);
    },

    getParams: function() {
        return assign({}, this.params);
    },

    set: function(data, trigger) {
        var parse = this.options.parse,
            d = D.isFunction(parse) ? parse.call(this, data) : data;

        this.data = this.options.root ? d[this.options.root] : d;
        if (trigger) this.changed();
        return this;
    },

    get: function(cloneIt) {
        return cloneIt ? clone(this.data) : this.data;
    },

    changed: function() { this.trigger('change'); },

    clear: function(trigger) {
        this.data = D.isArray(this.data) ? [] : {};
        if (trigger) this.changed();
        return this;
    }
});

assign(Model, Factory);
