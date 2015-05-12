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
