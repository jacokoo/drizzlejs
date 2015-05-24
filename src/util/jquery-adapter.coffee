((root, factory) ->
    if typeof define is 'function' and define.amd
        define ['jquery', 'drizzlejs'], ($, D) ->
            factory root, $, D
    else if module and module.exports
        $ = require 'jquery'
        D = require 'drizzlejs'
        factory root, $, D
    else
        factory root, $, Drizzle
) window, (root, $, D) ->

    class Promise
        @resolve: (data) ->
            return data.promise() if data and data.promise
            return new Promise((resolve) ->
                resolve(data)
            )
        @reject: (data) ->
            return data.promise() if data and data.promise
            return new Promise((resolve, reject) ->
                reject(data)
            )
        @all: (args) ->
            new Promise (re, rj) ->
                $.when(args...).then (args...) ->
                    re args
                , (args...) ->
                    rj args

        constructor: (fn) ->
            @deferred = $.Deferred()
            setTimeout =>
                fn($.proxy(@deferred.resolve, @deferred), $.proxy(@deferred.reject, @deferred))
            , 1

        then: (args...) ->
            @deferred.then args...

        promise: -> @deferred.promise()

        catch: (fn) ->
            @deferred.fail(fn)

    D.extend D.Adapter,
        ajax: $.ajax
        hasClass: (el, clazz) -> $(el).hasClass clazz
        addClass: (el, clazz) -> $(el).addClass clazz
        removeClass: (el, clazz) -> $(el).removeClass clazz
        componentHandler: (name) ->
            creator: (view, el, options) ->
                throw new Error('Component [' + name + '] is not defined') unless el[name]
                el[name] options
            destructor: (view, component, info) ->
                component[name] 'destroy'

        delegateDomEvent: (el, name, selector, fn) ->
            $(el).on name, selector, fn

        undelegateDomEvents: (el, namespace) ->
            $(el).off namespace

        getFormData: (form) ->
            data = {}
            for item in $(form).serializeArray()
                o = data[item.name]
                if o is undefined
                    data[item.name] = item.value
                else
                    o = data[item.name] = [data[item.name]] unless D.isArray(o)
                    o.push item.value
            data

        Promise: root.Promise or Promise
