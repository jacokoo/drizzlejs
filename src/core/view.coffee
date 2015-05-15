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
            dom = view.getEl() if not dom and dom.length is 0 and not selector
            id = D.uniqueId() unless id

            view.Promise.chain handler.creator(view, dom, opt), (comp) ->
                componentCache[view.id + id] = handler: handler, id: id, options: opt
                id: id, component: comp

        destroy: (id, view, component) ->
            info = @componentCache[view.id + id]
            delete @componentCache[view.id + id]
            info.handler.destructor?(view, component, info.options)

    constructor: (@name, @module, @loader, options = {}) ->
        @app = @module.app
        @eventHandlers = options.handlers or {}
        @components = {}
        super 'V', options
        @app.delegateEvent @

    initialize: ->
        @extend @options.extend if @options.extend
        @loadedPromise = @Promise.chain [@loadTemplate(), @bindData()]

    loadTemplate: ->
        if @module.separatedTemplate isnt true
            @Promise.chain @module.loadedPromise, -> @template = @module.template
        else
            template = @getOptionValue('template') or @name
            @Promise.chain @app.getLoader(template).loadSeparatedTemplate(@, template), (t) ->
                @template = t

    bindData: -> @Promise.chain @module.loadedPromise, ->
        bind = @getOptionValue('bind') or {}
        @data = {}

        doBind = (model) => @listenTo model, 'change', => @render @renderOptions

        for key, value of bind
            model = @data[key] = @module.store[key]
            @error "No model: #{key}" unless model
            doBind(model) if value is true

    unbindData: ->
        @stopListening()
        delete @data

    getEl: -> if @region then @region.getEl @ else null

    $: (id) -> @$$("##{@wrapDomId id}")[0]

    $$: (selector) -> @region.$$ selector

    setRegion: (@region) ->
        @virtualEl = @getEl().cloneNode()
        @bindEvents()

    close: ->
        return @Promise.resolve @ unless @region

        @Promise.chain(
            -> @options.beforeClose?.call @
            @beforeClose
            [
                @unbindEvents
                @unbindData
                @destroyComponents
                -> @region.empty @
            ]
            -> @options.afterClose?.call @
            @afterClose
            -> delete @region
            @
        )

    wrapDomId: (id) -> "#{@id}#{id}"

    bindEvents: ->
        me = @
        events = @getOptionValue('events') or {}
        for key, value of events when D.isString value
            do (key, value) =>
                [name, id] = key.replace(/(^\s+)|(\s+$)/g, '').split /\s+/
                @error "No event handler: #{value}" unless @eventHandlers[value]
                @error 'Id is required' unless id
                star = id.slice(-1) is '*'
                wid = @wrapDomId(if star then id.slice(0, -1) else id)
                selector = if star then "[id^=#{wid}]" else '#' + wid

                handler = (e) ->
                    target = e.target or e.srcElement
                    return if A.hasClass target, 'disabled'
                    args = [e]
                    args.unshift target.getAttribute('id').slice(wid.length) if star
                    me.eventHandlers[value].apply me, args

                @region.delegateDomEvent @, name, selector, handler

    unbindEvents: ->
        @region.undelegateDomEvents @

    render: (options = {}) ->
        @error 'No region' unless @region
        @renderOptions = options

        @Promise.chain(
            @loadedPromise
            @destroyComponents
            -> @options.beforeRender?.call @
            @beforeRender
            @serializeData
            @renderTemplate
            @renderComponent
            @afterRender
            -> @options.afterRender?.call @
            @
        )

    serializeData: ->
        data = {}
        data[key] = value.data for key, value of @data
        adjusts = @getOptionValue('dataForTemplate') or {}
        data[key] = value.call @, data for key, value of adjusts
        data.Global = @app.global
        data.View = @
        data

    renderTemplate: (data) ->
        @virtualEl.innerHTML = @template data
        used = {}
        for item in A.getElementsBySelector('[id]', @virtualEl)
            id = item.getAttribute 'id'
            @error "#{id} already used" if used[id]
            used[id] = true
            item.setAttribute 'id', @wrapDomId id

        for attr in @app.options.attributesReferToId or []
            for item in A.getElementsBySelector("[#{attr}]", @virtualEl)
                value = item.getAttribute attr
                withHash = value.charAt(0) is '#'
                item.setAttribute attr, (if withHash then "##{@wrapDomId value.slice 1}" else @wrapDomId(value))

        @region.update @virtualEl

    renderComponent: ->
        components = @getOptionValue('components') or []
        promises = for component in components
            component = component.apply @ if D.isFunction component
            View.ComponentManager.create @, component if component
        @Promise.chain promises, (comps) =>
            @components[id] = component for {id, component} in comps when comp

    destroyComponents: ->
        View.ComponentManager.destroy key, @, value for key, value of @components or {}
        @components = {}

    beforeRender: ->
    afterRender: ->
    beforeClose: ->
    afterClose: ->
