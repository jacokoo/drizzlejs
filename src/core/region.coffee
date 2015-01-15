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

    getCurrentItem: -> @currentItem

    setCurrentItem: (item) -> @currentItem = item

    # show the specified item which could be a view or a module
    show: (item, options = {}) ->
        if cur = @getCurrentItem item, options
            if (D.isObject(item) and item.id is cur.id) or (D.isString(item) and D.Loader.analyse(item).name is cur.name)
                return @createResolvedDeferred(cur) if options.forceRender is false
                return @chain cur.render(options), cur

        @chain (if D.isString(item) then @app.getLoader(item).loadModule(item) else item), (item) ->
            throw new Error "Can not show item: #{item}" unless item.render and item.setRegion
            item
        , [(item) ->
            item.region.close() if item.region
            item
        , ->
            @close cur
        ], ([item]) ->
            item.setRegion @
            @setCurrentItem item, options
            item
        , (item) ->
            item.render(options)

    close: ->
        item = @currentItem
        delete @currentItem
        @chain(
            -> item.close() if item
            @
        )

    delegateEvent: (item, name, selector, fn) ->
        n = "#{name}.events#{@id}#{item.id}"
        if selector then @el.on n, selector, fn else @el.on n, fn

    undelegateEvents: (item) ->
        @el.off ".events#{@id}#{item.id}"

    $$: (selector) ->
        @el.find selector

    setHtml: (html) -> @el.html html

    empty: -> @el.empty()
