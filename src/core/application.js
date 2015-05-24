(function() {
    var defaultOptions = {
        scriptRoot: 'app',
        urlRoot: '',
        urlSuffix: '',
        caseSensitiveHash: false,
        defaultRegion: root.document.body,
        disabledClass: 'disabled',
        attributesReferToId: ['for', 'data-target', 'data-parent'],

        fileNames: {
            module: 'index',
            templates: 'templates',
            view: 'view-',
            template: 'template-',
            router: 'router'
        },

        pagination: {
            pageSize: 10,
            pageKey: '_page',
            pageSizeKey: '_pageSize',
            recordCountKey: 'recordCount'
        }
    };

    D.Application = function(options) {
        var opt = D.assign({}, defaultOptions, options);
        this.modules = {};
        this.global = {};
        this.loaders = {};
        this.regions = [];

        D.Application.__super__.constructor.call(this, 'A', opt);
    };

    D.extend(D.Application, D.Base, {
        initialize: function() {
            this.registerLoader(new D.SimpleLoader(this));
            this.registerLoader(new D.Loader(this), true);
            this.setRegion(new D.Region(this, null, this.options.defaultRegion));
            mapObj(D.Helpers, function(value, key) {
                this.registerHelper(key, value);
            }, this);
        },

        registerLoader: function(loader, isDefault) {
            this.loaders[loader.name] = loader;
            if (isDefault) this.defaultLoader = loader;
        },

        registerHelper: function(name, fn) {
            var me = this;
            handlebars.registerHelper(name, function() {
                var args = slice.call(arguments);
                return fn.apply(this, [me, handlebars].concat(args));
            });
        },

        getLoader: function(name) {
            var loader = D.Loader.analyse(name).loader;
            return loader && this.loader[loader] ? this.loaders[loader] : this.defaultLoader;
        },

        setRegion: function(region) {
            this.region = region;
            this.regions.unshift(region);
        },

        load: function() {
            return this.Promise.chain(map(arguments, function(name) {
                return this.getLoader(name).loadModule(name);
            }));
        },

        show: function(name, options) {
            return this.region.show(name, options);
        },

        destory: function() {
            this.off();
            return this.Promise.chain(map(this.regions, function(region) {
                return region.close();
            }));
        },

        startRoute: function(defaultRoute) {
            var paths = slice.call(arguments, 1), router = this.router;
            if (!this.router) {
                router = this.router = new D.Router(this);
            }
            return this.Promise.chain(router.mountRoutes.apply(router, paths), function() {
                return router.start(defaultRoute);
            });
        },

        navigate: function(path, trigger) {
            return this.router.navigate(path, trigger);
        },

        dispatch: function(name, payload) {
            if (!payload) {
                payload = name.payload;
                name = name.name;
            }
            this.trigger('app.' + name, payload);
        },

        message: {
            success: function(title, content) { alert(content || title); },
            info: function(title, content) { alert(content || title); },
            error: function(title, content) { alert(content || title); }
        }
    });

    D.assign(D.Application.prototype, D.Event);
})();
