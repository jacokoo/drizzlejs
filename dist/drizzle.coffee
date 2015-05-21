###!
# DrizzleJS v0.3.3
# -------------------------------------
# Copyright (c) 2015 Jaco Koo <jaco.koo@guyong.in>
# Distributed under MIT license
###

((root, factory) ->
    if typeof define is 'function' and define.amd
        define ['handlebars.runtime'], (Handlebars) ->
            factory root, Handlebars['default']
    else if module and module.exports
        Handlebars = require('handlebars/runtime')['default']
        module.exports = factory root, Handlebars
    else
        root.Drizzle = factory root, Handlebars
) window, (root, Handlebars) ->

    D = Drizzle = version: '0.3.3'

    idCounter = 0
    toString = Object.prototype.toString
    types = [
        'Function', 'Object', 'String', 'Array', 'Number'
        'Boolean', 'Date', 'RegExp', 'Undefined', 'Null'
    ]
    compose = (args...) ->
        args.join('/').replace(/\/{2,}/g, '/').replace(/^\/|\/$/g, '')

    for item in types
        do (item) -> D["is#{item}"] = (obj) -> toString.call(obj) is "[object #{item}]"

    D.extend = (target, mixins...) ->
        return target unless target
        target[key] = value for key, value of mixin for mixin in mixins
        target

    D.include = (target, mixins...) ->
        return target unless D.isFunction target
        target::[key] = value for key, value of mixin for mixin in mixins
        target

    D.uniqueId = (prefix) -> (if prefix then prefix else '') + ++idCounter

    A = D.Adapter =
        Promise: null
        ajax: null
        hasClass: (el, clazz) ->
        addClass: (el, clazz) ->
        removeClass: (el, clazz) ->

        componentHandler: (name) ->
            creator: -> throw new Error('Component [' + name + '] is not defined')

        delegateDomEvent: (el, name, selector, fn) ->

        undelegateDomEvents: (el, namespace) ->

        getFormData: (form) ->


    D.Promise = class Promise
        constructor: (@context) ->

        create: (fn) -> new A.Promise (resolve, reject) =>
            fn.call @context, resolve, reject

        resolve: (obj) -> A.Promise.resolve obj

        reject: (obj) -> A.Promise.reject obj

        when: (obj, args...) ->
            obj = obj.apply @context, args if D.isFunction obj
            A.Promise.resolve obj

        chain: (rings...) ->
            return @resolve() if rings.length is 0

            @create (resolve, reject) =>
                prev = null

                doRing = (ring, i) =>
                    isArray = D.isArray ring
                    (if isArray
                        promises = for item in ring
                            @when (if i > 0 then [item, prev] else [item])...
                        A.Promise.all promises
                    else
                        @when (if i > 0 then [ring, prev] else [ring])...
                    ).then (data) ->
                        prev = data
                        if rings.length is 0 then resolve(prev) else doRing(rings.shift(), ++i)
                    , (data) ->
                        reject data

                doRing rings.shift(), 0


    D.Event =
        on: (name, callback, context) ->
            @events or= {}
            (@events[name] or= []).push fn: callback, ctx: context
            @

        off: (name, callback, context) ->
            return @ unless @events
            return (@events = {}) and @ unless name
            return @ unless @events[name]
            return (delete @events[name]) and @ unless callback

            @events[name] = (item for item in @events[name] when item.fn isnt callback or (context and context isnt item.ctx))
            delete @events[name] if @events[name].length is 0
            @

        trigger: (name, args...) ->
            return @ unless @events and @events[name]
            item.fn.apply item.context, args for item in @events[name]
            @

        delegateEvent: (target) ->
            id = "--#{target.id}"
            D.extend target,
                on: (name, callback) => target.listenTo @, name + id, callback

                off: (name, callback) => target.stopListening @, (name and name + id), callback

                trigger: (name, args...) =>
                    args.unshift name + id
                    @trigger args...
                    target

                listenTo: (obj, name, callback) ->
                    @listeners or= {}
                    (@listeners[name] or= []).push fn: callback, obj: obj
                    obj.on name, callback, @
                    @

                stopListening: (obj, name, callback) ->
                    return @ unless @listeners
                    unless obj
                        item.obj.off key, item.fn, @ for item in value for key, value of @listeners
                        @listeners = {}
                        return @

                    for key, value of @listeners when not name or name is key
                        @listeners[key] = []
                        for item in value
                            if item.obj isnt obj or (callback and callback isnt item.fn)
                                @listeners[key].push item
                            else
                                item.obj.off key, item.fn, @
                        delete @listeners[key] if @listeners[key].length is 0
                    @

            @


    D.Request =
        url: (model) ->
            options = model.app.options
            urls = [options.urlRoot]
            urls.push model.module.options.urlPrefix if model.module.options.urlPrefix
            urls.push model.module.name
            base = model.url or ''
            base = base.apply model if D.isFunction base

            while base.indexOf('../') is 0
                urls.pop()
                base = base.slice 3

            urls.push base if base
            urls.push model.data.id if model.data.id
            if options.urlSuffix
                urls.push urls.pop() + options.urlSuffix
            compose urls...

        get: (model, options) -> @ajax type: 'GET', model, model.getParams(), options
        post: (model, options) -> @ajax type: 'POST', model, model.data, options
        put: (model, options) -> @ajax type: 'PUT', model, model.data, options
        del: (model, options) -> @ajax type: 'DELETE', model, model.data, options
        save: (model, options) -> if model.data.id then @put(model, options) else @post(model, options)

        ajax: (params, model, data, options = {}) ->
            url = @url model
            params = D.extend params, options
            data = D.extend data, options.data
            params.url = url
            params.data = data
            model.Promise.chain A.ajax(params), (resp) ->
                model.set resp
                model.changed()
                model


    D.Factory =

        types: {}

        register: (type, clazz) -> @types[type] = clazz

        create: (type, args...) ->
            clazz = @types[type] or @
            new clazz args...


    D.Base = class Base
        constructor: (idPrefix, @options = {}) ->
            @id = D.uniqueId(idPrefix)
            @Promise = new D.Promise @
            @initialize()

        initialize: ->

        getOptionValue: (key) ->
            value = @options[key]
            if D.isFunction value then value.apply @ else value

        error: (message) ->
            throw message unless D.isString message
            msg = if @module then "[#{@module.name}:" else '['
            msg += "#{@name}] #{message}"
            throw new Error msg

        extend: (mixins) ->
            return unless mixins

            doExtend = (key, value) =>
                if D.isFunction value
                    old = @[key]
                    @[key] = (args...) ->
                        args.unshift old if old
                        value.apply @, args
                else
                    @[key] = value unless @[key]

            doExtend key, value for key, value of mixins


    defaultOptions =
        scriptRoot: 'app'
        urlRoot: ''
        urlSuffix: ''
        caseSensitiveHash: false
        defaultRegion: root.document.body
        disabledClass: 'disabled'
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
            pageSize: 10
            pageKey: '_page'
            pageSizeKey: '_pageSize'
            recordCountKey: 'recordCount'

        actionPromised: (promise) ->

    D.Application = class Application extends D.Base
        constructor: (options = {}) ->
            opt = D.extend {}, defaultOptions, options
            @modules = {}
            @global = {}
            @loaders = {}
            @regions = []

            super 'A', opt

        initialize: ->
            @registerLoader new D.SimpleLoader(@)
            @registerLoader new D.Loader(@), true
            @registerHelper key, value for key, value of D.Helpers
            @setRegion new D.Region(@, null, @options.defaultRegion)

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

        load: (names...) ->
            @Promise.chain (@getLoader(name).loadModule name for name in names)

        show: (name, options) ->
            @region.show name, options

        destory: ->
            @Promise.chain (region.close() for region in @regions)
            @off()

        startRoute: (defaultPath, paths...) ->
            @router = new D.Router(@) unless @router
            @Promise.chain @router.mountRoutes(paths...), -> @router.start defaultPath

        navigate: (path, trigger) ->
            @router.navigate(path, trigger)

        dispatch: (name, payload) ->
            {name, payload} = name unless payload
            @trigger "app.#{name}", payload

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


    D.Model = class Model extends D.Base
        constructor: (@app, @module, options = {}) ->
            @params = D.extend {}, options.params
            super 'D', options
            @app.delegateEvent @

        initialize: ->
            @data = @options.data or {}

        url: -> @getOptionValue('url') or ''

        getFullUrl: -> D.Request.url @

        getParams: -> D.extend {}, @params

        set: (data, trigger) ->
            d = if D.isFunction @options.parse then @options.parse.call(@, data) else data
            @data = if @options.root then d[@options.root] else d
            @changed() if trigger
            @

        changed: ->
            @trigger 'change'

        clear: (trigger) ->
            @data = {}
            @changed() if trigger
            @

    D.extend D.Model, D.Factory


    D.Region = class Region extends D.Base
        constructor: (@app, @module, @el, @name = 'region') ->
            @error 'The DOM element for region is not found' unless @el
            super 'R'

        isCurrent: (item) ->
            return false unless @current
            return true if D.isObject(item) and item.id is @current.id
            return true if D.isString(item) and D.Loader.analyse(item).name is @current.name
            false

        show: (item, options = {}) ->
            if @isCurrent item
                return @Promise.resolve(@current) if options.forceRender is false
                return @Promise.chain @current.render(options), @current

            item = @app.getLoader(item).loadModule(item) if D.isString item
            @Promise.chain item, (obj) ->
                @error "Can not render #{obj}" unless obj.render and obj.setRegion
                obj
            , [(obj) ->
                @Promise.chain(
                    -> obj.region.close() if obj.region
                    obj
                )
            , ->
                @close()
            ], ([obj]) ->
                @current = obj
                @Promise.chain obj.setRegion(@), obj
            , (obj) ->
                obj.render(options)

        close: -> @Promise.chain(
            -> @current.close() if @current
            ->
                delete @current
                @
        )

        getEl: -> @el

        $$: (selector) -> @el.querySelectorAll selector

        empty: -> @el.innerHTML = ''

        delegateDomEvent: (item, name, selector, fn) ->
            n = "#{name}.events#{@id}#{item.id}"
            A.delegateDomEvent @el, n, selector, fn

        undelegateDomEvents: (item) ->
            A.undelegateDomEvents @el, ".events#{@id}#{item.id}"

    D.extend D.Region, D.Factory


    D.View = class View extends Base
        @ComponentManager =
            handlers: {}
            componentCache: {}
            createDefaultHandler: A.componentHandler()
            register: (name, creator, destructor = ( -> )) ->
                @handlers[name] = creator: creator, destructor: destructor

            create: (view, options = {}) ->
                {id, name, selector, options: opt} = options
                view.error 'Component name can not be null' unless name

                handler = @handlers[name] or @createDefaultHandler(name)
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
            @eventKeys = {}
            super 'V', options
            @app.delegateEvent @

        initialize: ->
            @extend @options.extend if @options.extend
            @loadedPromise = @loadTemplate()

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

            doBind = (model) => @listenTo model, 'change', => @render @renderOptions if @region

            for key, value of bind
                model = @data[key] = @module.store[key]
                @error "No model: #{key}" unless model
                doBind(model) if value is true

        unbindData: ->
            @stopListening()
            delete @data

        getEl: -> if @region then @region.getEl @ else null

        $: (id) -> @$$("##{@wrapDomId id}")[0]

        $$: (selector) -> @getEl().querySelectorAll selector

        setRegion: (@region) ->
            @virtualEl = @getEl().cloneNode()
            @bindEvents()
            @bindActions()
            @bindData()

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

        analyseEventKey: (token) ->
            return @eventKeys[token] if @eventKeys[token]

            [name, id] = token.replace(/(^\s+)|(\s+$)/g, '').split /\s+/
            @error 'Id is required' unless id
            star = id.slice(-1) is '*'
            wid = @wrapDomId(if star then id.slice(0, -1) else id)
            selector = if star then "[id^=#{wid}]" else '#' + wid

            @eventKeys[token] = [name, id, star, wid, selector]

        bindEvents: ->
            events = @getOptionValue('events') or {}
            for key, value of events when D.isString value
                do (key, value) =>
                    @error "No event handler: #{value}" unless @eventHandlers[value]
                    [..., star, wid, s] = @analyseEventKey key

                    handler = (e) =>
                        target = e.target or e.srcElement
                        return if A.hasClass target, 'disabled'
                        args = [e]
                        args.unshift target.getAttribute('id').slice(wid.length) if star
                        @eventHandlers[value].apply @, args

                    @delegateEvent key, handler

        bindActions: ->
            actions = @getOptionValue('actions') or {}
            for key, value of actions when D.isString value
                do (key, value) =>
                    @delegateEvent key, @createActionEventHandler(value)

        createActionEventHandler: (name) ->
            el = @getEl()
            dataForAction = @getOptionValue('dataForAction') or {}
            disabled = @app.options.disabledClass
            (e) =>
                rootEl = target = e.target or e.srcElement
                return if A.hasClass target, disabled
                A.addClass target, disabled

                while rootEl and rootEl isnt el and rootEl.tagName isnt 'FORM'
                    rootEl = rootEl.parentNode

                data = @getActionData rootEl, target
                data = dataForAction[name].apply @, [data, e] if D.isFunction(dataForAction[name])
                @Promise.chain data
                , (d) ->
                    @module.dispatch(name, d) if d isnt false
                , ->
                    A.removeClass target, disabled

        getActionData: (el, target) ->
            el or= @getEl()
            data = if el.tagName is 'FORM' then A.getFormData(el) else {}
            containsTarget = false
            for item in el.querySelectorAll('[data-name][data-value]')
                containsTarget = true if item is target
                n = item.getAttribute 'data-name'
                value = item.getAttribute 'data-value'
                v = data[n]
                if not v
                    data[n] = value
                else
                    v = data[n] = [data[n]] unless D.isArray v
                    v.push value

            if containsTarget
                n = target.getAttribute 'data-name'
                data[n] = target.getAttribute 'data-value'

            data

        delegateEvent: (token, handler) ->
            [name, ..., selector] = @analyseEventKey token
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
            for item in @virtualEl.querySelectorAll('[id]')
                id = item.getAttribute 'id'
                @error "#{id} already used" if used[id]
                used[id] = true
                item.setAttribute 'id', @wrapDomId id

            for attr in @app.options.attributesReferToId or []
                for item in @virtualEl.querySelectorAll("[#{attr}]")
                    value = item.getAttribute attr
                    withHash = value.charAt(0) is '#'
                    item.setAttribute attr, (if withHash then "##{@wrapDomId value.slice 1}" else @wrapDomId(value))

            @updateDom()

        updateDom: ->
            @getEl().innerHTML = @virtualEl.innerHTML

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

    D.extend D.View, D.Factory


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
                    @inRegionItems[name] = obj if options.region

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


    D.Loader = class Loader extends D.Base
        @analyse: (name) ->
            return loader: null, name: name unless D.isString name

            [loaderName, name, args...] = name.split ':'
            if not name
                name = loaderName
                loaderName = null
            loader: loaderName, name: name, args: args

        constructor: (@app) ->
            @name = 'default'
            @fileNames = @app.options.fileNames
            super 'L'

        loadResource: (path) ->
            path = compose(@app.options.scriptRoot, path)
            @Promise.create (resolve, reject) ->

                if @app.options.amd
                    error = (e) ->
                        if e.requireModules?[0] is path
                            define path, null
                            require.undef path
                            require [path], ->
                            resolve null
                        else
                            reject null
                            throw e
                    require [path], (obj) ->
                        resolve obj
                    , error
                else
                    resolve require('./' + path)

        loadModuleResource: (module, path) ->
            @loadResource module.name + '/' + path

        loadModule: (path, parent) ->
            {name} = Loader.analyse path
            @Promise.chain @loadResource(name + '/' + @fileNames.module), (options) =>
                module = new D.Module name, @app, @, options
                module.module = parent if parent
                module

        loadView: (name, module, options) ->
            {name} = Loader.analyse name
            @Promise.chain @loadModuleResource(module, @fileNames.view + name), (options = {}) =>
                D.View.create options.type, name, module, @, options

        #load template for module
        loadTemplate: (module) ->
            @loadModuleResource(module, @fileNames.templates)

        #load template for view
        loadSeparatedTemplate: (view, name) ->
            @loadModuleResource(module, @fileNames.template + name)

        loadRouter: (path) ->
            {name} = Loader.analyse path
            path = name + '/' + @fileNames.router
            @loadResource(path)

    D.SimpleLoader = class SimpleLoader extends D.Loader
        constructor: ->
            super
            @name = 'simple'

        loadModule: (path, parentModule) ->
            {name} = Loader.analyse path
            module = new D.Module(name, @app, @, separatedTemplate: true)
            module.parentModule = parentModule if parentModule
            @Promise.resolve module

        loadView: (name, module, item) ->
            {name} = Loader.analyse name
            @Promise.resolve new D.View(name, module, @, {})


    pushStateSupported = root.history and 'pushState' of root.history

    class Route
        regExps: [
            /:([\w\d]+)/g
            '([^\/]+)'
            /\*([\w\d]+)/g
            '(.*)'
        ]
        constructor: (@app, @router, @path, @fn) ->
            pattern = @path.replace(@regExps[0], @regExps[1]).replace(@regExps[2], @regExps[3])
            @pattern = new RegExp "^#{pattern}$", if @app.options.caseSensitiveHash then 'g' else 'gi'

        match: (hash) ->
            @pattern.lastIndex = 0
            @pattern.test hash

        handle: (hash) ->
            @pattern.lastIndex = 0
            args = @pattern.exec(hash).slice 1
            handlers = @router.getInterceptors(@path)
            handlers.push @fn

            fns = for route, i in handlers
                do (route, i) =>
                    (prev) => route.apply @router, (if i > 0 then [prev].concat args else args)
            @router.Promise.chain fns...

    D.Router = class Router extends D.Base
        constructor: (@app) ->
            @routes = []
            @routeMap = {}
            @interceptors = {}
            @started = false
            super 'R'

        initialize: ->
            @addRoute '/', @app.options.defaultRouter or {}

        getHash: -> root.location.hash.slice 1

        start: (defaultPath) ->
            return if @started
            @started = true
            key = if pushStateSupported then 'popstate.dr' else 'hashchange.dr'
            A.delegateDomEvent root, key, null, => @dispatch @getHash()

            if hash = @getHash()
                @navigate hash
            else if defaultPath
                @navigate defaultPath

        stop: ->
            A.undelegateDomEvents root, '.dr'
            @started = false

        dispatch: (hash) ->
            return if @previousHash is hash
            @previousHash = hash

            return route.handle hash for route in @routes when route.match hash

        navigate: (path, trigger = true) ->
            if pushStateSupported
                root.history.pushState {}, root.document.title, "##{path}"
            else
                root.location.replace "##{path}"

            @dispatch path if trigger

        mountRoutes: (paths...) -> @Promise.chain(
            @app.getLoader(path).loadRouter(path) for path in paths
            (routers) -> @addRoute paths[i], router for router, i in routers
        )

        addRoute: (path, router) ->
            {routes, interceptors} = router
            routes = routes.call @ if D.isFunction routes
            interceptors = interceptors.call @ if D.isFunction interceptors

            @interceptors[compose(path, key)] = router[value] for key, value of interceptors or {}

            for key, value of routes or {}
                p = compose path, key
                @error 'Route [' + p + '] is not defined' unless D.isFunction router[value]
                @routes.unshift new Route(@app, @, compose(path, key), router[value])

        getInterceptors: (path) ->
            result = []
            items = path.split '/'
            items.pop()
            while items.length > 0
                key = items.join '/'
                result.unshift @interceptors[key] if @interceptors[key]
                items.pop()

            if @interceptors[''] then result.unshift @interceptors['']
            result


    D.Helpers =
        layout: (app, Handlebars, options) ->
            if @View.isLayout then options.fn @ else ''

        view: (app, Handlebars, name, options) ->
            return '' if @View.isLayout or @View.name isnt name
            options.fn @


    D.PageableModel = class PageableModel extends D.Model
        constructor: ->
            super
            defaults = @app.options.pagination
            @pagination =
                page: @options.page or 1
                pageCount: 0
                pageSize: @options.pageSize or defaults.pageSize
                pageKey: @options.pageKey or defaults.pageKey
                pageSizeKey: options.pageSizeKey or defaults.pageSizeKey
                recordCountKey: options.recordCountKey or defaults.recordCountKey

        initialize: -> @data = @options.data or []

        set: (data) ->
            p = @pagination
            p.recordCount = data[p.recordCountKey]
            p.pageCount = Math.ceil(p.recordCount / p.pageSize)
            super

        getParams: ->
            params = super or {}
            p = @pagination
            params[p.pageKey] = p.page
            params[p.pageSizeKey] = p.pageSize
            params

        clear: ->
            @pagination.page = 1
            @pagination.pageCount = 0
            super

        turnToPage: (page) ->
            @pagination.page = page if page <= @pagination.pageCount and page >= 1
            @

        firstPage: -> @turnToPage 1
        lastPage: -> @turnToPage @pagination.pageCount
        nextPage: -> @turnToPage @pagination.page + 1
        prevPage: -> @turnToPage @pagination.page - 1

        getPageInfo: ->
            {page, pageSize, recordCount} = @pagination
            d = if @data.length > 0
                page: page, start: (page - 1) * pageSize + 1, end: page * pageSize, total: recordCount
            else
                page: page, start: 0, end: 0, total: 0

            d.end = d.total if d.end > d.total
            d

    D.Model.register 'pagaable', D.PageableModel


    D.MultiRegion = class MultiRegion extends D.Region
        constructor: ->
            super
            @items = {}
            @elements = {}

        activate: (item) ->

        createElement: (key, item) ->
            el = root.document.createElement 'div'
            @el.append el
            el

        getKey: (item) ->
            key = item.moduleOptions?.key or item.renderOptions?.key
            @error 'Region key is required' unless key
            key

        getEl: (item) ->
            return @el if not item

            key = @getKey item
            @items[key] = item
            @elements[key] or (@elements[key] = @createElement(key, item))

        update: (el, item) ->
            e = @getEl(item)
            @dd.apply @e, @dd.diff(@e, el)

        empty: (item) ->
            if item
                el = @getEl(item)
                el.parentNode.removeChild(el)
            else
                @el.innerHTML = ''

        close: ->
            delete @current
            @elements = {}
            items = @items
            @items = {}
            @Promise.chain (item.close() for key, item of items)


    Drizzle
