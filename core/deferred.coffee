define ['jquery', 'underscore', './config'], ($, _, config) ->

    if config.development is true
        create = (name, obj) ->
            obj = $.Deferred() unless obj
            return obj unless name
            return obj unless obj.promise

            @logger.debug '[Deferred]', name, '[create]'
            me = @
            for key in ['resolve', 'reject', 'notify']
                do (key) ->
                    old = obj[key + 'With']
                    obj[key + 'With'] = (args...) ->
                        me.logger.debug '[Deferred]', name, "[#{key}]"
                        old.apply obj, args
            obj
    else
        create = ->
            obj = $.Deferred() unless obj
            obj

    createDeferred: (name, obj) ->
        create.call @, name, obj

    deferred: (name, fn, args...) ->
        if name and not _.isString name
            args.unshift fn if fn?
            fn = name
            name = null

        return @createDeferred(name, fn).promise() if fn?.promise

        obj = @createDeferred name
        if _.isFunction fn
            returned = fn.apply @, args.concat [obj]
            return obj.promise() if returned is obj
            return returned.promise() if returned?.promise
            obj.resolve returned
        else
            obj.resolve fn
        obj.promise()

    chain: (name, args...) ->
        unless _.isString name
            args.unshift name
            name = null

        return @deferred name, args[0] if args.length is 0 or (args.length is 1 and not _.isArray args[0])

        @deferred name, (deferred) =>
            gots = []
            previous = null
            i = 0

            process = (item) =>
                (if _.isArray item
                    if item.length is 0
                        @deferred(null, [])
                    else if item.length is 1
                        @deferred(null, item[0], previous, [].concat gots).then (data, args...) ->
                            if args.length > 0
                                args.unshift data
                                data = args
                            [data]
                    else
                        ps = for p, j in _.flatten item
                            @deferred null, p, previous, [].concat gots
                        ps or= []
                        $.when.apply($, ps).then (args...) -> args
                else
                    @deferred null, item, previous, [].concat gots
                ).done(done).fail(fail).progress(progress)

            done = (data, others...) ->
                if others.length > 0
                    others.unshift data
                    data = others

                gots.push data
                previous = data

                if args.length is 0 then deferred.resolve previous else process args.shift()

            fail = (data...) ->
                data = data[0] if data.length is 1
                gots.push data
                previous = data
                deferred.reject previous, gots

            progress = (data...) ->
                deferred.nodify data

            process args.shift()
            deferred
