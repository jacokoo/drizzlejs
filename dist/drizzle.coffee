###!
# DrizzleJS v0.2.8
# -------------------------------------
# Copyright (c) 2015 Jaco Koo <jaco.koo@guyong.in>
# Distributed under MIT license
###

((root, factory) ->
    if typeof define is 'function' and define.amd
        define ['handlebars.runtime', 'diff-dom'], (Handlebars, diffDOM) ->
            factory root, Handlebars['default'], diffDOM
    else if module and module.exports
        Handlebars = require 'handlebars.runtime'
        diffDOM = require 'diff-dom'
        module.exports = factory root, Handlebars, diffDOM
    else
        root.Drizzle = factory root, Handlebars, diffDOM
) this, (root, Handlebars, diffDOM) ->

    D = Drizzle = version: '0.2.8'

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
        Promise: root['Promise']
        ajax: null
        hasClass: (el, clazz) -> $(el).hasClass(clazz)
        getElementsBySelector: (selector, el = root.document) -> el.querySelectorAll(selector)
        delegateDomEvent: (el, name, selector, fn) ->
            $(el).on name, selector, fn
        undelegateDomEvents: (el, namespace) ->
            $(el).off namespace


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
            params = D.extend params,
                contentType: model.app.options.defaultContentType
            , options
            data = D.extend data, options.data
            params.url = url
            params.data = data
            model.Promise.chain A.ajax(params), (resp) ->
                model.set resp
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
            @data = options.data or {}
            @params = D.extend {}, options.params
            super 'D', options
            @app.delegateEvent @

        url: -> @getOptionValue('url') or ''

        getFullUrl: -> D.Request.url @

        getParams: -> D.extend {}, @params

        set: (data) ->
            d = if D.isFunction @options.parse then @options.parse.call(@, data) else data
            @data = if @options.root then d[@options.root] else d
            @changed()
            @

        changed: ->
            @trigger 'change'

        append: (data) ->
            if D.isObject @data
                D.extend @data, data
            else if D.isArray @data
                @data = @data.concat if D.isArray(data) then data else [data]
            @changed()
            @

        clear: ->
            @data = {}
            @changed()
            @

        find: (name, value) ->
            return @data[name] if D.isObject @data
            item for item in @data when item[name] is value

        findOne: (name, value) ->
            result = @find name, value
            return result unless result
            if D.isObject @data then result else result[0]


    D.Region = class Region extends D.Base
        constructor: (@app, @module, @el, @name = 'region') ->
            @error 'The DOM element for region is not found' unless @el
            @dd = new diffDOM()
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

        $$: (selector) -> A.getElementsBySelector selector, @el

        update: (el) ->
            @dd.apply @el, @dd.diff(@el, el)

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
            @virtualEl = @getEl(@).cloneNode()
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


    class Layout extends D.View
        initialize: ->
            @isLayout = true
            @loadedPromise = @loadTemplate()

    D.Module = class Module extends D.Base
        @Layout = Layout
        constructor: (@name, @app, @loader, options = {}) ->
            @separatedTemplate = options.separatedTemplate is true
            @regions = {}
            super 'M', options
            @app.modules[@id] = @
            @app.delegateEvent @

        initialize: ->
            @extend @options.extend if @options.extend
            @loadedPromise = @Promise.chain [@loadTemplate(), @loadItems()]

            @initLayout()
            @initStore()

        initLayout: ->
            layout = @getOptionValue('layout') or {}
            @layout = new Layout('layout', @, @loader, layout)

        initStore: ->
            @store = {}
            @autoLoadBeforeRender = []
            @autoLoadAfterRender = []
            doItem = (name, value) =>
                value = value.call @ if D.isFunction value
                if value and value.autoLoad
                    (if value.autoLoad is true then @autoLoadBeforeRender else @autoLoadAfterRender).push name
                @store[name] = new D.Model @app, @, value

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
                @Promise.chain @app.getLoader(name)[method](name, @, options), (obj) ->
                    obj.moduleOptions = options
                    @items[name] = obj
                    @inRegionItems[name] = obj if options.region

            @Promise.chain (doItem key, value for key, value of @getOptionValue('items') or {})

        setRegion: (@region) ->
            @Promise.chain(
                -> @layout.setRegion @region
                -> @layout.render()
                @initRegions
            )

        close: ->
            @Promise.chain(
                -> @options.beforeClose?.call @
                @beforeClose
                -> @layout.close()
                @closeRegions
                @afterClose
                -> @options.afterClose?.call @
                -> delete @app.modules[@id]
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
            (value.close() for key, value of regions or {})

        initRegions: ->
            @closeRegions() if @regions
            @regions = {}
            for item in @layout.$$('[data-region]')
                id = item.getAttribute 'data-region'
                type = item.getAttribute 'region-type'
                @regions[id] = D.Region.create type, @app, @, item, id

        renderItems: ->
            for key, value of @inRegionItems
                @error "Region:#{key} is not defined" unless @regions[key]
                @regions[key].show value

        fetchDataBeforeRender: ->
            @Promise.chain (D.Request.get @store[name] for name in @autoLoadBeforeRender)

        fetchDataAfterRender: ->
            @Promise.chain (D.Request.get @store[name] for name in @autoLoadAfterRender)

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
            path = @app.options.scriptRoot + '/' + path
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
                    resolve require(path)

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
            @Promise.chain @loadModuleResource(module, @fileNames.view + name), (options) =>
                new D.View name, module, @, options

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

            @interceptors[compose(path, key)] = value for key, value of interceptors or {}

            for key, value of routes or {}
                p = compose path, key
                @error 'Route [' + p + '] is not defined' unless D.isFunction router[value]
                @routes.unshift new Route(@app, @, compose(path, key), router[value])

        getInterceptors: (path) ->
            result = if @interceptors[''] then [@interceptors['']] else []
            items = path.split '/'
            while items.length > 0
                key = items.join '/'
                result.unshift @interceptors[key] if @interceptors[key]
                items.pop()
            result


    D.Helpers =
        layout: (app, Handlebars, options) ->
            if @View.isLayout then options.fn @ else ''

        view: (app, Handlebars, name, options) ->
            return '' if @View.isLayout or @View.name isnt name
            options.fn @




    Drizzle
