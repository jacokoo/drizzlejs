D.Model = class Model extends D.Base
    constructor: (@app, @module, options = {}) ->
        @params = D.extend {}, options.params
        super 'D', options
        @app.delegateEvent @

    initialize: ->
        @data = @options.data or {}

    url: -> @getOptionValue('url') or ''

    getFullUrl: -> D.Request.url @

    getParams: -> D.extend {}, @params

    set: (data, trigger) ->
        d = if D.isFunction @options.parse then @options.parse.call(@, data) else data
        @data = if @options.root then d[@options.root] else d
        @changed() if trigger
        @

    changed: ->
        @trigger 'change'

    clear: (trigger) ->
        @data = {}
        @changed() if trigger
        @

D.extend D.Model, D.Factory
