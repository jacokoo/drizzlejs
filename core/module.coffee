define [
    'jquery'
    'underscore'
    'backbone'
    './config'
    './loader'
    './util'
], ($, _, Backbone, config, Loader, util) ->

    class ModuleContainer
        constructor: (@name) ->
            @modules = {}

        checkId: (id) ->
            throw new Error "id: #{id} is invalid" unless id and _.isString id
            throw new Error "id: #{id} is already used" if @modules[id]

        get: (id) ->
            @modules[id]

        changeId: (from, to) ->
            return if from is to
            @checkId to

            module = @modules[from]
            throw new Error "module with id: #{from} not exists" if not module
            delete @modules[form]
            module.id = to
            @modules[to] = module

        add: (module) ->
            @checkId module.id
            @modules[module.id] = module

        remove: (id) ->
            delete @modules[id]

    createLayout = (module, def) ->


    class Module
        constructor: (@name, @root, @loader, @options) ->
            @id = _.uniqueId('f')
            @container = options.container or @root.modules
            @container.add @
            @separatedTemplate = options.separatedTemplate is true
            @regions = {}

            util.extend @, options.extend if options.extend

        loadTemplate: ->
            return if @separatedTemplate
            @loader.loadTemplate(@, config.fileNames.template).done (template) =>
                @template = template

        loadLayout: ->
            layout = util.getValue @options, 'layout', @
            if _.isString layout
                names = Loader.analyse layout
                return loader.get(names.loader).loadLayout(layout).done (obj) =>
                    @layout = obj
            def = if _.isObject layout then layout else {}
            @layout = createLayout module, def

        loadData: ->
            @data = {}
            promises = []
            models = util.getValue(@options, 'models', @) or {}
            collections = util.getValue(@options, 'collections', @) or {}

            for id, value of models
                do (id, value) =>
                    value = util.callIt value, @
                    names = Loader.analyse value
                    loader = Loader.get names.loader
                    promises.push loader.loadModel(value, @).done (model) =>
                        @data[id] = model

            for id, value of collections
                do (id, value) =>
                    throw new Error "collection id: #{id} is already used" if @data[id]
                    value = util.callIt value, @
                    names = Loader.analyse value
                    loader = Loader.get names.loader
                    promises.push loader.loadCollection(value, @).done (collection) =>
                        @data[id] = collection

            promises

        loadItems: ->
            @items = {}
            @inRegionItems = {}

            promises = []
            items = util.getValue(@options, 'items', @) or []
            for item in items
                do (item) =>
                    item = callIt item, @
                    item = name: item if _.isString item
                    isModule = item.isModule
                    names = Loader.analyse item.name
                    loader = Loader.get items.loader

                    promises.push loader[if isModule then 'loadModule' else 'loadView'](item.name, @).done (obj) =>
                        @items[names.name] = obj
                        @inRegionItems[region] = obj if item.region

            promises

        addRegion: (name, el) ->
            @regions[name] = new Region @root, @module, name, el
