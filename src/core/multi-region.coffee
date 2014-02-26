define [
    'jquery'
    'underscore'
    './region'
], ($, _, Region) ->

    class MultiRegion extends Region
        constructor: ->
            super
            @items = {}
            @elements = {}

        activate: (item) ->

        createElement: (key, item) ->
            el = $ '<div></div>'
            @el.append el
            el

        getEl: (item) ->
            return @el if not item

            key = item.regionInfo?.key
            return null if not key
            @elements[key] or (@elements[key] = @createElement(key, item))

        close: (item) ->
            if not item
                return @chain 'close all items', ->
                    v.close() for v in @items
                ->
                    @empty()
                    @items = {}
                    @elements = {}
                    @

            key = item.regionInfo?.key
            return if not key

            throw new Error('Trying to close an item which is not in the region') if @items[key].id isnt item.id

            @chain 'close item:' + item.name, ->
                item.close()
            , ->
                delete @items[key]
                @elements[key].empty()
                @currentItem = null
                @

        showItem: (item, options, deferred) ->
            unless item and item.render and item.setRegion
                @logger.warn "try to show an item which is neither a view nor a module"
                return deferred.reject item

            info = item.regionInfo or (item.regionInfo = {})
            key = info.key or (info.key = _.uniqueId 'K')

            if @items[key] and @items[key].id is item.id
                return @chain 'show item:' + item.name, item.render(options), ->
                    deferred.resolve item

            @chain 'show item:' + item.name,
            [ ->
                item.region.close(item) if item.region and item.region.id isnt @id
            , ->
                @close(@items[key]) if @items[key]
            ]
            , ->
                @items[key] = item
                item.setRegion @
            , ->
                item.render(options)
            .done ->
                deferred.resolve item
