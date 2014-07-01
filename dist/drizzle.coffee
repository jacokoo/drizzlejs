# DrizzleJS v0.2.0
# -------------------------------------
# Copyright (c) 2014 Jaco Koo <jaco.koo@guyong.in>
# Distributed under MIT license

((root, factory) ->

    if typeof define is 'function' and define.amd
        define ['jquery'], ($) -> factory root, $
    else if module and module.exports
        $ = require 'jquery'
        module.exports = factory root, $
    else
        root.Drizzle = factory root, $
) this, (root, $) ->

    D = Drizzle = version: '0.2.0'

    previousDrizzle = root.Drizzle
    idCounter = 0

    for item in ['Function', 'Object', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null']
        do (item) -> D["is#{item}"] = (obj) -> Object.prototype.toString.call(obj) is "[object #{item}]"

    D.extend = (target, mixins...) ->
        return target unless D.isObject target
        target[key] = value for key, value of mixin for mixin in mixins
        target

    D.extend D,
        uniqueId = (prefix) -> (if prefix then prefix else '') + ++i
        noConflict = ->
            root.Drizzle = previousDrizzle
            D

    Drizzle.Base = class Base

        @include: (mixins...) ->
            @::[key] = value for key, value of mixin for mixin in mixins
            @

        @include Drizzle.Deferred

        constructor: (idPrefix) ->
            @id = Drizzle.uniqueId(idPrefix)
            @initialize()

        initialize: ->

        getOptionResult: (value) -> if _.isFunction value then value.apply @ else value

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


    D.Model = class Data extends D.Base

        constructor: (@app, @module, @options = {}) ->
            @data = @options.data or {}
            @params = {}

            if options.pageable
                defaults = D.Config.pagination
                p = @pagination =
                    page: options.page or 1
                    pageCount: 0
                    pageSize: options.pageSize or defaults.pageSize
                    pageKey: options.pageKey or defaults.pageKey
                    pageSizeKey: options.pageSizeKey or defaults.pageSizeKey
                    recordCountKey: options.recordCountKey or defaults.recordCountKey

            super 'd'

        setData: (data) ->
            @data = if D.isFunction @options.parse then @options.parse data else data
            if p = @pagination
                p.recordCount = @data[p.recordCountKey]
                p.pageCount = Math.ceil(p.recordCount / p.pageSize)
            @data = @data[@options.root] if @options.root

        url: -> @getOptionResult(@options.url) or @getOptionResult(@url) or ''

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
            return @createRejectedDeferred() unless p = @pagination and page <= p.pageCount and page >= 1
            p.page = page
            @get options

        firstPage: (options) -> @turnToPage 1, options
        lastPage: (options) -> @turnToPage @pagination.pageCount, options
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
        do (item) ->
        D.Model::[item] = (options) -> D.Require[item] @, options


    Drizzle.Config =
        scriptRoot: 'app'
        urlRoot: ''
        urlSuffix: ''
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

        pagination:
            defaultPageSize: 10
            pageKey: '_page'
            pageSizeKey: '_pageSize'
            recordCountKey: 'recordCount'


    D.Deferred =

        createDeferred: -> $.Deferred()

        createRejectedDeferred: (args...) ->
            d = @createDeferred()
            d.reject args...
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
                    if rings.length is 0 then obj.resolve gots... else doItem(rings.shift(), ++i)
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
            @

        trigger: (name, args...) ->
            return @ unless @registeredEvents and events = @registeredEvents[name]
            item.fn.apply item.context, args for item in events
            @

        listenTo: (obj, name, callback) ->
            @registeredListeners or= {}
            (@registeredListeners[name] or= []).push fn: callback, obj: obj
            obj.on name, callback, @
            @

        stopListening: (obj, name, callback) ->
            return @ unless @registeredListeners
            unless obj
                value.obj.off key, value.fn, @ for key, value of @registeredListeners
                return @

            for key, value of @registeredListeners
                continue if name and name isnt key
                @registeredListeners[key] = []
                for item in value
                    if item.obj isnt obj or (callback and callback isnt item.fn)
                        @registeredListeners[key].push item
                    else
                        item.obj.off key, item.fn, @
            @


    D.Request =

        url: (model) ->
            urls = [D.Config.urlRoot]
            url.push model.module.options.urlPrefix if model.module.options.urlPrefix
            url.push model.module.name
            base = model.url or ''
            base = base.apply model if D.isFunction base

            while base.indexOf('../') is 0
                paths.pop()
                base = base.slice 3

            urls.push base
            urls.push model.data.id if model.data.id
            urls.join('/').replace /\/{2, }/g, '/'

        get: (model, options) -> @ajax type: 'GET', model, model.getParams(), options
        post: (model, options) -> @ajax type: 'POST', model, model.data, options
        put: (model, options) -> @ajax type: 'PUT', model, model.data, options
        del: (model, options) -> @ajax type: 'DELETE', model, model.data, options

        ajax: (params, model, data, options) ->
            url = @url model
            params = D.extend params,
                contentType: 'application/json'
            , options
            data = D.extend data, options.data
            params.url = url
            params.data = data
            D.Deferred.chain $.ajax(params), (resp) -> model.setData resp


    Drizzle
