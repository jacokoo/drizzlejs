const PUSH_STATE_SUPPORTED = root.history && ('pushState' in root.history);
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
            _routeMap: {},
            _interceptors: {}
        });
    }

    _initialize () {

    }

    _getHash () {
        return root.location.hash.slice(1);
    }

};
