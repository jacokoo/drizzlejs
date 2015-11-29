const PUSH_STATE_SUPPORTED = root && root.history && ('pushState' in root.history);
const ROUTER_REGEXPS = [/:([\w\d]+)/g, '([^\/]+)', /\*([\w\d]+)/g, '(.*)'];

class Route {
    constructor (app, router, path, fn) {
        const pattern = path
            .replace(ROUTER_REGEXPS[0], ROUTER_REGEXPS[1])
            .replace(ROUTER_REGEXPS[2], ROUTER_REGEXPS[3]);

        this.pattern = new RegExp(`^${pattern}$`, app.options.caseSensitiveHash ? 'g' : 'gi');

        this.app = app;
        this.router = router;
        this.path = path;
        this.fn = fn;
    }

    match (hash) {
        this.pattern.lastIndex = 0;
        return this.pattern.test(hash);
    }

    handle (hash) {
        this.pattern.lastIndex = 0;
        const args = this.pattern.exec(hash).slice(1),
            handlers = this.router._getInterceptors(this.path);

        handlers.push(this.fn);
        return this.router.chain(...map(handlers, (fn, i) => {
            return (prev) => fn.apply(this.router, (i > 0 ? [prev].concat(args) : args));
        }));
    }
}

D.Router = class Router extends D.Base {
    constructor (app) {
        super('Router', {}, {
            app,
            _routes: [],
            _interceptors: {},
            _started: false
        });

        this._EVENT_HANDLER = () => this._dispath(this._getHash());
    }

    navigate (path, trigger) {
        if (!this._started) return;
        if (PUSH_STATE_SUPPORTED) {
            root.history.pushState({}, root.document.title, '#' + path);
        } else {
            root.location.replace('#' + path);
        }

        if (trigger !== false) this._dispath(path);
    }

    _start (defaultPath) {
        if (this._started || !root) return;
        D.Adapter.addEventListener(root, 'hashchange', this._EVENT_HANDLER, false);

        const hash = this._getHash() || defaultPath;
        this._started = true;
        if (hash) this.navigate(hash);
    }

    _stop () {
        if (!this._started) return;
        D.Adapter.removeEventListener(root, 'hashchange', this._EVENT_HANDLER);
        this._started = false;
    }

    _dispath (path) {
        if (path === this._previousHash) return;
        this._previousHash = path;

        for (let i = 0; i < this._routes.length; i++) {
            const route = this._routes[i];
            if (route.match(path)) {
                route.handle(path);
                return;
            }
        }
    }

    _mountRoutes () {
        const paths = slice.call(arguments);
        return this.chain(
            map(paths, (path) => this.app._getLoader(path).loadRouter(path)),
            (options) => map(options, (option, i) => this._addRoute(paths[i], option))
        );
    }

    _addRoute (path, options) {
        const { routes, interceptors } = options;

        mapObj(D.isFunction(routes) ? routes.apply(this) : routes, (value, key) => {
            const p = (path + key).replace(/^\/|\/$/g, '');
            this._routes.unshift(new Route(this.app, this, p, options[value]));
        });

        mapObj(D.isFunction(interceptors) ? interceptors.apply(this) : interceptors, (value, key) => {
            const p = (path + key).replace(/^\/|\/$/g, '');
            this._interceptors[p] = options[value];
        });
    }

    _getInterceptors (path) {
        const result = [], items = path.split('/');

        items.pop();
        while (items.length > 0) {
            const key = items.join('/');
            if (this._interceptors[key]) result.unshift(this._interceptors[key]);
            items.pop();
        }

        if (this._interceptors['']) result.unshift(this._interceptors['']);
        return result;
    }

    _getHash () {
        return root.location.hash.slice(1);
    }

};
