D.MultiRegion = class MultiRegion extends D.Region
    constructor: ->
        super
        @items = {}
        @elements = {}

    activate: (item) ->

    createElement: (key, item) ->
        el = root.document.createElement 'div'
        @el.append el
        el

    getKey: (item) ->
        key = item.moduleOptions?.key or item.renderOptions?.key
        @error 'Region key is required' unless key
        key

    getEl: (item) ->
        return @el if not item

        key = @getKey item
        @items[key] = item
        @elements[key] or (@elements[key] = @createElement(key, item))

    update: (el, item) ->
        e = @getEl(item)
        @dd.apply @e, @dd.diff(@e, el)

    empty: (item) ->
        if item
            el = @getEl(item)
            el.parentNode.removeChild(el)
        else
            @el.innerHTML = ''

    close: ->
        delete @current
        @elements = {}
        items = @items
        @items = {}
        @Promise.chain (item.close() for key, item of items)
