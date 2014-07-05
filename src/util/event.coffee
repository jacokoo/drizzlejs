D.Event =
    on: (name, callback, context) ->
        @registeredEvents or= {}
        (@registeredEvents[name] or= []).push fn: callback, context: context
        @

    off: (name, callback, context) ->
        return @ unless @registeredEvents and events = @registeredEvents[name]
        @registeredEvents[name] = (item for item in events when item.fn isnt callback or (context and context isnt item.context))
        delete @registeredEvents[name] if @registeredEvents[name].length is 0
        @

    trigger: (name, args...) ->
        return @ unless @registeredEvents and events = @registeredEvents[name]
        item.fn.apply item.context, args for item in events
        @

    delegateEvent: (target) -> D.extend target,
        on: (name, callback, context) =>
            target.listenTo @, "#{name}.#{target.id}", callback, context
            target

        off: (args...) =>
            if args.length > 0
                args.unshift "#{args.shift()}.#{target.id}"
            args.unshift @
            target.stopListening args...
            target

        trigger: (name, args...) =>
            args.unshift "#{name}.#{target.id}"
            @trigger args...
            target

        listenTo: (obj, name, callback, context) ->
            ctx = context or @
            @registeredListeners or= {}
            (@registeredListeners[name] or= []).push fn: callback, obj: obj, context: ctx
            obj.on name, callback, ctx
            @

        stopListening: (obj, name, callback) ->
            return @ unless @registeredListeners
            unless obj
                item.obj.off key, item.fn, @ for item in value for key, value of @registeredListeners
                @registeredListeners = {}
                return @

            for key, value of @registeredListeners
                continue if name and name isnt key
                @registeredListeners[key] = []
                for item in value
                    if item.obj isnt obj or (callback and callback isnt item.fn)
                        @registeredListeners[key].push item
                    else
                        item.obj.off key, item.fn, item.context
                delete @registeredListeners[key] if @registeredListeners[key].length is 0
            @
