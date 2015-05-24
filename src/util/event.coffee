D.Event =
    on: (name, callback, context) ->
        @events or= {}
        (@events[name] or= []).push fn: callback, ctx: context
        @

    off: (name, callback, context) ->
        return @ unless @events
        return (@events = {}) and @ unless name
        return @ unless @events[name]
        return (delete @events[name]) and @ unless callback

        @events[name] = (item for item in @events[name] when item.fn isnt callback or (context and context isnt item.ctx))
        delete @events[name] if @events[name].length is 0
        @

    trigger: (name, args...) ->
        return @ unless @events and @events[name]
        item.fn.apply item.ctx, args for item in @events[name]
        @

    delegateEvent: (target) ->
        id = "--#{target.id}"
        D.extend target,
            on: (name, callback) => target.listenTo @, name + id, callback

            off: (name, callback) => target.stopListening @, (name and name + id), callback

            trigger: (name, args...) =>
                args.unshift name + id
                @trigger args...
                target

            listenTo: (obj, name, callback) ->
                @listeners or= {}
                (@listeners[name] or= []).push fn: callback, obj: obj
                obj.on name, callback, @
                @

            stopListening: (obj, name, callback) ->
                return @ unless @listeners
                unless obj
                    item.obj.off key, item.fn, @ for item in value for key, value of @listeners
                    @listeners = {}
                    return @

                for key, value of @listeners when not name or name is key
                    @listeners[key] = []
                    for item in value
                        if item.obj isnt obj or (callback and callback isnt item.fn)
                            @listeners[key].push item
                        else
                            item.obj.off key, item.fn, @
                    delete @listeners[key] if @listeners[key].length is 0
                @

        @
