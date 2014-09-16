D.MultiRegion = class MultiRegion extends D.Region
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
        if item
            key = item.regionInfo?.key
            return @createResolvedDeferred @ unless key and @items[key]
            throw new Error('Trying to close an item which is not in the region') if @items[key].id isnt item.id

            return @chain(
                -> item.close()
                -> delete @items[key]
                @
            )

        @chain(
            -> v.close() for k, v of @items
            ->
                @items = {}
                @elements = {}
            @
        )

    getCurrentItem: (item, options = {}) ->
        key = if D.isString(item) then options.regionKey else item.regionInfo?.key
        if key then (if i = @items[key] then i else regionInfo: key: key) else null

    setCurrentItem: (item, options) ->
        info = item.regionInfo or (item.regionInfo = {})
        key = info.key or (info.key = options.regionKey or D.uniqueId 'K')
        @items[key] = item

    setHtml: (html, item) -> @getEl(item).html html

    empty: (item) -> if item then @getEl(item).remove() else @el.empty()
