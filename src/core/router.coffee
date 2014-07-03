class Route
    regExps: [
        /:([\w\d]+)/g
        '([^\/]+)'
        /\*([\w\d]+)/g
        '(.*)'
    ]
    constructor: (@app, @router, @path, @fn) ->
        pattern = path.replace(@regExps[0], @regExps[1]).replace(@regExps[2], @regExps[3])
        @pattern = new RegExp "^#{pattern}$", if D.Config.caseSensitiveHash then 'g' else 'gi'

    match: (hash) -> @pattern.test hash

    handle: (hash) ->
        args = @pattern.exec(hash).slice 1
        routes = @router.getDependencies(@path)
        routes.push @
        fns = for route, i in routes
            (prev) -> route.fn (if i > 0 then [prev].concat args else args)...
        router.chain fns...

D.Router = class Router extends D.Base
    constructor: (@app) ->
        @routes = []
        @routeMap = {}
        @dependencies = {}
        super 'ro'

    start: (defaultPath) ->
        $(root).on 'popstate.drizzlerouter', =>
            hash = root.location.hash.slice 1
            return if @previousHash is hash
            @previousHash = hash
            @dispatch(hash)
        @navigate defaultPath, true if defaultPath

    stop: -> $(root).off '.drizzlerouter'

    dispatch: (hash) -> return route.handle hash for route in @routes when route.match hash

    navigate: (path, trigger) ->
        root.history.pushState {}, root.document.title, "##{path}"
        @routeMap[path]?.handle path if trigger

    mountRoutes: (paths...) -> @chain(
        @app.getLoader(path).loadRouter(path) for path in paths
        (routers) ->
            @addRouter paths[i], router for router, i in routers
    )

    addRoute: (path, router) ->
        routes = @getOptionResult router.route
        dependencies = @getOptionResult router.deps
        for key, value of dependencies
            p = D.joinPath path, key
            @dependencies[p] = if value.charAt(0) is '/' then value.slice 1 else D.joinPath path, value

        for key, value of routes
            p = D.joinPath path, key
            route = new Route @app, @, p, router[value]
            @routes.unshift route
            @routeMap[p] = route

    getDependencies: (path) ->
        deps = []
        d = @dependencies[path]
        while d?
            deps.unshift @routeMap[d]
            d = @dependencies[d]
        deps
