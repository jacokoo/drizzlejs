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

    D.assign(Route.prototype, {
        match: function(hash) {
            this.pattern.lastIndex = 0;
            return this.pattern.test(hash);
        },

        handle: function(hash) {
            var args, handlers, p = this.router.Promise, me = this;
            this.pattern.lastIndex = 0;
            args = this.pattern.exec(hash).slice(1);

            handlers = this.router.getInterceptors(this.path);
            handlers.push(this.fn);

            return p.chain.apply(p, map(handlers, function(route, i) {
                return function(prev) {
                    return route.apply(me.router, (i > 0 ? [prev].concat(args) : args));
                };
            }, this));
        }
    });

    D.Router = function(app) {
        this.app = app;
        this.routes = [];
        this.routeMap = {};
        this.interceptors = {};
        this.started = false;
        D.Router.__super__.constructor.call(this, 'R');
    };

    D.extend(D.Router, D.Base, {
        initialize: function() {
            this.addRoute('/', this.app.options.defaultRouter || {});
        },

        getHash: function() {
            return root.location.hash.slice(1);
        },

        start: function(defaultPath) {
            var key, me = this, hash;
            if (this.started) return;
            this.started = true;
            key = pushStateSupported ? 'popstate.dr' : 'hashchange.dr';

            A.delegateDomEvent(root, key, null, function() { me.dispatch(me.getHash()); });
            hash = me.getHash() || defaultPath;
            if (hash) this.navigate(hash);
        },

        stop: function() {
            A.undelegateDomEvents(root, '.dr');
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
            return this.Promise.chain(map(paths, function(path) {
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
