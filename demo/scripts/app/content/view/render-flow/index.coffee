define

    layout:
        events: 'click render': 'startRender'
        handlers: startRender: (deferred) ->
            @module.data.logs.data = []
            demo = @module.regions.demo
            @chain demo.close(), demo.show(@module.items.demo), -> deferred.resolve()

        clickDeferred: (deferred, el) ->
            console.log 'click deferred', deferred, el
            deferred.done -> console.log 'click deferred resolved'

    data: logs: data: []

    items: demo: '', log: 'log'
