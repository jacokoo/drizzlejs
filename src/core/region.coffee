D.Region = class Region extends D.Base
    constructor: (@app, @module, @el, @name = 'region') ->
        @error 'The DOM element for region is not found' unless @el
        super 'R'

    isCurrent: (item) ->
        return false unless @current
        return true if D.isObject(item) and item.id is @current.id
        return true if D.isString(item) and D.Loader.analyse(item).name is @current.name
        false

    show: (item, options = {}) ->
        if @isCurrent item
            return @Promise.resolve(@current) if options.forceRender is false
            return @Promise.chain @current.render(options), @current

        item = @app.getLoader(item).loadModule(item) if D.isString item
        @Promise.chain item, (obj) ->
            @error "Can not render #{obj}" unless obj.render and obj.setRegion
            obj
        , [(obj) ->
            @Promise.chain(
                -> obj.region.close() if obj.region
                obj
            )
        , ->
            @close()
        ], ([obj]) ->
            @current = obj
            @Promise.chain obj.setRegion(@), obj
        , (obj) ->
            obj.render(options)

    close: -> @Promise.chain(
        -> @current.close() if @current
        ->
            delete @current
            @
    )

    getEl: -> @el

    $$: (selector) -> @el.querySelectorAll selector

    empty: -> @el.innerHTML = ''

    delegateDomEvent: (item, name, selector, fn) ->
        n = "#{name}.events#{@id}#{item.id}"
        A.delegateDomEvent @el, n, selector, fn

    undelegateDomEvents: (item) ->
        A.undelegateDomEvents @el, ".events#{@id}#{item.id}"

D.extend D.Region, D.Factory
