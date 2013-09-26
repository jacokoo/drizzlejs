define ['underscore', './config'], (_, config) ->

    if config.development is true
        fn = (type, messages...) ->
            console = window?.console
            return unless console
            messages = messages.unshift "[#{type.toUpperCase()}][#{@name}]"
            console[ if console[type] then type else 'log'] message...
    else
        fn = ->


    class Logger
        constructor: (@name = 'logger', @owner) ->

    Logger::[method] = _.bind fn, method for method in ['debug', 'info', 'warn', 'log']

    Logger: Logger

    joinPath: (args...) ->
        path = args.join '/'
        path.replace /\/{2,}/g, '/'

    getValue: (obj, key, context) ->
        return null unless obj and key
        value = obj[key]
        context or= obj
        if _.isFunction value then value.apply context else value

    callIt: (value, context) ->
        if _.isFunction value then value.apply context else value

    include: (clazz, mixins...) ->
        for mixin in mixins
            clazz::[key] = value for key, value of mixin
        clazz

    extend: (obj, mixins) ->
        return if not mixins

        for key, value of mixins
            old = obj[key]
            args = [value, obj]
            args.push old if old
            obj[key] = _.bind args...
