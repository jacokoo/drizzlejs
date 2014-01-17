define [
    'underscore'
    'backbone'
    './base'
], (_, Backbone, Base) ->

    joinPath = (paths...) ->
        p = Base.joinPath paths...
        p = if p.charAt(0) is '/' then p.substring(1)  else p
        if p.charAt(p.length - 1) is '/' then p.substring(0, p.length - 1) else p

    class Router extends Base
        @include Backbone.Router.prototype

        constructor: (@app) ->
            @name = 'Router'
            @routes = {}
            @dependencies = {}
            Backbone.Router.call @
            super

        mountRouter: (paths...) ->
            @chain(
                @app.getLoader(path).loadRouter(path) for path in paths
                (routers) ->
                    @addRouter paths[i], router for router, i in routers
            )

        addRouter: (path, router) ->
            routes = @getOptionResult router, 'routes'
            dependencies = @getOptionResult router, 'deps'
            for key, value of dependencies
                p = joinPath path, key
                @dependencies[p] = if value.charAt(0) is '/' then value.substring(1) else joinPath path, value

            for key, value of routes
                p = joinPath path, key
                @routes[p] = router[value]
                @route p,  @createHandler(p)

        createHandler: (path) ->
            (args...) ->
                deps = [path]
                d = @dependencies[path]
                while d?
                    deps.unshift d
                    d = @dependencies[d]
                ps = []
                for p in deps
                    do (p) =>
                        ps.push (prev) ->
                            @routes[p].apply @, args.concat [prev]
                @chain ps...
