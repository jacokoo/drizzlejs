D.View = class View extends Base
    @ComponentManager =
        handlers: {}
        componentCache: {}
        createDefaultHandler: (name) ->
            creator: (view, el, options) -> el[name] options
            destructor: (view, component, options) -> component[name] 'destroy'
        register: (name, creator, destructor = ( -> )) ->
            @handlers[name] = creator: creator, destructor: destructor

        create: (view, options = {}) ->
            {id, name, selector, options: opt} = options
            view.error 'Component name can not be null' unless name
            view.error 'No component handler for name:' + name unless @handlers[name] or el[name]

            handler = @handlers[name] or createDefaultHandler(name)
            dom = if selector then view.$$(selector) else view.$(id)
            dom = view.getEl() if dom.size() is 0 and not selector
            id = D.uniqueId() unless id

            view.Promise.chain handler.creator(view, dom, opt), (comp) ->
                componentCache[view.id + id] = handler: handler, id: id, options: opt
                id: id, component: comp

        destroy: (id, view, component) ->
            info = @componentCache[view.id + id]
            delete @componentCache[view.id + id]
            info.handler.destructor?(view, component, info.options)

    constructor: (@name, @module, @loader, @options = {}) ->
        @app = @module.app
        @eventHandlers = {}
        super 'v'
        @app.delegateEvent @

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
        doBind = (model, binding) =>
            [event, handler] = binding.split '#'
            @listenTo model, event, (args...) ->
                throw new Error "Incorrect binding string format:#{binding}" unless event and handler
                return @[handler]? args...
                return @eventHandlers[handler]? args...
                throw new Error "Can not find handler function for :#{handler}"

        for key, value of bind
            @data[key] = @module.data[key]
            throw new Error "Model: #{key} doesn't exists" unless @data[key]
            continue unless value
            bindings = value.replace(/\s+/g, '').split ','
            doBind @data[key], binding for binding in bindings

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
            [name, id] = key.replace(/(^\s+)|(\s+$)/g, '').split /\s+/
            if id
                selector = if id.slice(-1) is '*' then "[id^=#{id = @wrapDomId id.slice(0, -1)}]" else "##{id = @wrapDomId id}"
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
                (me.options.clickDeferred or me.app.options.clickDeferred)?.call @, deferred, el
                args.unshift deferred

            me.loadDeferred.done ->
                method = me.eventHandlers[value]
                throw new Error "No handler defined with name: #{value}" unless method
                method.apply me, args

    getEl: ->
        if @region then @region.getEl @ else null

    $: (id) ->
        @error 'Region is null' unless @region
        @region.$$ '#' + @wrapDomId id

    $$: (selector) ->
        @error 'Region is null' unless @region
        @getEl().find selector

    close: ->
        return @createResolvedDeferred @ unless @region
        @chain(
            -> @options.beforeClose?.apply @
            [
                -> @region.undelegateEvents(@)
                -> @unbindData()
                -> @destroyComponents()
                -> @unexportRegions()
                -> @region.empty @
            ]
            -> @options.afterClose?.apply @
            -> delete @region
            @
        )

    render: (options = {}) ->
        @error 'Region is null' unless @region
        @renderOptions = options

        @chain(
            @loadDeferred
            [@unbindData, @destroyComponents, @unexportRegions]
            @bindData
            -> @options.beforeRender?.apply(@)
            @beforeRender
            @serializeData
            @options.adjustData or (data) -> data
            @executeTemplate
            @executeIdReplacement
            @renderComponent
            @exportRegions
            @afterRender
            -> @options.afterRender?.apply(@)
            @
        )

    beforeRender: ->

    serializeData: ->
        data = {}
        data[key] = value.toJSON() for key, value of @data
        data

    executeTemplate: (data) ->
        data.Global = @app.global
        data.View = @
        html = @template data
        @region.setHtml html, @

    executeIdReplacement: ->
        used = {}

        @$$('[id]').each (i, el) =>
            el = $ el
            id = el.attr 'id'
            @error "The id:#{id} is used more than once." if used[id]
            used[id] = true
            el.attr 'id', @wrapDomId id

        for attr in @app.options.attributesReferToId or []
            @$$("[#{attr}]").each (i, el) =>
                el = $ el
                value = el.attr attr
                withHash = value.charAt(0) is '#'
                if withHash
                    el.attr attr, '#' + @wrapDomId value.slice 1
                else
                    el.attr attr, @wrapDomId value

    renderComponent: ->
        components = @getOptionValue('components') or []
        promises = for component in components
            component = component.apply @ if D.isFunction component
            View.ComponentManager.create @, component if component
        @chain promises, (comps) =>
            @components[id] = component for {id, component} in comps when comp

    destroyComponents: ->
        View.ComponentManager.destroy key, @, value for key, value of @components or {}
        @components = {}

    exportRegions: ->
        @exportedRegions = {}
        @$$('[data-region]').each (i, el) =>
            el = $ el
            id = el.data 'region'
            @exportedRegions[id] = @module.addRegion id, el

    unexportRegions: -> @chain(
        (value.close() for key, value of @exportedRegions)
        (@module.removeRegion key for key, value of @exportedRegions)
    )

    afterRender: ->
