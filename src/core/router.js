(function() {
    var pushStateSupported = root.history && ('pushState' in root.history),
        routerRegexps = [
            /:([\w\d]+)/g, '([^\/]+)',
            /\*([\w\d]+)/g, '(.*)'
        ], Route;


    Route = function(app, router, path, fn) {
        var pattern = path.replace(routerRegexps[0], routerRegexps[1])
            .replace(routerRegexps[2], routerRegexps[3]);
        this.pattern = new RegExp('^' + pattern + '$', app.options.caseSensitiveHash ? 'g' : 'gi');

        this.app = app;
        this.router = router;
        this.path = path;
        this.fn = fn;
    };

    assign(Route.prototype, {
        match: function(hash) {
            this.pattern.lastIndex = 0;
            return this.pattern.test(hash);
        },

        handle: function(hash) {
            var me = this, p = me.router.Promise, args, handlers;
            me.pattern.lastIndex = 0;
            args = me.pattern.exec(hash).slice(1);

            handlers = me.router.getInterceptors(me.path);
            handlers.push(me.fn);

            return p.chain.apply(p, map(handlers, function(route, i) {
                return function(prev) {
                    return route.apply(me.router, (i > 0 ? [prev].concat(args) : args));
                };
            }));
        }
    });

    Router = D.Router = function(app) {
        this.app = app;
        this.routes = [];
        this.routeMap = {};
        this.interceptors = {};
        this.started = false;
        parent(Router).call(this, 'R');
    };

    extend(Router, Base, {
        initialize: function() {
            this.addRoute('/', this.app.options.defaultRouter || {});
        },

        getHash: function() {
            return root.location.hash.slice(1);
        },

        start: function(defaultPath) {
            var key, me = this, hash;
            if (me.started) return;
            key = 'hashchange.dr';

            Adapter.delegateDomEvent(root, key, null, function() { me.dispatch(me.getHash()); });
            hash = me.getHash() || defaultPath;
            if (hash) me.navigate(hash);
            me.started = true;
        },

        stop: function() {
            Adapter.undelegateDomEvents(root, '.dr');
        },

        dispatch: function(hash) {
            var i, route;
            if (hash === this.previousHash) return;
            this.previousHash = hash;

            for (i = 0; i < this.routes.length; i++) {
                route = this.routes[i];
                if (route.match(hash)) {
                    route.handle(hash);
                    return;
                }
            }
        },

        navigate: function(path, trigger) {
            trigger = trigger !== false;
            if (pushStateSupported) {
                root.history.pushState({}, root.document.title, '#' + path);
            } else {
                root.location.replace('#' + path);
            }

            if (trigger) this.dispatch(path);
        },

        mountRoutes: function() {
            var paths = slice.call(arguments), me = this;
            return chain(me, map(paths, function(path) {
                return me.app.getLoader(path).loadRouter(path);
            }), function(routers) {
                map(routers, function(router, i) { me.addRoute(paths[i], router); });
            }, this);
        },

        addRoute: function(path, router) {
            var routes = router.routes, interceptors = router.interceptors;
            if (D.isFunction(routes)) routes = routes.call(this);
            if (D.isFunction(interceptors)) interceptors = interceptors.call(this);

            mapObj(interceptors, function(value, key) {
                this.interceptors[compose(path, key)] = router[value];
            }, this);

            mapObj(routes, function(value, key) {
                this.routes.unshift(new Route(this.app, this, compose(path, key), router[value]));
            }, this);
        },

        getInterceptors: function(path) {
            var result = [], items = path.split('/'), key;

            items.pop();
            while (items.length > 0) {
                key = items.join('/');
                if (this.interceptors[key]) result.unshift(this.interceptors[key]);
                items.pop();
            }

            if (this.interceptors['']) result.unshift(this.interceptors['']);
            return result;
        }
    });
})();
