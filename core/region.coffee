define [
    'jquery'
    'underscore'
    './base'
], ($, _, Base) ->

    class Region extends Base
        constructor: (@app, @module, @name, el) ->
            @id = _.uniqueId 'R'
            @el = if el instanceof $ then el else $ el
            super

        initialize: ->
            @logger.warn "dom element: #{el} not exsits" if @el.size() is 0

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

        delegateEvent: (view, name, selector, fn) ->
            n = "#{name}.events#{@id}#{view.id}"
            if selector then @el.on n, selector, fn else @el.on n, fn

        undelegateEvents: (view)->
            @el.off ".events#{@id}#{view.id}"

        attachHtml: (html) ->
            @el.html html

        $$: (selector) ->
            @el.find selector

        # for inner use, override it to customize empty behavior
        empty: -> @getEl().empty()

        # for inner use,
        showItem: (item, options, deferred) ->
            unless item and item.render and item.setRegion
                @logger.warn "try to show an item which is neither a view nor a module"
                return deferred.reject item

            @chain 'show item:' + item.name,
            [ ->
                item.region.close() if item.region and item.region.id isnt @id
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
