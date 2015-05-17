D.PageableModel = class PageableModel extends D.Model
    constructor: ->
        super
        defaults = @app.options.pagination
        @pagination =
            page: @options.page or 1
            pageCount: 0
            pageSize: @options.pageSize or defaults.pageSize
            pageKey: @options.pageKey or defaults.pageKey
            pageSizeKey: options.pageSizeKey or defaults.pageSizeKey
            recordCountKey: options.recordCountKey or defaults.recordCountKey

    initialize: -> @data = @options.data or []

    set: (data) ->
        p = @pagination
        p.recordCount = data[p.recordCountKey]
        p.pageCount = Math.ceil(p.recordCount / p.pageSize)
        super

    getParams: ->
        params = super or {}
        p = @pagination
        params[p.pageKey] = p.page
        params[p.pageSizeKey] = p.pageSize
        params

    clear: ->
        @pagination.page = 1
        @pagination.pageCount = 0
        super

    turnToPage: (page) ->
        @pagination.page = page if page <= @pagination.pageCount and page >= 1
        @

    firstPage: -> @turnToPage 1
    lastPage: -> @turnToPage @pagination.pageCount
    nextPage: -> @turnToPage @pagination.page + 1
    prevPage: -> @turnToPage @pagination.page - 1

    getPageInfo: ->
        {page, pageSize, recordCount} = @pagination
        d = if @data.length > 0
            page: page, start: (page - 1) * pageSize + 1, end: page * pageSize, total: recordCount
        else
            page: page, start: 0, end: 0, total: 0

        d.end = d.total if d.end > d.total
        d

D.Model.register 'pagaable', D.PageableModel
