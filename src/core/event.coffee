Drizzle.Event =
    on: (name, callback, context) ->
        @registeredEvents or= {}
        (@registeredEvents[name] or= []).push fn: callback, context: context
        @

    off: (name, callback, context) ->
        return @ unless @registeredEvents and events = @registeredEvents[name]
        @registeredEvents[name] = (item for item in events when item.fn isnt callback or (context and context isnt item.context))
        @

    trigger: (name, args...) ->
        return @ unless @registeredEvents and events = @registeredEvents[name]
        item.fn.apply item.context, args for item in events
        @

    listenTo: (obj, name, callback) ->
        @registeredListeners or= {}
        (@registeredListeners[name] or= []).push fn: callback, obj: obj
        obj.on name, callback, @
        @

    stopListening: (obj, name, callback) ->
        return @ unless @registeredListeners
        unless obj
            value.obj.off key, value.fn, @ for key, value of @registeredListeners
            return @

        for key, value of @registeredListeners
            continue if name and name isnt key
            @registeredListeners[key] = []
            for item in value
                if item.obj isnt obj or (callback and callback isnt item.fn)
                    @registeredListeners[key].push item
                else
                    item.obj.off key, item.fn, @
        @
