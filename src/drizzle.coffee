((root, factory) ->
    if typeof define is 'function' and define.amd
        define ['handlebars.runtime', 'diff-dom'], (Handlebars, diffDOM) ->
            factory root, Handlebars['default'], diffDOM
    else if module and module.exports
        Handlebars = require 'handlebars.runtime'
        diffDOM = require 'diff-dom'
        module.exports = factory root, Handlebars, diffDOM
    else
        root.Drizzle = factory root, Handlebars, diffDOM
) this, (root, Handlebars, diffDOM) ->

    D = Drizzle = version: '<%= version %>'

    idCounter = 0
    toString = Object.prototype.toString
    types = [
        'Function', 'Object', 'String', 'Array', 'Number'
        'Boolean', 'Date', 'RegExp', 'Undefined', 'Null'
    ]
    compose = (args...) ->
        args.join('/').replace(/\/{2,}/g, '/').replace(/^\/|\/$/g, '')

    for item in types
        do (item) -> D["is#{item}"] = (obj) -> toString.call(obj) is "[object #{item}]"

    D.extend = (target, mixins...) ->
        return target unless target
        target[key] = value for key, value of mixin for mixin in mixins
        target

    D.include = (target, mixins...) ->
        return target unless D.isFunction target
        target::[key] = value for key, value of mixin for mixin in mixins
        target

    D.uniqueId = (prefix) -> (if prefix then prefix else '') + ++idCounter

    # @include util/adapter.coffee

    # @include util/promise.coffee

    # @include util/event.coffee

    # @include util/request.coffee

    # @include util/factory.coffee

    # @include core/base.coffee

    # @include core/application.coffee

    # @include core/model.coffee

    # @include core/region.coffee

    # @include core/view.coffee

    # @include core/module.coffee

    # @include core/loader.coffee

    # @include core/router.coffee

    # @include util/helpers.coffee

<%= extModules %>

    Drizzle
