((root, factory) ->

    if typeof define is 'function' and define.amd
        define ['jquery'], ($) -> factory root, $
    else if module and module.exports
        $ = require 'jquery'
        module.exports = factory root, $
    else
        root.Drizzle = factory root, $
) this, (root, $) ->
    Drizzle = version: '<%= version %>'

    previousDrizzle = root.Drizzle

    Drizzle.noConflict = ->
        root.Drizzle = previousDrizzle
        Drizzle

    types = ['Function', 'Object', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null']

    for item in types
        do (item) -> Drizzle["is#{item}"] = (obj) -> Object.prototype.toString.call(obj) is "[object #{item}]"

    Drizzle.getOptionValue = (thisObj, options, key) ->
        return null unless options
        value = if key then options[key] else options
        if Drizzle.isFunction value then value.apply thisObj else value

    Drizzle.include = (clazz, mixins...) ->
        clazz::[key] = value for key, value of mixin for mixin in mixins
        clazz

    Drizzle.extend = (obj, mixins) ->
        return unless obj and mixins

        doExtend = (key, value) ->
            if Drizzle.isFunction value
                old = obj[key]
                obj[key] = (args...) ->
                    args.unshift old if old
                    value.apply @, args
            else
                obj[key] = value unless obj[key]

        doExtend key, value for key, value of mixins

    # @include core/deferred.coffee

    Drizzle
