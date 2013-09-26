define [
    'jquery'
    'underscore'
    './util'
    './deferred'
], ($, _, util, Deferred) ->

    class Region
        constructor: (@root, @module, name, el) ->
            @id = _.uniqueId 'R'
            @logger = new util.Logger "Region #{name}"

            @el = if el instanceof $ then el else $ el
            @logger.warn "dom element: #{el} not exsits" if @el.size() is 0

        getEl: -> @el

        # show the specified item which could be a view or a module
        # close the item's region if it has one
        # close current region
        # assign current region to the item
        # set currentItem to item
        # render item
        show: (item, options) ->
            unless item and item.render and item.setRegion
                @logger.warn "try to show an item which is neither a view nor a module"
                return

            @chain 'show item:' + item.name,
            [ =>
                item.region.close() if item.region and item.region.id isnt @id
            , =>
                @close()
            ]
            , =>
                @showItem item, options

        close: ->
            return unless @currentItem
            @chain 'close item:' + @currentItem.name, =>
                @currentItem.close()
            , =>
                @empty()
                @currentItem = null
                @

        # for inner use, override it to customize empty behavior
        empty: -> @getEl().empty()

        # for inner use,
        showItem: (item, options) ->
            @currentItem = item
            item.setRegion @
            item.render(options)

    util.include Region, Deferred

    Region
