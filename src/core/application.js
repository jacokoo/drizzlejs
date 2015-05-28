(function() {
    var defaultOptions = {
        scriptRoot: 'app',
        urlRoot: '',
        urlSuffix: '',
        caseSensitiveHash: false,
        defaultRegion: root.document.body,
        disabledClass: 'disabled',
        attributesReferToId: ['for', 'data-target', 'data-parent'],
        getResource: null,

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

    Application = Drizzle.Application = function(options) {
        var opt = assign({}, defaultOptions, options);
        this.modules = {};
        this.global = {};
        this.loaders = {};
        this.regions = [];

        parent(Application).call(this, 'A', opt);
    };

    extend(Application, Base, {
        initialize: function() {
            this.registerLoader(new SimpleLoader(this));
            this.registerLoader(new Loader(this), true);
            this.setRegion(new Region(this, null, this.options.defaultRegion));
            mapObj(Helpers, function(value, key) {
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
            var loader = Loader.analyse(name).loader;
            return loader && this.loader[loader] ? this.loaders[loader] : this.defaultLoader;
        },

        setRegion: function(region) {
            this.region = region;
            this.regions.unshift(region);
        },

        load: function() {
            return chain(this, map(arguments, function(name) {
                return this.getLoader(name).loadModule(name);
            }));
        },

        show: function(name, options) {
            return this.region.show(name, options);
        },

        destory: function() {
            this.off();
            return chain(this, map(this.regions, function(region) {
                return region.close();
            }));
        },

        startRoute: function(defaultRoute) {
            var paths = slice.call(arguments, 1), router = this.router;
            if (!this.router) {
                router = this.router = new Router(this);
            }
            return chain(this, router.mountRoutes.apply(router, paths), function() {
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

    assign(Application.prototype, Event);
})();
