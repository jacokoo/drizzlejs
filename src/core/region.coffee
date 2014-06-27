define [
    'jquery'
    'underscore'
    './base'
], ($, _, Base) ->

    class Region extends Base
        @types = {}
        @register: (name, clazz) ->
            @types[name] = clazz
        @create: (type, app, module, name, el) ->
            clazz = @types[type] or Region
            new clazz(app, module, name, el)

        constructor: (@app, @module, @name, el) ->
            @id = _.uniqueId 'R'
            @el = if el instanceof $ then el else $ el
            super

        initialize: ->
            @logger.warn "DOM element: #{el} not exists" if @el.size() is 0

        getEl: -> @el

        # show the specified item which could be a view or a module
        # close the item's region if it has one
        # close current region
        # assign current region to the item
        # set currentItem to item
        # render item
        show: (item, options) ->
            deferred = @createDeferred()
            if _.isString item
                name = @app.extractName item
                if @currentItem and @currentItem.name is name
                    return deferred.resolve @currentItem
                @app.getLoader(item).loadModule(item).done (module, args) =>
                    @showItem module, options, deferred
            else
                @showItem item, options, deferred
            deferred

        close: ->
            return unless @currentItem
            @chain 'close item:' + @currentItem.name, ->
                @currentItem.close()
            , ->
                @empty()
                @currentItem = null
                @

        delegateEvent: (item, name, selector, fn) ->
            n = "#{name}.events#{@id}#{item.id}"
            if selector then @el.on n, selector, fn else @el.on n, fn

        undelegateEvents: (item) ->
            @el.off ".events#{@id}#{item.id}"

        $$: (selector) ->
            @el.find selector

        empty: -> @getEl().empty()

        # for inner use,
        showItem: (item, options, deferred) ->
            unless item and item.render and item.setRegion
                @logger.warn "try to show an item which is neither a view nor a module"
                return deferred.reject item

            if item.region and item.region.id is @id
                return @chain 'show item:' + item.name, item.render(options), ->
                    deferred.resolve item

            @chain 'show item:' + item.name,
            [ ->
                item.region.close() if item.region
            , ->
                @close()
            ]
            , ->
                @currentItem = item
                item.setRegion @
            , ->
                item.render(options)
            .done ->
                deferred.resolve item

    Region
