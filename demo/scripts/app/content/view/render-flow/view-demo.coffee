define ['drizzle'], (D) ->

    addLog = (message) ->
        message.time = new Date().getTime()
        @data.logs.data.push message
        @data.logs.trigger 'changed'

    fn = (index, message, result) ->
        deferred = @createDeferred()
        addLog.call @, index: index, message: "start #{message}"
        setTimeout =>
            addLog.call @, index: index, message: "end #{message}"
            deferred.resolve result
        , 1000
        deferred.promise()

    bind: logs: ''

    beforeRender: -> fn.call @, 2, 'options.beforeRender'

    adjustData: (data) -> fn.call @, 5, 'options.adjustData', data

    afterRender: -> fn.call @, 11, 'options.afterRender'

    extend:
        bindData: (su) ->
            result = su.apply @
            fn.call @, 1, 'bindData', result

        beforeRender: (su) ->
            result = su.apply @
            fn.call @, 3, 'beforeRender', result

        serializeData: (su) ->
            result = su.apply @
            fn.call @, 4, 'serializeData', result

        executeTemplate: (su, data) ->
            result = su.call @, data
            fn.call @, 6, 'executeTemplate', result

        executeIdReplacement: (su) ->
            result = su.apply @
            fn.call @, 7, 'executeIdReplacement', result

        renderComponent: (su) ->
            result = su.apply @
            fn.call @, 8, 'renderComponent', result

        exportRegions: (su) ->
            result = su.apply @
            fn.call @, 9, 'exportRegions', result

        afterRender: (su) ->
            result = su.apply @
            fn.call @, 10, 'afterRender', result
