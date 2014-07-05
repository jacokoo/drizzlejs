define

    layout:
        events: 'click render': 'startRender'
        handlers: startRender: (deferred) ->
            @module.data.logs.data = []
            demo = @module.regions.demo
            @chain demo.close(), demo.show(@module.items.demo), -> deferred.resolve()

    data: logs: data: []

    items: demo: '', log: 'log'
