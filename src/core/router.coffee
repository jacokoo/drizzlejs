pushStateSupported = root.history and 'pushState' of root.history

class Route
    regExps: [
        /:([\w\d]+)/g
        '([^\/]+)'
        /\*([\w\d]+)/g
        '(.*)'
    ]
    constructor: (@app, @router, @path, @fn) ->
        pattern = @path.replace(@regExps[0], @regExps[1]).replace(@regExps[2], @regExps[3])
        @pattern = new RegExp "^#{pattern}$", if @app.options.caseSensitiveHash then 'g' else 'gi'

    match: (hash) ->
        @pattern.lastIndex = 0
        @pattern.test hash

    handle: (hash) ->
        @pattern.lastIndex = 0
        args = @pattern.exec(hash).slice 1
        handlers = @router.getInterceptors(@path)
        handlers.push @fn

        fns = for route, i in handlers
            do (route, i) =>
                (prev) => route.apply @router, (if i > 0 then [prev].concat args else args)
        @router.Promise.chain fns...

D.Router = class Router extends D.Base
    constructor: (@app) ->
        @routes = []
        @routeMap = {}
        @interceptors = {}
        @started = false
        super 'R'

    initialize: ->
        @addRoute '/', @app.options.defaultRouter or {}

    getHash: -> root.location.hash.slice 1

    start: (defaultPath) ->
        return if @started
        @started = true
        key = if pushStateSupported then 'popstate.dr' else 'hashchange.dr'
        A.delegateDomEvent root, key, null, => @dispatch @getHash()

        if hash = @getHash()
            @navigate hash
        else if defaultPath
            @navigate defaultPath

    stop: ->
        A.undelegateDomEvents root, '.dr'
        @started = false

    dispatch: (hash) ->
        return if @previousHash is hash
        @previousHash = hash

        return route.handle hash for route in @routes when route.match hash

    navigate: (path, trigger = true) ->
        if pushStateSupported
            root.history.pushState {}, root.document.title, "##{path}"
        else
            root.location.replace "##{path}"

        @dispatch path if trigger

    mountRoutes: (paths...) -> @Promise.chain(
        @app.getLoader(path).loadRouter(path) for path in paths
        (routers) -> @addRoute paths[i], router for router, i in routers
    )

    addRoute: (path, router) ->
        {routes, interceptors} = router
        routes = routes.call @ if D.isFunction routes
        interceptors = interceptors.call @ if D.isFunction interceptors

        @interceptors[compose(path, key)] = router[value] for key, value of interceptors or {}

        for key, value of routes or {}
            p = compose path, key
            @error 'Route [' + p + '] is not defined' unless D.isFunction router[value]
            @routes.unshift new Route(@app, @, compose(path, key), router[value])

    getInterceptors: (path) ->
        result = []
        items = path.split '/'
        items.pop()
        while items.length > 0
            key = items.join '/'
            result.unshift @interceptors[key] if @interceptors[key]
            items.pop()

        if @interceptors[''] then result.unshift @interceptors['']
        result
