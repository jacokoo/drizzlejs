D.Model = class Model extends D.Base
    constructor: (@app, @module, options = {}) ->
        @data = options.data or {}
        @params = D.extend {}, options.params
        super 'D', options
        @app.delegateEvent @

    url: -> @getOptionValue('url') or ''

    getFullUrl: -> D.Request.url @

    getParams: -> D.extend {}, @params

    set: (data) ->
        d = if D.isFunction @options.parse then @options.parse.call(@, data) else data
        @data = if @options.root then d[@options.root] else d
        @changed()
        @

    changed: ->
        @trigger 'change'

    append: (data) ->
        if D.isObject @data
            D.extend @data, data
        else if D.isArray @data
            @data = @data.concat if D.isArray(data) then data else [data]
        @changed()
        @

    clear: ->
        @data = {}
        @changed()
        @

    find: (name, value) ->
        return @data[name] if D.isObject @data
        item for item in @data when item[name] is value

    findOne: (name, value) ->
        result = @find name, value
        return result unless result
        if D.isObject @data then result else result[0]
