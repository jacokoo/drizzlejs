DefaultConfigs =
    scriptRoot: 'app'
    urlRoot: ''
    urlSuffix: ''
    defaultContentType: 'application/json'
    caseSensitiveHash: false
    attributesReferToId: [
        'for' # for label
        'data-target' #for bootstrap
        'data-parent' #for bootstrap
    ]

    fileNames:
        module: 'index'           # module definition file name
        templates: 'templates'    # merged template file name
        view: 'view-'             # view definition file name prefix
        template: 'template-'     # seprated template file name prefix
        handler: 'handler-'       # event handler file name prefix
        model: 'model-'           # model definition file name prefix
        collection: 'collection-' # collection definition file name prefix
        router: 'router'
        templateSuffix: '.html'

    pagination:
        defaultPageSize: 10
        pageKey: '_page'
        pageSizeKey: '_pageSize'
        recordCountKey: 'recordCount'

    defaultRouter:
        routes: 'module/*name': 'showModule'
        showModule: (name) -> @app.show name

    clickDeferred: ->

D.Application = class Application extends D.Base
    constructor: (options = {}) ->
        @options = D.extend {}, DefaultConfigs, options
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
