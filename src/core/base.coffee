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
