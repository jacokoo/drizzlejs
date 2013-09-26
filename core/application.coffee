define ['jquery', 'underscore', './util', './config'], ($, _, util, config) ->

    getPath = (root, path) ->
        return root if not path
        if path.charAt(0) is '/' then path else util.joinPath root, path

    class Application
        constructor: (@options = {}) ->
            @logger = new util.Logger 'application'
            @scriptRoot = options.scriptRoot or config.scriptRoot
            @urlRoot = options.urlRoot or config.urlRoot
            @counter = 0

            @region = new Region @, null, 'body', $(document.body)
            @regions = [@region]

            @global = {}

        path: (path) ->
            getPath @scriptRoot, path

        url: (path) ->
            getPath @urilRoot, path

        registerLoader: (loader) ->

        setRegion: (name, el) ->
            @region = new Region @, null, name, el
            @regions.unshift @region

        startRoutes: ->

        show: (feature, options) ->
            @region.show feature, options
