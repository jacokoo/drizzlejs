# DrizzleJS v0.2.4
# -------------------------------------
# Copyright (c) 2014 Jaco Koo <jaco.koo@guyong.in>
# Distributed under MIT license

((root, factory) ->
    if typeof define is 'function' and define.amd
        define ['jquery', 'handlebars'], ($, Handlebars) -> factory root, $, Handlebars
    else if module and module.exports
        $ = require 'jquery'
        Handlebars = require 'handlebars'
        module.exports = factory root, $, Handlebars
    else
        root.Drizzle = factory root, $
) this, (root, $, Handlebars) ->

    D = Drizzle = version: '0.2.4'

    oldReference = root.Drizzle
    idCounter = 0

    for item in ['Function', 'Object', 'String', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null']
        do (item) -> D["is#{item}"] = (obj) -> Object.prototype.toString.call(obj) is "[object #{item}]"

    D.extend = (target, mixins...) ->
        return target unless D.isObject target
        target[key] = value for key, value of mixin for mixin in mixins
        target

    D.extend D,
        uniqueId: (prefix) -> (if prefix then prefix else '') + ++idCounter
        noConflict: ->
            root.Drizzle = oldReferrence
            D
        joinPath: (paths...) ->
            path = paths.join('/')
            s = ''
            if path.indexOf('http') is 0
                s = path.slice 0, 7
                path = path.slice 7
            path = path.replace(/\/+/g, '/')
            s + path

    D.Deferred =

        createDeferred: ->
            (D.deferredCount or= 1)
            D.deferredCount++
            $.Deferred()

        createRejectedDeferred: (args...) ->
            d = @createDeferred()
            d.reject args...
            d

        createResolvedDeferred: (args...) ->
            d = @createDeferred()
            d.resolve args...
            d


        deferred: (fn, args...) ->
            fn = fn.apply @, args if D.isFunction fn
            return fn.promise() if fn?.promise
            obj = @createDeferred()
            obj.resolve fn
            obj.promise()

        chain: (rings...) ->
            obj = @createDeferred()
            if rings.length is 0
                obj.resolve()
                return obj.promise()

            gots = []
            doItem = (item, i) =>
                gotResult = (data) ->
                    data = data[0] if not D.isArray(item) and data.length < 2
                    gots.push data

                (if D.isArray item
                    promises = for inArray in item
                        args = [inArray]
                        args.push gots[i - 1] if i > 0
                        @deferred(args...)
                    $.when(promises...)
                else
                    args = [item]
                    args.push gots[i - 1] if i > 0
                    @deferred(args...)
                ).done (data...) ->
                    gotResult data
                    if rings.length is 0 then obj.resolve gots[gots.length - 1] else doItem(rings.shift(), ++i)
                .fail (data...) ->
                    gotResult data
                    obj.reject gots...

            doItem rings.shift(), 0
            obj.promise()


    D.Event =
        on: (name, callback, context) ->
            @registeredEvents or= {}
            (@registeredEvents[name] or= []).push fn: callback, context: context
            @

        off: (name, callback, context) ->
            return @ unless @registeredEvents and events = @registeredEvents[name]
            @registeredEvents[name] = (item for item in events when item.fn isnt callback or (context and context isnt item.context))
            delete @registeredEvents[name] if @registeredEvents[name].length is 0
            @

        trigger: (name, args...) ->
            return @ unless @registeredEvents and events = @registeredEvents[name]
            item.fn.apply item.context, args for item in events
            @

        delegateEvent: (target) -> D.extend target,
            on: (name, callback, context) =>
                target.listenTo @, "#{name}.#{target.id}", callback, context
                target

            off: (args...) =>
                if args.length > 0
                    args.unshift "#{args.shift()}.#{target.id}"
                args.unshift @
                target.stopListening args...
                target

            trigger: (name, args...) =>
                args.unshift "#{name}.#{target.id}"
                @trigger args...
                target

            listenTo: (obj, name, callback, context) ->
                ctx = context or @
                @registeredListeners or= {}
                (@registeredListeners[name] or= []).push fn: callback, obj: obj, context: ctx
                obj.on name, callback, ctx
                @

            stopListening: (obj, name, callback) ->
                return @ unless @registeredListeners
                unless obj
                    item.obj.off key, item.fn, @ for item in value for key, value of @registeredListeners
                    @registeredListeners = {}
                    return @

                for key, value of @registeredListeners
                    continue if name and name isnt key
                    @registeredListeners[key] = []
                    for item in value
                        if item.obj isnt obj or (callback and callback isnt item.fn)
                            @registeredListeners[key].push item
                        else
                            item.obj.off key, item.fn, item.context
                    delete @registeredListeners[key] if @registeredListeners[key].length is 0
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
            D.joinPath urls...

        get: (model, options) -> @ajax type: 'GET', model, model.getParams(), options
        post: (model, options) -> @ajax type: 'POST', model, model.data, options
        put: (model, options) -> @ajax type: 'PUT', model, model.data, options
        del: (model, options) -> @ajax type: 'DELETE', model, model.data, options

        ajax: (params, model, data, options = {}) ->
            url = @url model
            params = D.extend params,
                contentType: model.app.options.defaultContentType
            , options
            data = D.extend data, options.data
            params.url = url
            params.data = data
            model.chain $.ajax(params), ([resp, status, xhr]) ->
                model.set resp
                xhr


    Drizzle.Base = class Base

        @include: (mixins...) ->
            @::[key] = value for key, value of mixin for mixin in mixins
            @

        @include Drizzle.Deferred

        constructor: (idPrefix) ->
            @id = Drizzle.uniqueId(idPrefix)
            @initialize()

        initialize: ->

        getOptionResult: (value) -> if D.isFunction value then value.apply @ else value

        extend: (mixins) ->
            return unless mixins

            doExtend = (key, value) =>
                if Drizzle.isFunction value
                    old = @[key]
                    @[key] = (args...) ->
                        args.unshift old if old
                        value.apply @, args
                else
                    @[key] = value unless @[key]

            doExtend key, value for key, value of mixins


    DefaultConfigs =
        scriptRoot: 'app'
        urlRoot: ''
        urlSuffix: ''
        defaultContentType: 'application/json'
        caseSensitiveHash: false
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
            handler: 'handler-'       # event handler file name prefix
            model: 'model-'           # model definition file name prefix
            collection: 'collection-' # collection definition file name prefix
            router: 'router'
            templateSuffix: '.html'

        pagination:
            defaultPageSize: 10
            pageKey: '_page'
            pageSizeKey: '_pageSize'
            recordCountKey: 'recordCount'

        defaultRouter:
            routes: 'module/*name': 'showModule'
            showModule: (name) -> @app.show name

        clickDeferred: ->

    D.Application = class Application extends D.Base
        constructor: (options = {}) ->
            @options = D.extend {}, DefaultConfigs, options
            @modules = new Module.Container()
            @global = {}
            @loaders = {}
            @regions = []

            super 'a'
            @modules.delegateEvent @

        initialize: ->
            @registerLoader new D.SimpleLoader(@)
            @registerLoader new D.Loader(@), true
            @registerHelper key, value for key, value of D.Helpers
            @setRegion new D.Region(@, null, $(document.body))

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

        startRoute: (defaultPath, paths...) ->
            @router = new D.Router(@) unless @router

            @chain @router.mountRoutes(paths...), -> @router.start defaultPath

        navigate: (path, trigger) ->
            @router.navigate(path, trigger)

        load: (names...) ->
            @chain (@getLoader(name).loadModule name for name in names)

        show: (feature, options) ->
            @region.show feature, options

        destory: ->
            @chain (region.close() for region in @regions)

        #methods for notification
        message:
            success: (title, content) ->
                alert content or title

            info: (title, content) ->
                content = title unless content
                alert content or title

            error: (title, content) ->
                content = title unless content
                alert content or title


    D.Model = class Model extends D.Base

        constructor: (@app, @module, @options = {}) ->
            @data = @options.data or {}
            @params = {}

            if options.pageable
                defaults = @app.options.pagination
                p = @pagination =
                    page: options.page or 1
                    pageCount: 0
                    pageSize: options.pageSize or defaults.defaultPageSize
                    pageKey: options.pageKey or defaults.pageKey
                    pageSizeKey: options.pageSizeKey or defaults.pageSizeKey
                    recordCountKey: options.recordCountKey or defaults.recordCountKey

            super 'd'
            @module.container.delegateEvent @

        set: (data) ->
            @data = if D.isFunction @options.parse then @options.parse data else data
            if p = @pagination
                p.recordCount = @data[p.recordCountKey]
                p.pageCount = Math.ceil(p.recordCount / p.pageSize)
            @data = @data[@options.root] if @options.root
            @

        append: (data) ->
            if D.isObject @data
                D.extend @data, data
            else if D.isArray @data
                @data = @data.concat if D.isArray(data) then data else [data]
            @

        find: (name, value) ->
            return null unless D.isArray @data
            item for item in @data when item[name] is value

        findOne: (name, value) ->
            return null unless D.isArray @data
            return item for item in @data when item[name] is value

        url: -> @getOptionResult(@options.url) or ''

        getFullUrl: -> D.Request.url @

        toJSON: -> @data

        getParams: ->
            d = {}
            if p = @pagination
                d[p.pageKey] = p.page
                d[p.pageSizeKey] = p.pageSize

            D.extend d, @params, @options.params

        clear: ->
            @data = {}
            if p = @pagination
                p.page = 1
                p.pageCount = 0

        turnToPage: (page, options) ->
            return @createRejectedDeferred() unless (p = @pagination) and page <= p.pageCount and page >= 1
            p.page = page
            @get options

        firstPage: (options) ->
            return @createRejectedDeferred() if (p = @pagination) and p.page is 1
            @turnToPage 1, options
        lastPage: (options) ->
            return @createRejectedDeferred() if (p = @pagination) and p.page is p.pageCount
            @turnToPage @pagination.pageCount, options
        nextPage: (options) -> @turnToPage @pagination.page + 1, options
        prevPage: (options) -> @turnToPage @pagination.page - 1, options

        getPageInfo: ->
            return {} unless p = @pagination
            d = if @data.length > 0
                start: (p.page - 1) * p.pageSize + 1, end: p.page * p.pageSize,  total: p.recordCount
            else
                start: 0, end: 0, total: 0

            d.end = d.total if d.end > d.total
            d

    for item in ['get', 'post', 'put', 'del']
        do (item) -> D.Model::[item] = (options) ->
            @chain D.Request[item](@, options), ([..., xhr]) ->
                @trigger 'sync'
                xhr


    D.Region = class Region extends D.Base
        @types = {}
        @register: (name, clazz) -> @types[name] = clazz
        @create: (type, app, module, el) ->
            clazz = @types[type] or Region
            new clazz(app, module, el)

        constructor: (@app, @module, el) ->
            @el = if el instanceof $ then el else $ el
            super 'r'

            throw new Error "Can not find DOM element: #{el}" if @el.size() is 0

        getEl: -> @el

        getCurrentItem: -> @currentItem

        setCurrentItem: (item) -> @currentItem = item

        # show the specified item which could be a view or a module
        show: (item, options = {}) ->
            if cur = @getCurrentItem item, options
                if (D.isObject(item) and item.id is cur.id) or (D.isString(item) and D.Loader.analyse(item).name is cur.name)
                    return @chain cur.render(options), cur

            @chain (if D.isString(item) then @app.getLoader(item).loadModule(item) else item), (item) ->
                throw new Error "Can not show item: #{item}" unless item.render and item.setRegion
                item
            , [(item) ->
                item.region.close() if item.region
                item
            , ->
                @close cur
            ], ([item]) ->
                item.setRegion @
                @setCurrentItem item, options
                item
            , (item) ->
                item.render(options)

        close: ->
            item = @currentItem
            delete @currentItem
            @chain(
                -> item.close() if item
                @
            )

        delegateEvent: (item, name, selector, fn) ->
            n = "#{name}.events#{@id}#{item.id}"
            if selector then @el.on n, selector, fn else @el.on n, fn

        undelegateEvents: (item) ->
            @el.off ".events#{@id}#{item.id}"

        $$: (selector) ->
            @el.find selector

        setHtml: (html) -> @el.html html

        empty: -> @el.empty()


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
            @app = @module.app
            @eventHandlers = {}
            super 'v'
            @module.container.delegateEvent @

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
                    selector = if id.charAt(id.length - 1) is '*' then "[id^=#{id = @wrapDomId id.slice(0, -1)}]" else "##{id = @wrapDomId id}"
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
            throw new Error "Region is null" unless @region
            @region.$$ '#' + @wrapDomId id

        $$: (selector) ->
            throw new Error "Region is null" unless @region
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
                @
            )

        render: ->
            throw new Error 'No region to render in' unless @region

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
                throw new Error "The id:#{id} is used more than once." if used[id]
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
            components = @getOptionResult(@options.components) or []
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

        unexportRegions: -> @chain(
            (value.close() for key, value of @exportedRegions)
            (@module.removeRegion key for key, value of @exportedRegions)
        )

        afterRender: ->


    class ModuleContainer extends D.Base
        @include D.Event

        constructor: ->
            @modules = {}
            super

        checkId: (id) ->
            throw new Error "id: #{id} is invalid" unless id and D.isString id
            throw new Error "id: #{id} is already used" if @modules[id]

        get: (id) ->
            @modules[id]

        changeId: (from, to) ->
            return if from is to
            @checkId to

            module = @modules[from]
            throw new Error "module id: #{from} not exists" if not module
            delete @modules[from]
            module.id = to
            @modules[to] = module

        add: (module) ->
            @checkId module.id
            @modules[module.id] = module

        remove: (id) ->
            delete @modules[id]

    class Layout extends D.View
        initialize: ->
            @isLayout = true
            @loadDeferred = @chain [@loadTemplate(), @loadHandlers()]
            delete @bindData

        setRegion: ->
            super
            @regionInfo = @module.regionInfo

    D.Module = class Module extends D.Base
        @Container = ModuleContainer
        @Layout = Layout
        constructor: (@name, @app, @loader, @options = {}) ->
            [..., @baseName] = @name.split '/'
            @container = @options.container or @app.modules
            @separatedTemplate = @options.separatedTemplate is true
            @regions = {}
            super 'm'
            @container.add @
            @container.delegateEvent @

        initialize: ->
            @extend @options.extend if @options.extend
            @loadDeferred = @createDeferred()
            @chain [@loadTemplate(), @loadLayout(), @loadData(), @loadItems()], -> @loadDeferred.resolve()

        loadTemplate: ->
            return if @separatedTemplate
            @chain @loader.loadTemplate(@), (template) -> @template = template

        loadLayout: ->
            layout = @getOptionResult @options.layout
            name = if D.isString layout then layout else layout?.name
            name or= 'layout'
            @chain @app.getLoader(name).loadLayout(@, name, layout), (obj) =>
                @layout = obj

        loadData: ->
            @data = {}
            promises = []
            items = @getOptionResult(@options.data) or {}
            @autoLoadDuringRender = []
            @autoLoadAfterRender = []

            doLoad = (id, value) =>
                name = D.Loader.analyse(id).name
                value = @getOptionResult value
                if value
                    if value.autoLoad is 'after' or value.autoLoad is 'afterRender'
                        @autoLoadAfterRender.push name
                    else if value.autoLoad
                        @autoLoadDuringRender.push name
                promises.push @chain @app.getLoader(id).loadModel(value, @), (d) -> @data[name] = d

            doLoad id, value for id, value of items

            @chain promises

        loadItems: ->
            @items = {}
            @inRegionItems = []

            promises = []
            items = @getOptionResult(@options.items) or []
            doLoad = (name, item) =>
                item = @getOptionResult item
                item = region: item if item and D.isString item
                isModule = item.isModule

                p = @chain @app.getLoader(name)[if isModule then 'loadModule' else 'loadView'](name, @, item), (obj) =>
                    @items[obj.name] = obj
                    obj.regionInfo = item
                    @inRegionItems.push obj if item.region
                promises.push p

            doLoad name, item for name, item of items

            @chain promises

        addRegion: (name, el) ->
            type = el.data 'region-type'
            @regions[name] = Region.create type, @app, @, el

        removeRegion: (name) ->
            delete @regions[name]

        render: (options = {}) ->
            throw new Error 'No region to render in' unless @region
            @renderOptions = options
            @container.changeId @id, options.id if options.id

            @chain(
                @loadDeferred
                -> @options.beforeRender?.apply @
                -> @layout.setRegion @region
                @fetchDataDuringRender
                -> @layout.render()
                -> @options.afterLayoutRender?.apply @
                ->
                    defers = for value in @inRegionItems
                        key = value.regionInfo.region
                        region = @regions[key]
                        throw new Error "Can not find region: #{key}" unless region
                        region.show value
                    $.when defers...
                -> @options.afterRender?.apply @
                @fetchDataAfterRender
                @
            )

        setRegion: (@region) ->

        close: -> @chain(
            -> @options.beforeClose?.apply @
            -> @layout.close()
            -> value.close() for key, value of @regions
            -> @options.afterClose?.apply @
            -> @container.remove @id
            @
        )

        fetchDataDuringRender: ->
            @chain (@data[id].get?() for id in @autoLoadDuringRender)

        fetchDataAfterRender: ->
            @chain (@data[id].get?() for id in @autoLoadAfterRender)


    D.Loader = class Loader extends D.Base
        @TemplateCache = {}

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
            super

        loadResource: (path, plugin) ->
            path = D.joinPath @app.options.scriptRoot, path
            path = plugin + '!' + path if plugin
            deferred = @createDeferred()

            error = (e) ->
                if e.requireModules?[0] is path
                    define path, null
                    require.undef path
                    require [path], ->
                    deferred.resolve null
                else
                    deferred.reject null
                    throw e

            require [path], (obj) =>
                obj = obj(@app) if D.isFunction obj
                deferred.resolve obj
            , error

            deferred.promise()

        loadModuleResource: (module, path, plugin) ->
            @loadResource D.joinPath(module.name, path), plugin

        loadModule: (path, parentModule) ->
            {name} = Loader.analyse path
            @chain @loadResource(D.joinPath name, @fileNames.module), (options) =>
                new D.Module name, @app, @, options

        loadView: (name, module, options) ->
            {name} = Loader.analyse name
            @chain @loadModuleResource(module, @fileNames.view + name), (options) =>
                new D.View name, module, @, options

        loadLayout: (module, name, layout = {}) ->
            {name} = Loader.analyse name
            @chain(
                if layout.templateOnly is false then @loadModuleResource(module, name) else {}
                (options) => new D.Module.Layout name, module, @, D.extend(layout, options)
            )

        innerLoadTemplate: (module, p) ->
            path = p + @fileNames.templateSuffix
            template = Loader.TemplateCache[module.name + path]
            template = Loader.TemplateCache[module.name + path] = @loadModuleResource module, path, 'text' unless template

            @chain template, (t) ->
                if D.isString t
                    t = Loader.TemplateCache[path] = Handlebars.compile t
                t

        #load template for module
        loadTemplate: (module) ->
            path = @fileNames.templates
            @innerLoadTemplate module, path

        #load template for view
        loadSeparatedTemplate: (view, name) ->
            path = @fileNames.template + name
            @innerLoadTemplate view.module, path

        loadModel: (name = '', module) ->
            return name if name instanceof D.Model
            name = url: name if D.isString name
            new D.Model(@app, module, name)

        loadHandlers: (view, name) ->
            view.options.handlers or {}

        loadRouter: (path) ->
            {name} = Loader.analyse path
            path = D.joinPath name, @fileNames.router
            path = path.slice(1) if path.charAt(0) is '/'
            @loadResource(path)

    D.SimpleLoader = class SimpleLoader extends D.Loader
        constructor: ->
            super
            @name = 'simple'

        loadModule: (path, parentModule) ->
            {name} = Loader.analyse path
            @deferred new D.Module(name, @app, @, separatedTemplate: true)

        loadView: (name, module, item) ->
            {name} = Loader.analyse name
            @deferred new D.View(name, module, @, {})


    class Route
        regExps: [
            /:([\w\d]+)/g
            '([^\/]+)'
            /\*([\w\d]+)/g
            '(.*)'
        ]
        constructor: (@app, @router, @path, @fn) ->
            pattern = path.replace(@regExps[0], @regExps[1]).replace(@regExps[2], @regExps[3])
            @pattern = new RegExp "^#{pattern}$", if @app.options.caseSensitiveHash then 'g' else 'gi'

        match: (hash) ->
            @pattern.lastIndex = 0
            @pattern.test hash

        handle: (hash) ->
            @pattern.lastIndex = 0
            args = @pattern.exec(hash).slice 1
            routes = @router.getDependencies(@path)
            routes.push @
            fns = for route, i in routes
                do (route, i) ->
                    (prev) -> route.fn (if i > 0 then [prev].concat args else args)...
            @router.chain fns...

    D.Router = class Router extends D.Base
        constructor: (@app) ->
            @routes = []
            @routeMap = {}
            @dependencies = {}
            @started = false
            super 'ro'

        initialize: ->
            @addRoute '/', @app.options.defaultRouter

        getHash: -> root.location.hash.slice 1

        start: (defaultPath) ->
            return if @started
            @started = true

            $(root).on 'popstate.dr', => @dispatch @getHash()

            if hash = @getHash()
                @navigate hash, true
            else if defaultPath
                @navigate defaultPath, true

        stop: ->
            $(root).off '.dr'
            @started = false

        dispatch: (hash) ->
            return if @previousHash is hash
            @previousHash = hash

            return route.handle hash for route in @routes when route.match hash

        navigate: (path, trigger) ->
            root.history.pushState {}, root.document.title, "##{path}"
            @dispatch path if trigger

        mountRoutes: (paths...) -> @chain(
            @app.getLoader(path).loadRouter(path) for path in paths
            (routers) ->
                @addRoute paths[i], router for router, i in routers
        )

        addRoute: (path, router) ->
            routes = @getOptionResult router.routes
            dependencies = @getOptionResult router.deps
            for key, value of dependencies
                p = D.joinPath(path, key).replace /^\//, ''
                v = if value.charAt(0) is '/' then value.slice 1 else D.joinPath path, value
                @dependencies[p] = v.replace /^\//, ''

            for key, value of routes
                p = D.joinPath(path, key).replace /(^\/|\/$)/g, ''
                route = new Route @app, @, p, router[value]
                @routes.unshift route
                @routeMap[p] = route

        getDependencies: (path) ->
            deps = []
            d = @dependencies[path]
            while d?
                deps.unshift @routeMap[d]
                d = @dependencies[d]
            deps


    D.Helpers =
        layout: (app, Handlebars, options) ->
            if @View.isLayout then options.fn @ else ''

        view: (app, Handlebars, name, options) ->
            return '' if @View.isLayout or @View.name isnt name
            options.fn @


    D.MultiRegion = class MultiRegion extends D.Region
        constructor: ->
            super
            @items = {}
            @elements = {}

        activate: (item) ->

        createElement: (key, item) ->
            el = $ '<div></div>'
            @el.append el
            el

        getEl: (item) ->
            return @el if not item

            key = item.regionInfo?.key
            return null if not key
            @elements[key] or (@elements[key] = @createElement(key, item))

        close: (item) ->
            if item
                key = item.regionInfo?.key
                return @createResolvedDeferred @ unless key and @items[key]
                throw new Error('Trying to close an item which is not in the region') if @items[key].id isnt item.id

                return @chain(
                    -> item.close()
                    -> delete @items[key]
                    @
                )

            @chain(
                -> v.close() for k, v of @items
                ->
                    @items = {}
                    @elements = {}
                @
            )

        getCurrentItem: (item, options = {}) ->
            key = if D.isString(item) then options.regionKey else item.regionInfo?.key
            if key then (if i = @items[key] then i else regionInfo: key: key) else null

        setCurrentItem: (item, options) ->
            info = item.regionInfo or (item.regionInfo = {})
            key = info.key or (info.key = options.regionKey or D.uniqueId 'K')
            @items[key] = item

        setHtml: (html, item) -> @getEl(item).html html

        empty: (item) -> if item then @getEl(item).remove() else @el.empty()


    Drizzle
