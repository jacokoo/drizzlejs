define [
    'jquery'
    'underscore'
    'backbone'
    './base'
    './view'
    './region'
], ($, _, Backbone, Base, View, Region) ->

    class ModuleContainer extends Base
        constructor: (@name) ->
            @modules = {}
            super

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
            delete @modules[from]
            module.id = to
            @modules[to] = module

        add: (module) ->
            @checkId module.id
            @modules[module.id] = module

        remove: (id) ->
            delete @modules[id]

    class Layout extends View
        initialize: ->
            @isLayout = true
            @loadDeferred = @chain "Initialize Layout", [@loadTemplate(), @loadHandlers()]
            delete @bindData

    class Module extends Base
        @Container = ModuleContainer
        @Layout = Layout
        constructor: (@name, @app, @loader, @options) ->
            @id = _.uniqueId('f')
            [a..., @baseName] = @name.split '/'
            @container = options.container or @app.modules
            @container.add @
            @separatedTemplate = options.separatedTemplate is true
            @regions = {}
            super

        initialize: ->
            @extend @options.extend if @options.extend
            @loadDeferred = @createDeferred "Initialize Module #{@name}"
            @chain [@loadTemplate(), @loadLayout(), @loadData(), @loadItems()], => @loadDeferred.resolve()

        loadTemplate: ->
            return if @separatedTemplate
            @chain @loader.loadTemplate(@), (template) =>
                @template = template

        loadLayout: ->
            layout = @getOptionResult @options, 'layout'
            name = if _.isString layout then layout else layout?.name
            name or= 'layout'
            @chain @app.getLoader(name).loadLayout(@, name, layout), (obj) =>
                @layout = obj

        loadData: ->
            @data = {}
            promises = []
            items = @getOptionResult(@options, 'data') or {}
            @autoLoadDuringRender = []
            @autoLoadAfterRender = []

            loadIt = (id, value, isModel) =>
                value = @getOptionResult value
                if value
                    if value.autoLoad is 'after' or value.autoLoad is 'afterRender'
                        @autoLoadAfterRender.push id
                    else if value.autoLoad
                        @autoLoadDuringRender.push id
                promises.push @chain @app.getLoader(value)[if isModel then 'loadModel' else 'loadCollection'](value, @), (d) =>
                    @data[id] = d

            loadIt id, value, value.type is 'model' for id, value of items

            @chain.call @, "load data for #{@name}", promises

        loadItems: ->
            @items = {}
            @inRegionItems = []

            promises = []
            items = @getOptionResult(@options, 'items') or []
            for name, item of items
                do (name, item) =>
                    item = @getOptionResult item
                    item = region: item if _.isString item
                    isModule = item.isModule

                    p = @chain @app.getLoader(name)[if isModule then 'loadModule' else 'loadView'](name, @, item), (obj) =>
                        @items[obj.name] = obj
                        obj.regionInfo = item
                        @inRegionItems.push obj if item.region
                    promises.push p

            @chain.call @, "load items for #{@name}", promises

        addRegion: (name, el) ->
            type = el.data 'region-type'
            @regions[name] = Region.create type, @app, @module, name, el

        render: (options = {}) ->
            throw new Error 'No region to render in' unless @region
            @renderOptions = options
            @container.changeId @id, options.id if options.id

            @chain "Render module #{@name}",
                @loadDeferred
                -> @options.beforeRender?.apply @
                -> @layout.setRegion @region
                @fetchDataDuringRender
                -> @layout.render()
                -> @options.afterLayoutRender?.apply @
                ->
                    promises = for value in @inRegionItems
                        region = @regions[value.regionInfo.region]
                        @logger.error "Can not find region: #{key}" unless region
                        region.show value
                    @chain promises
                -> @options.afterRender?.apply @
                @fetchDataAfterRender

        setRegion: (@region) ->

        close: ->
            @chain "Close module: #{@name}",
                -> @options.beforeClose?.apply @
                -> value.close() for key, value of @regions
                -> @layout.close()
                -> @options.afterClose?.apply @
                -> @container.remove @id

        fetchDataDuringRender: ->
            @chain (@data[id].fetch?() for id in @autoLoadDuringRender)

        fetchDataAfterRender: ->
            @chain (@data[id].fetch?() for id in @autoLoadAfterRender)

    Module
