define ['jquery', 'underscore'], ($, _) ->

    defaults =
        development: true
        cache: true
        scriptRoot: 'app'
        urlRoot: ''
        urlSuffix: ''
        attributesReferToId: [
            'for' # label
            'data-target' #bootstrap
            'data-parent' #bootstrap
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

    config = require('config')
    merged = _.extend {}, defaults, config

    merged.fileNames[key] = value for key, value of defaults.fileNames when not (key of merged.fileNames)

    merged
