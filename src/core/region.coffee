D.Region = class Region extends D.Base
    @types = {}
    @register: (name, clazz) -> @types[name] = clazz
    @create: (type, app, module, el) ->
        clazz = @types[type] or Region
        new clazz(app, module, el)

    constructor: (@app, @module, el) ->
        @el = if el instanceof $ then el else $ el
        super 'r'

        throw new Error "Can not find DOM element: #{el}" if @el.size() is 0

    getEl: -> @el

    # show the specified item which could be a view or a module
    show: (item, options) ->
        if @currentItem
            if (D.isObject(item) and item.id is @currentItem.id) or (D.isString(item) and D.Loader.analyse(item).name is @currentItem.name)
                return @chain @currentItem.render(options), @currentItem

        @chain (if D.isString(item) then @app.getLoader(item).loadModule(item) else item), (item) ->
            throw new Error "Can not show item: #{item}" unless item.render and item.setRegion
            item
        , [(item) ->
            item.region.close() if item.region
            item
        , ->
            @close()
        ], ([item]) ->
            item.setRegion @
            @currentItem = item
        , (item) ->
            item.render(options)

    close: ->
        return @createResolvedDeferred() unless @currentItem
        @chain ->
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
