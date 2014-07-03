D.Deferred =

    createDeferred: -> $.Deferred()

    createRejectedDeferred: (args...) ->
        d = @createDeferred()
        d.reject args...
        d

    createResolvedDeferred: (args...) ->
        d = @createDeferred()
        d.resolve args...
        d


    deferred: (fn, args...) ->
        fn = fn.apply @, args if D.isFunction fn
        return fn.promise() if fn?.promise
        obj = @createDeferred()
        obj.resolve fn
        obj.promise()

    chain: (rings...) ->
        obj = @createDeferred()
        if rings.length is 0
            obj.resolve()
            return obj.promise()

        gots = []
        doItem = (item, i) =>
            gotResult = (data) ->
                data = data[0] if not D.isArray(item) and data.length < 2
                gots.push data

            (if D.isArray item
                promises = for inArray in item
                    args = [inArray]
                    args.push gots[i - 1] if i > 0
                    @deferred(args...)
                $.when(promises...)
            else
                args = [item]
                args.push gots[i - 1] if i > 0
                @deferred(args...)
            ).done (data...) ->
                gotResult data
                if rings.length is 0 then obj.resolve gots[gots.length - 1] else doItem(rings.shift(), ++i)
            .fail (data...) ->
                gotResult data
                obj.reject gots...

        doItem rings.shift(), 0
        obj.promise()
