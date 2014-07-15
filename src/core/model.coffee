D.Model = class Model extends D.Base

    constructor: (@app, @module, @options = {}) ->
        @data = @options.data or {}
        @params = {}

        if options.pageable
            defaults = D.Config.pagination
            p = @pagination =
                page: options.page or 1
                pageCount: 0
                pageSize: options.pageSize or defaults.pageSize
                pageKey: options.pageKey or defaults.pageKey
                pageSizeKey: options.pageSizeKey or defaults.pageSizeKey
                recordCountKey: options.recordCountKey or defaults.recordCountKey

        super 'd'
        @module.container.delegateEvent @

    set: (data) ->
        @data = if D.isFunction @options.parse then @options.parse data else data
        if p = @pagination
            p.recordCount = @data[p.recordCountKey]
            p.pageCount = Math.ceil(p.recordCount / p.pageSize)
        @data = @data[@options.root] if @options.root
        @

    append: (data) ->
        if D.isObject @data
            D.extend @data, data
        else if D.isArray @data
            @data = @data.concat if D.isArray(data) then data else [data]
        @

    find: (name, value) ->
        return null unless D.isArray @data
        item for item in @data when item[name] is value

    findOne: (name, value) ->
        return null unless D.isArray @data
        return item for item in @data when item[name] is value

    url: -> @getOptionResult(@options.url) or ''

    toJSON: -> @data

    getParams: ->
        d = {}
        if p = @pagination
            d[p.pageKey] = p.page
            d[p.pageSizeKey] = p.pageSize

        D.extend d, @params, @options.params

    clear: ->
        @data = {}
        if p = @pagination
            p.page = 1
            p.pageCount = 0

    turnToPage: (page, options) ->
        return @createRejectedDeferred() unless p = @pagination and page <= p.pageCount and page >= 1
        p.page = page
        @get options

    firstPage: (options) -> @turnToPage 1, options
    lastPage: (options) -> @turnToPage @pagination.pageCount, options
    nextPage: (options) -> @turnToPage @pagination.page + 1, options
    prevPage: (options) -> @turnToPage @pagination.page - 1, options

    getPageInfo: ->
        return {} unless p = @pagination
        d = if @data.length > 0
            start: (p.page - 1) * p.pageSize + 1, end: p.page * p.pageSize,  total: p.recordCount
        else
            start: 0, end: 0, total: 0

        d.end = d.total if d.end > d.total
        d

for item in ['get', 'post', 'put', 'del']
    do (item) -> D.Model::[item] = (options) ->
        @chain D.Request[item](@, options), -> @trigger 'sync'