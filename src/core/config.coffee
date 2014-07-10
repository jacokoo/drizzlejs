Drizzle.Config =
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
