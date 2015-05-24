class Layout extends D.View
    initialize: ->
        @isLayout = true
        @loadedPromise = @loadTemplate()
        @bindActions = ->

D.Module = class Module extends D.Base
    @Layout = Layout
    constructor: (@name, @app, @loader, options = {}) ->
        @separatedTemplate = options.separatedTemplate is true
        @regions = {}
        super 'M', options
        @app.modules[@id] = @
        @actions = @getOptionValue('actions') or {}
        @app.delegateEvent @

    initialize: ->
        @extend @options.extend if @options.extend
        @loadedPromise = @Promise.chain [@loadTemplate(), @loadItems()]

        @initLayout()
        @initStore()
        @actionContext = D.extend
            store: @store
        , D.Request

    initLayout: ->
        layout = @getOptionValue('layout') or {}
        @layout = new Layout('layout', @, @loader, layout)

    initStore: ->
        @store = {}
        @autoLoadBeforeRender = []
        @autoLoadAfterRender = []
        doItem = (name, value) =>
            value = value.call @ if D.isFunction value
            value or= {}
            if value and value.autoLoad
                (if value.autoLoad is true then @autoLoadBeforeRender else @autoLoadAfterRender).push name
            @store[name] = D.Model.create value.type, @app, @, value

        doItem key, value for key, value of @getOptionValue('store') or {}

    loadTemplate: ->
        return if @separatedTemplate
        @Promise.chain @loader.loadTemplate(@), (template) -> @template = template

    loadItems: ->
        @items = {}
        @inRegionItems = {}

        doItem = (name, options) =>
            options = options.call @ if D.isFunction options
            options = region: options if D.isString options
            method = if options.isModule then 'loadModule' else 'loadView'
            @app.getLoader(name)[method](name, @, options).then (obj) =>
                obj.moduleOptions = options
                @items[name] = obj
                @inRegionItems[options.region] = obj if options.region

        @Promise.chain (doItem key, value for key, value of @getOptionValue('items') or {})

    setRegion: (@region) ->
        @Promise.chain(
            -> @layout.setRegion @region
            -> @layout.render()
            @bindGlobalAction
            @initRegions
        )

    bindGlobalAction: ->
        for key, value of @actions when key.slice(0, 4) is 'app.'
            do (key, value) =>
                @listenTo @app, key, (payload) => value.call @actionContext, payload

    close: ->
        @Promise.chain(
            -> @options.beforeClose?.call @
            @beforeClose
            -> @layout.close()
            @closeRegions
            @afterClose
            -> @options.afterClose?.call @
            ->
                @stopListening()
                delete @app.modules[@id]
                delete @region
            @
        )

    render: (options = {}) ->
        @error 'No region' unless @region
        @renderOptions = options

        @Promise.chain(
            @loadedPromise
            -> @options.beforeRender?.call @
            @beforeRender
            @fetchDataBeforeRender
            @renderItems
            @afterRender
            -> @options.afterRender?.call @
            @fetchDataAfterRender
            @
        )

    closeRegions: ->
        regions = @regions
        delete @regions
        @Promise.chain (value.close() for key, value of regions or {})

    initRegions: ->
        @closeRegions() if @regions
        @regions = {}
        for item in @layout.$$('[data-region]')
            id = item.getAttribute 'data-region'
            type = item.getAttribute 'region-type'
            @regions[id] = D.Region.create type, @app, @, item, id

    renderItems: ->
        promises = for key, value of @inRegionItems
            @error "Region:#{key} is not defined" unless @regions[key]
            @regions[key].show value
        @Promise.chain promises

    fetchDataBeforeRender: ->
        @Promise.chain (D.Request.get @store[name] for name in @autoLoadBeforeRender)

    fetchDataAfterRender: ->
        @Promise.chain (D.Request.get @store[name] for name in @autoLoadAfterRender)

    dispatch: (name, payload) ->
        {name, payload} = name unless payload
        @error "No action handler for #{name}" unless D.isFunction @actions[name]
        @Promise.chain -> @actions[name].call @actionContext, payload

    beforeRender: ->
    afterRender: ->
    beforeClose: ->
    afterClose: ->
