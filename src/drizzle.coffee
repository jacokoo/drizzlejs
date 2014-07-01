((root, factory) ->

    if typeof define is 'function' and define.amd
        define ['jquery'], ($) -> factory root, $
    else if module and module.exports
        $ = require 'jquery'
        module.exports = factory root, $
    else
        root.Drizzle = factory root, $
) this, (root, $) ->

    D = Drizzle = version: '<%= version %>'

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

    # @include core/base.coffee

    # @include core/model.coffee

    # @include core/config.coffee

    # @include util/deferred.coffee

    # @include util/event.coffee

    # @include util/request.coffee

    Drizzle
