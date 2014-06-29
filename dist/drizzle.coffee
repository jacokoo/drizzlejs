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

    Drizzle = version: '0.2.0'

    previousDrizzle = root.Drizzle
    idCounter = 0

    for item in ['Function', 'Object', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null']
        do (item) -> Drizzle["is#{item}"] = (obj) -> Object.prototype.toString.call(obj) is "[object #{item}]"

    Drizzle.extend = (target, mixins...) ->
        return target unless Drizzle.isObject target
        target[key] = value for key, value of mixin for mixin in mixins
        target

    Drizzle.extend Drizzle,
        getOptionValue = (thisObj, options, key) ->
            return null unless options
            value = if key then options[key] else options
            if Drizzle.isFunction value then value.apply thisObj else value
        uniqueId = (prefix) -> (if prefix then prefix else '') + ++i
        include = (clazz, mixins...) ->
            clazz::[key] = value for key, value of mixin for mixin in mixins
            clazz
        noConflict = ->
            root.Drizzle = previousDrizzle
            Drizzle

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
    
    Drizzle.Deferred =
    
        createDeferred: -> $.Deferred()
    
        deferred: (fn, args...) ->
            fn = fn.apply @, args if Drizzle.isFunction fn
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
                    data = data[0] if not Drizzle.isArray(item) and data.length < 2
                    gots.push data
    
                (if Drizzle.isArray item
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
    

    Drizzle
