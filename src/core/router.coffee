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

    match: (hash) ->
        @pattern.lastIndex = 0
        @pattern.test hash

    handle: (hash) ->
        @pattern.lastIndex = 0
        args = @pattern.exec(hash).slice 1
        routes = @router.getDependencies(@path)
        routes.push @
        fns = for route, i in routes
            do (route, i) ->
                (prev) -> route.fn (if i > 0 then [prev].concat args else args)...
        @router.chain fns...

D.Router = class Router extends D.Base
    constructor: (@app) ->
        @routes = []
        @routeMap = {}
        @dependencies = {}
        @started = false
        super 'ro'

    initialize: ->
        @addRoute '/', D.Config.defaultRouter

    getHash: -> root.location.hash.slice 1

    start: (defaultPath) ->
        return if @started
        @started = true

        $(root).on 'popstate.dr', =>
            hash = @getHash()
            return if @previousHash is hash
            @previousHash = hash
            @dispatch(hash)

        hash = @getHash()
        if hash
            @navigate hash, true
        else if defaultPath
            @navigate defaultPath, true

    stop: ->
        $(root).off '.dr'
        @started = false

    dispatch: (hash) -> return route.handle hash for route in @routes when route.match hash

    navigate: (path, trigger) ->
        root.history.pushState {}, root.document.title, "##{path}"
        @dispatch path if trigger

    mountRoutes: (paths...) -> @chain(
        @app.getLoader(path).loadRouter(path) for path in paths
        (routers) ->
            @addRoute paths[i], router for router, i in routers
    )

    addRoute: (path, router) ->
        routes = @getOptionResult router.routes
        dependencies = @getOptionResult router.deps
        for key, value of dependencies
            p = D.joinPath path, key
            @dependencies[p] = if value.charAt(0) is '/' then value.slice 1 else D.joinPath path, value

        for key, value of routes
            p = D.joinPath(path, key).replace /(^\/|\/$)/g, ''
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
