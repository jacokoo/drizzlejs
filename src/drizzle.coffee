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

    # @include core/config.coffee
    # @include core/deferred.coffee

    Drizzle
