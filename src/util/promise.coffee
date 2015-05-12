D.Promise = class Promise
    constructor: (@context) ->

    create: (fn) -> new A.Promise (resolve, reject) =>
        fn.call @context, resolve, reject

    resolve: (obj) -> A.Promise.resolve obj

    reject: (obj) -> A.Promise.reject obj

    when: (obj, args...) ->
        obj = obj.apply @context, args if D.isFunction obj
        A.Promise.resolve obj

    chain: (rings...) ->
        return @resolve() if rings.length is 0

        @create (resolve, reject) =>
            prev = null

            doRing = (ring, i) =>
                isArray = D.isArray ring
                (if isArray
                    promises = for item in ring
                        @when (if i > 0 then [item, prev] else [item])...
                    A.Promise.all promises
                else
                    @when (if i > 0 then [ring, prev] else [ring])...
                ).then (data) ->
                    prev = data
                    if rings.length is 0 then resolve(prev) else doRing(rings.shift(), ++i)
                , (data) ->
                    reject data

            doRing rings.shift(), 0
