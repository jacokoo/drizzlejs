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

    D = Drizzle = version: '<%= version %>'

    old = root.Drizzle
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
            root.Drizzle = old
            D
        joinPath: (paths...) -> paths.join('/').replace(/\/{2, }/g, '/')

    # @include util/deferred.coffee

    # @include util/event.coffee

    # @include util/request.coffee

    # @include core/base.coffee

    # @include core/application.coffee

    # @include core/model.coffee

    # @include core/region.coffee

    # @include core/view.coffee

    # @include core/module.coffee

    # @include core/loader.coffee

    # @include core/router.coffee

    # @include core/config.coffee

    # @include util/helpers.coffee

    Drizzle
