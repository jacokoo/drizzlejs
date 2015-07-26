Region = D.Region = function(app, module, el, name) {
    this.app = app;
    this.module = module;
    this.el = el;
    this.name = name || 'default';
    if (!el) this.error('The DOM element for region is not found');

    parent(Region).call(this, 'R');
};

extend(Region, Base, {
    isCurrent: function(item) {
        if (!this.current) return false;
        if (D.isObject(item) && item.id === this.current.id) return true;
        if (D.isString(item) && Loader.analyse(item).name === this.current.name) return true;

        return false;
    },

    show: function(item, options) {
        options || (options = {});
        if (this.isCurrent(item)) {
            if (options.forceRender === false) return this.Promise.resolve(this.current);
            return this.current.render(options);
        }

        if (D.isString(item)) item = this.app.getLoader(item).loadModule(item);
        return chain(this, item, function(obj) {
            if (!obj.render && !obj.setRegion) this.error('Can not render ' + obj);
            return obj;
        }, [function(obj) {
            return chain(this, obj.region && obj.region.close(), obj);
        }, function() {
            return this.close();
        }], function(arg) {
            var obj = arg[0], name = obj.module ? obj.module.name + ':' + obj.name : obj.name;
            this.current = obj;
            this.getElement().setAttribute('data-current', name);
            return obj.setRegion(this);
        }, function(obj) {
            return obj.render(options);
        });
    },

    close: function() {
        return chain(this, this.current && this.current.close(), delete this.current, this);
    },

    getElement: function() {
        return this.el;
    },

    $$: function(selector) { return this.el.querySelectorAll(selector); },

    empty: function() { this.el.innerHTML = ''; },

    delegateDomEvent: function(item, name, selector, fn) {
        var n = name + '.events' + this.id + item.id;
        Adapter.delegateDomEvent(this.el, n, selector, fn);
    },

    undelegateDomEvents: function(item) {
        Adapter.undelegateDomEvents(this.el, '.events' + this.id + item.id);
    }
});

assign(Region, Factory);
