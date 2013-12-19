define ['underscore', './config', './deferred'], (_, config, Deferred) ->

    if config.development is true
        fn = (type) ->
            (messages...) ->
                console = window?.console
                return unless console
                messages.unshift "[#{type.toUpperCase()}][#{@name}]"
                console[ if console[type] then type else 'log'] messages...
    else
        fn = -> ->

    # take place of window.console
    # it will print logs only if development is setted to true
    class Logger
        constructor: (@name = 'logger', @owner) ->

    Logger::[method] = fn method for method in ['debug', 'info', 'warn', 'log', 'error']

    # base class for every components, include:
    # make it to call initialize in constructor
    # create a Logger instance
    # some utility methods
    class Base
        @Logger: Logger
        @include: (mixins...) ->
            @::[key] = value for key, value of mixin for mixin in mixins
            @
        @joinPath: (paths...) -> paths.join('/').replace /\/{2,}/g, '/'

        @include Deferred
        constructor: ->
            @logger = new Base.Logger @name, @
            @initialize()

        initialize: ->

        getOptionResult: (options, key) ->
            return null unless options
            value = if key then options[key] else options
            if _.isFunction value then value.apply @ else value

        # extend THIS object by mixins
        # the mixins should be a key-value pair object
        # for the key-value pairs, the value must be a function
        # if the key is already exists in THIS object, the old value will be inserted to the front of value function's arguments list
        extend: (mixins) ->
            return unless mixins

            for key, value of mixins
                do (key, value) =>
                    if _.isFunction value
                        old = @[key]
                        @[key] = (args...) ->
                            args.unshift old if old
                            value.apply @, args
                    else if not @[key]
                        @[key] = value
