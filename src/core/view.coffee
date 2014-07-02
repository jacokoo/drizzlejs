D.View = class View extends Base
    @ComponentManager =
        handlers: {}
        register: (name, creator, destructor = ( -> ), initializer = ( -> )) ->
            @handlers[name] =
                creator: creator, destructor: destructor, initializer: initializer, initialized: false

        create: (view, options = {}) ->
            {id, name, selector} = options
            opt = options.options
            throw new Error 'Component name can not be null' unless name
            throw new Error 'Component id can not be null' unless id

            dom = if selector then view.$$(selector) else if id then view.$(id) else view.getEl()
            handler = @handlers[name] or creator: (view, el, options) ->
                throw new Error "No component handler for name: #{name}" unless el[name]
                el[name] options
            , destructor: (view, component, info) ->
                component[name] 'destroy'
            , initialized: true

            obj = if not handler.initialized and handler.initializer then handler.initializer() else null
            handler.initialized = true
            view.chain obj, handler.creator(view, dom, opt), (comp) ->
                id: id, component: comp, info:
                    destructor: handler.destructor, options: opt

        destroy: (view, component, info) ->
            info.destructor?(view, component, info.options)

    constructor: (@name, @module, @loader, @options = {}) ->
        @id = D.uniqueId 'v'
        @app = @module.app
        @eventHandlers = {}
        super

    initialize: ->
        @extend @options.extend if @options.extend
        @loadDeferred = @chain [@loadTemplate(), @loadHandlers()]

    loadTemplate: ->
        if @module.separatedTemplate isnt true
            @chain @module.loadDeferred, -> @template = @module.template
        else
            template = @getOptionResult(@options.template) or @name
            @chain @app.getLoader(template).loadSeparatedTemplate(@, template), (t) ->
                @template = t

    loadHandlers: ->
        handlers = @getOptionResult(@options.handlers) or @name
        @chain @app.getLoader(handlers).loadHandlers(@, handlers), (handlers) ->
            D.extend @eventHandlers, handlers

    # Bring model or collection from module to view, make them visible to render template
    # Bind model or collection events to call methods in view
    # eg.
    # bind: {
    #   item: 'all#render, reset#handlerName'
    # }
    bindData: -> @module.loadDeferred.done =>
        bind = @getOptionResult(@options.bind) or {}
        @data = {}
        doBind = (model, binding) => @listenTo model, event, (args...) ->
            [event, handler] = binding.split '#'
            throw new Error "Incorrect binding string format:#{binding}" unless name and handler
            return @[handler]? args...
            return @eventHandlers[handler]? args...
            throw new Error "Can not find handler function for :#{handler}"

        for key, value of bind
            @data[key] = @module.data[key]
            throw new Error "Model: #{key} doesn't exists" unless @data[key]
            return unless value
            bindings = value.replace(/\s+/g, '').split ','
            doBind @data[key], bindings for binding in bindings

    unbindData: ->
        @stopListening()
        delete @data

    wrapDomId: (id) -> "#{@id}#{id}"

    # Set the region to render in
    # Delegate all events in region
    setRegion: (@region) ->

        # Events can be defined like
        # events: {
        #   'eventName domElementId': 'handlerName'
        #   'click btn': 'clickIt'
        #   'change input-*': 'inputChanged'
        # }
        #
        # Only two type of selectors are supported
        # 1. Id selector
        #   'click btn' will effect with a dom element whose id is 'btn'
        #   eg. <button id="btn"/>
        #
        # 2. Id prefix selector
        #   'change input-*' will effect with those dom elements whose id start with 'input-'
        #   In this case, when event is performed,
        #   the string following with 'input-' will be extracted to the first of handler's argument list
        #   eg.
        #     <input id="input-1"/> <input id="input-2"/>
        #     When the value of 'input-1' is changed, the handler will get ('1', e) as argument list
        events = @getOptionResult(@options.events) or {}
        for key, value of events
            throw new Error 'The value defined in events must be a string' unless D.isString value
            [name, id] = key.replace(/^\s+/g, '').replace(/\s+$/, '').split /\s+/
            if id
                selector = if id.charAt(id.length - 1) is '*' then "[id^=#{@wrapDomId id.slice(0, -1)}]" else "##{@wrapDomId id}"
            handler = @createHandler name, id, selector, value
            @region.delegateEvent @, name, selector, handler

    createHandler: (name, id, selector, value) ->
        me = @
        (args...) ->
            el = $ @

            return if el.hasClass 'disabled'

            if selector and selector.charAt(0) isnt '#'
                i = el.attr 'id'
                args.unshift i.slice id.length

            if el.data('after-click') is 'defer'
                deferred = me.createDeferred()
                el.addClass 'disabled'
                deferred.always -> el.removeClass 'disabled'
                args.unshift deferred

            me.loadDeferred.done ->
                method = me.eventHandlers[value]
                throw new Error "No handler defined with name: #{value}" unless method
                method.apply me, args

    getEl: ->
        if @region then @region.getEl @ else null

    $: (id) ->
        throw new Error "Region is null" unless @region
        @region.$$ '#' + @wrapDomId id

    $$: (selector) ->
        throw new Error "Region is null" unless @region
        @getEl().find selector

    close: ->
        @chain
            -> @options.beforeClose?.apply @
            [
                -> @region.undelegateEvents(@)
                -> @unbindData()
                -> @destroyComponents()
                -> @unexportRegions()
            ]
            -> @options.afterClose?.apply @
            -> @

    render: ->
        throw new Error 'No region to render in' unless @region

        @chain
            @loadDeferred
            [@unbindData, @destroyComponents, @unexportRegions]
            @bindData
            -> @options.beforeRender?.apply(@)
            @beforeRender
            @serializeData
            @options.adjustData or (data) -> data
            @executeTemplate
            @processIdReplacement
            @renderComponent
            @exportRegions
            @afterRender
            -> @options.afterRender?.apply(@)
            -> @

    beforeRender: ->

    destroyComponents: ->
        components = @components or {}
        for key, value of components
            View.ComponentManager.destroy @, value, @componentInfos[key]

        @components = {}
        @componentInfos = {}

    serializeData: ->
        data = {}
        data[key] = value.toJSON() for key, value of @data
        data

    executeTemplate: (data, ignore, deferred) ->
        data.Global = @app.global
        data.View = @
        html = @template data
        @getEl().html html

    processIdReplacement: ->
        used = {}

        @$$('[id]').each (i, el) =>
            el = $ el
            id = el.attr 'id'
            throw new Error "The id:#{id} is used more than once." if used[id]
            used[id] = true
            el.attr 'id', @wrapDomId id

        for attr in config.attributesReferToId or []
            @$$("[#{attr}]").each (i, el) =>
                el = $ el
                value = el.attr attr
                withHash = value.charAt(0) is '#'
                if withHash
                    el.attr attr, '#' + @wrapDomId value.substring 1
                else
                    el.attr attr, @wrapDomId value

    renderComponent: ->
        components = @getOptionResult(@options, 'components') or []
        promises = for component in components
            component = @getOptionResult component
            View.ComponentManager.create @, component if component
        @chain promises, (comps) =>
            for comp in comps when comp
                id = comp.id
                @components[id] = comp.component
                @componentInfos[id] = comp.info

    exportRegions: ->
        @exportedRegions = {}
        @$$('[data-region]').each (i, el) =>
            el = $ el
            id = el.data 'region'
            @exportedRegions[id] = @module.addRegion id, el

    unexportRegions: ->
        @chain 'remove regions',
            (value.close() for key, value of @exportedRegions)
            (@module.removeRegion key for key, value of @exportedRegions)

    afterRender: ->

    listenTo: D.Event.listenTo

    stopListening: D.Event.stopListening
