DefaultConfigs =
    scriptRoot: 'app'
    urlRoot: ''
    urlSuffix: ''
    caseSensitiveHash: false
    defaultRegion: root.document.body
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
        router: 'router'

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
        opt = D.extend {}, DefaultConfigs, options
        @modules = {}
        @global = {}
        @loaders = {}
        @regions = []

        super 'A', opt

    initialize: ->
        @registerLoader new D.SimpleLoader(@)
        @registerLoader new D.Loader(@), true
        @registerHelper key, value for key, value of D.Helpers
        @setRegion new D.Region(@, null, $(@options.defaultRegion))

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

    show: (name, options) ->
        @region.show name, options

    destory: ->
        @chain (region.close() for region in @regions)
        @off()

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

D.include Application, D.Event
