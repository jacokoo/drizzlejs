define [
    'jquery'
    'underscore'
    './util'
    './config'
], ($, _, util, config) ->

    require.s.contexts._.config.urlArgs = unless config.cache then '_c=' + (new Date()).getTime() else ''

    class Loader
        @TemplateCache = {}
        @loaders: {}

        @register: (loader, isDefault) ->
            @loaders[loader.name] = loader
            @defaultLoader = loader if isDefault

        @get: (loaderName) ->
            if loaderName and @loaders[loaderName] then @loaders[loaderName] else @defaultLoader

        @analyse: (name) ->
            [loader, name, args...] = name.split ':'
            if not name
                name = loader
                loader = null
            loader: loader, name: name, args: args

        constructor: (@options = {}) ->
            {@name, @root} = options
            @name or= 'default'
            @logger = new util.Logger @name

        loadResource: (path, plugin) ->
            path = @root.path path
            path = plugin + '!' + path if plugin
            wish = @deferred "load-#{path}"

            error = (e) =>
                @logger.warn 'resource:', path, 'not found, define it to null'
                if e.requireModules?[0] is path
                    define path, null
                    require.undef path
                    require [path], ->
                    wish.resolve null
                else
                    wish.reject null
                    throw e

            require [path], (obj) =>
                @logger.debug 'load resource:', path, 'done'
                wish.resolve obj
            , error

            wish.promise()

        loadModule: (path, parentModule) ->
            {name} = Loader.analyse path
            @chain "load module: #{path}", @loadResource(util.joinPath name, 'index'), (deferred, options) =>
                new Module path, @root, @, options

        loadTemplate: (module, name) ->
            path = util.joinPath module.name, name, '.html'
            template = Loader.TemplateCache[path]
            template = Loader.TemplateCache[path] = @loadResource path, 'text' unless tempalte

            @chain "load template: #{path}", template, (deferred, t) =>
                if _.isString t
                    t = Loader.TemplateCache[path] = Handlebars.compile t

                deferred.resolve t

        loadSeparatedTemplate: (module, view, name) ->

        loadModel: (name, module) ->

        loadCollection: (name, module) ->
