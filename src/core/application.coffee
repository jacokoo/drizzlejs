D.Application = class Application extends D.Base
    constructor: (@options = {}) ->
        @modules = new Module.Container()
        @global = {}
        @loaders = {}
        @regions = []

        super 'a'
        @modules.delegateEvent @

    initialize: ->
        @registerLoader new D.SimpleLoader(@)
        @registerLoader new D.Loader(@), true
        @registerHelper key, value for key, value of D.Helpers
        @setRegion new D.Region(@, null, $(document.body))

    registerLoader: (loader, isDefault) ->
        @loaders[loader.name] = loader
        @defaultLoader = loader if isDefault

    registerHelper: (name, fn) ->
        app = @
        Handlebars.registerHelper name, (args...) ->
            fn.apply @, [app, Handlebars].concat args

    getLoader: (name) ->
        {loader} = Loader.analyse name
        if loader and @loaders[loader] then @loaders[loader] else @defaultLoader

    setRegion: (region) ->
        @region = region
        @regions.unshift @region

    startRoute: (defaultPath, paths...) ->
        @router = new D.Router(@) unless @router

        @chain @router.mountRoutes(paths...), -> @router.start defaultPath

    navigate: (path, trigger) ->
        @router.navigate(path, trigger)

    load: (names...) ->
        @chain (@getLoader(name).loadModule name for name in names)

    show: (feature, options) ->
        @region.show feature, options

    destory: ->
        @chain (region.close() for region in @regions)

    #methods for notification
    message:
        success: (title, content) ->
            alert content or title

        info: (title, content) ->
            content = title unless content
            alert content or title

        error: (title, content) ->
            content = title unless content
            alert content or title
