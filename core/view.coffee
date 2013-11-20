define [
    'jquery'
    'underscore'
    './base'
    './config'
], ($, _, Base, config) ->

    class View extends Base
        @ComponentManager =
            handlers: {}
            register: (name, creator, destructor = (->), initializer = (->)) ->
                @handlers[name] =
                    creator: creator, destructor: destructor, initializer: initializer, initialized: false

            create: (view, options = {}) ->
                {id, name, selector} = options
                opt = options.options
                return view.logger.error "Component name can not be null" unless name
                view.logger.warn "Component ID is null" unless id

                dom = if selector then view.$$(selector) else if id then view.$(id) else view.region.getEl()
                handler = @handlers[name] or creator: (view, el, options) ->
                    view.logger.error "No component handler for name: #{name}" unless el[name]
                    el[name] options
                , destructor: (view, info) ->
                    el[name] 'destroy'
                , initialized: true

                obj = if not handler.initialized and handler.initializer then handler.initializer() else null
                handler.initialized = true
                view.chain "Create component #{name}", obj, handler.creator(view, dom, opt), (comp) ->
                    id: id, component: comp, info:
                        destructor: handler.destructor, options: opt

            destroy: (view, component, info) ->
                info.destructor?(view, component, info.options)

        constructor: (@name, @module, @loader, @options = {}) ->
            @id = _.uniqueId 'v'
            @app = @module.app
            @eventHandlers = {}
            super

        initialize: ->
            @extend @options.extend if @options.extend
            @loadDeferred = @chain "Initialize view #{@name}", [@loadTemplate(), @loadHandlers(), @bindData()]

        loadTemplate: ->
            if @module.separatedTemplate isnt true
                @chain @module.loadDeferred, => @template = @module.template
            else
                template = @getOptionResult(@options, 'template') or @name
                @chain @app.getLoader(template).loadSeparatedTemplate(@, template), (t) =>
                    @template = t

        loadHandlers: ->
            handlers = @getOptionResult(@options, 'handlers') or @name
            @chain @app.getLoader(handlers).loadHandlers(@, handlers), (handlers) =>
                _.extend @eventHandlers, handlers

        # Bring model or collection from module to view, make them visible to render template
        # Bind model or collection events to call methods in view
        # eg.
        # bind: {
        #   item: 'all#render, reset#handlerName'
        # }
        bindData: ->
            @module.loadDeferred.done =>
                bind = @getOptionResult(@options, 'bind') or {}
                @data = {}
                @listeners = {}
                for key, value of bind
                    do (key, value) =>
                        @data[key] = @module.data[key]
                        throw new Error "Model or Collection: #{key} doesn't exists" unless @data[key]
                        return unless value
                        bindings = value.replace(/\s+/g, '').split ','
                        for binding in bindings
                            do (binding) =>
                                [name, method] = binding.split '#'
                                throw new Error "Data bindings only can be defined as eventName#methodName" unless name and method
                                listener = name: name, fn: (args...) =>
                                    return @[method]?.apply @, args
                                    return @eventHandlers[method]?.apply @, args
                                    @logger.error "Can not find view method or event handler with name:#{method}"
                                @listeners[key] or = []
                                @listeners[key].push listener
                                @data[key].on listener.name, listener.fn

        unbindData: ->
            for key, value of @data or {}
                value.off listener.name, listener.fn for listener in @listeners[key] or []
            delete @data
            delete @listeners

        wrapDomId: (id) ->
            "#{@id}-#{id}"

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
            events = @getOptionResult(@options, 'events') or {}
            for key, value of events
                @logger.error 'The value of events can only be a string' unless _.isString value
                [name, id] = key.replace(/^\s+/g, '').replace(/\s+$/, '').split /\s+/
                if id
                    if id.charAt(id.length - 1) is '*'
                        id = id.substring(0, id.length - 1)
                        id = @wrapDomId id
                        selector = "[id^=#{id}]"
                    else
                        id = @wrapDomId id
                        selector = "##{id}"
                handler = @createHandler name, id, selector, value
                @region.delegateEvent @, name, selector, handler

        createHandler: (name, id, selector, value) ->
            me = @
            (args...) ->
                el = $ @

                if selector.charAt(0) isnt '#'
                    i = el.attr 'id'
                    args.unshift i.substring id.length

                me.loadDeferred.done ->
                    method = me.eventHandlers[value]
                    return me.logger.error "No handler defined with name: #{value}" unless method
                    method.apply me, args

        $: (id) ->
            return @logger.error "Region is null" unless @region
            @region.$$ '#' + @wrapDomId id

        $$: (selector) ->
            return @logger.error "Region is null" unless @region
            @region.$$ selector

        close: ->
            @region.undelegateEvents(@)
            @unbindData()
            @destroyComponents()

        render: ->
            @logger.error 'No region to render in' unless @region

            @chain "render view #{@name}",
                @loadDeferred
                -> @options.beforeRender?.apply(@)
                @beforeRender
                @serializeData
                @options.adjustData or (data) -> data
                @executeTemplate
                @processIdReplacement
                -> @renderComponent()
                @exportRegions
                @afterRender
                -> @options.afterRender?.apply(@)

        beforeRender: ->
            @destroyComponents()

        destroyComponents: ->
            components = @components or {}
            for key, value of components
                View.ComponentManager.destroy @, value, @componentInfos[key]

            @components = {}
            @componentInfos = {}
            @componentIndex = 0

        serializeData: ->
            data = {}
            for key, value of @data
                data[key] = value.toJSON()
            data.Global = @app.global
            data.View = @
            console.log data

            data

        executeTemplate: (data, ignore, deferred) ->
            data.global = @app.global
            html = @template data
            @region.attachHtml html

        processIdReplacement: ->
            used = {}

            @$$('[id]').each (i, el) =>
                el = $ el
                id = el.attr 'id'
                return @logger.error "The id:#{id} is used more than once." if used[id]
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
                View.ComponentManager.create @, component
            @chain promises, (comps) =>
                for comp in comps
                    id = comp.id or @componentIndex++
                    @components[id] = comp.component
                    @componentInfos[id] = comp.info

        exportRegions: ->
            @$$('[data-region]').each (i, el) =>
                el = $ el
                id = el.attr 'data-region'
                @module.addRegion id, el

        afterRender: ->
