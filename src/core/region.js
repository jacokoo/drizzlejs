D.Region = function(app, module, el, name) {
    this.app = app;
    this.module = module;
    this.el = el;
    this.name = name || 'default';
    if (!el) this.error('The DOM element for region is not found');

    D.Region.__super__.constructor.call(this, 'R');
};

D.extend(D.Region, D.Base, {
    isCurrent: function(item) {
        if (!this.current) return false;
        if (D.isObject(item) && item.id === this.current.id) return true;
        if (D.isString(item) && D.Loader.analyse(item).name === this.current.name) return true;

        return false;
    },

    show: function(item, options) {
        options || (options = {});
        if (this.isCurrent(item)) {
            if (options.forceRender === false) return this.Promise.resolve(this.current);
            return this.current.render();
        }

        if (D.isString(item)) item = this.app.getLoader(item).loadModule(item);
        return this.Promise.chain(item, function(obj) {
            if (!obj.render && !obj.setRegion) this.error('Can not render ' + obj);
            return obj;
        }, [function(obj) {
            return this.Promise.chain(obj.region && obj.region.close(), obj);
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
        return this.Promise.chain(this.current && this.current.close(), delete this.current, this);
    },

    getElement: function() {
        return this.el;
    },

    $$: function(selector) { return this.el.querySelectorAll(selector); },

    empty: function() { this.el.innerHTML = ''; },

    delegateDomEvent: function(item, name, selector, fn) {
        var n = name + '.events' + this.id + item.id;
        A.delegateDomEvent(this.el, n, selector, fn);
    },

    undelegateDomEvents: function(item) {
        A.undelegateDomEvents(this.el, '.events' + this.id + item.id);
    }
});

D.assign(D.Region, D.Factory);
