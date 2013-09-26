define ['jquery', 'underscore'], ($, _) ->

    create = (name, obj) ->
        return obj unless name
        obj = $.Deferred() unless obj
        return obj unless obj.promise

        obj.name = name
        p = obj.promise
        obj.promise = ->
            o = p.apply obj
            o.name = name
            o
        obj

    deferred: (name, obj) ->
        create name, obj

    promise: (name, fn, args...) ->
        unless _.isString name
            args.unshift fn if fn?
            fn = name
            name = null

        return @deferred(name, fn).promise() if fn?.promise

        obj = @deferred name
        if _.isFunction fn
            returned = fn.apply @, [obj].concat args
            return obj.promise() if returned is obj
            return returned.promise() if returned?.promise
            obj.resolve returned
        else
            obj.resolve fn
        obj.promise()

    chain: (name, args...) ->
        unless _.isString name
            args.unshift name if name?
            name = null

        return @promise name, args[0] if args.length is 0 or (args.length is 1 and not _.isArray args[0])

        @promise name, (deferred) =>
            gots = []
            previous = null
            i = 0

            process = (item) =>
                n = if name then name + i++ else name
                (if _.isArray item
                    ps = for p, j in _.flatten item
                        nn = if n then n + j else n
                        @promise nn, p, previous, [].concat gots
                    @promise n, (d) ->
                        $.when.apply($, ps).then _.bind(d.resolve, d), _.bind(d.reject, d), _.bind(d.notify, d)
                else
                    @promise n, p, previous, [].concat gots
                ).then done, fail, progress

            done = (data...) ->
                data = data[0] if data.length is 1
                gots.push data
                previous = data
                if args.length is 0 then deferred.resolve previous, gots else process args.shift()

            fail = (data...) ->
                data = data[0] if data.length is 1
                gots.push data
                previous = data
                deferred.reject previous, gots

            progress = (data...) ->
                deferred.nodify data

            process args.shift()
