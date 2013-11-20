define [
    'jquery'
    'underscore'
    'backbone'
    'handlebars'
    './base'
    './config'
    './module'
    './view'
], ($, _, Backbone, Handlebars, Base, config, Module, View) ->

    require.s.contexts._.config.urlArgs = unless config.cache then '_c=' + (new Date()).getTime() else ''

    class Loader extends Base
        @TemplateCache = {}

        @analyse: (name) ->
            return loader: null, name: name unless _.isString name

            [loader, name, args...] = name.split ':'
            if not name
                name = loader
                loader = null
            loader: loader, name: name, args: args

        constructor: (@app, @name = 'Default Loader') ->
            super

        loadResource: (path, plugin) ->
            path = @app.path path
            path = plugin + '!' + path if plugin
            wish = @createDeferred "load-#{path}"

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
                @logger.debug 'load resource:', path, 'done, got:', obj
                wish.resolve obj
            , error

            wish.promise()

        loadModuleResource: (module, path, plugin) ->
            @loadResource Base.joinPath(module.name, path), plugin

        loadModule: (path, parentModule) ->
            {name} = Loader.analyse path
            @chain "load module: #{path}", @loadResource(Base.joinPath name, 'index'), (options) =>
                new Module name, @app, @, options

        loadView: (name, module, options) ->
            {name} = Loader.analyse name
            @chain "load view: #{name} in module #{module.name}",
                @loadModuleResource(module, config.fileNames.view + name)
                (options) =>
                    new View name, module, @, options

        loadLayout: (module, name, layout = {}) ->
            {name} = Loader.analyse name
            @chain "load layout: #{name} for module #{module.name}",
                if layout.templateOnly is false then @loadModuleResource(module, name) else {}
                (options) =>
                    new Module.Layout name, module, @, options

        innerLoadTemplate: (module, p) ->
            path = p + '.html'
            template = Loader.TemplateCache[path]
            template = Loader.TemplateCache[path] = @loadModuleResource module, path, 'text' unless template

            @chain "load template: #{path}", template, (t) =>
                if _.isString t
                    t = Loader.TemplateCache[path] = Handlebars.compile t
                t

        #load template for module
        loadTemplate: (module) ->
            path = config.fileNames.templates
            @innerLoadTemplate module, path

        #load template for view
        loadSeparatedTemplate: (view, name) ->
            path = config.fileNames.template + name
            @innerLoadTemplate view.module, path

        parseUrl: (url = '', module) ->
            url = url.apply module if _.isFunction url
            if url.charAt(0) is '/'
                url.substring 1
            else if url.indexOf('../') is 0
                if @app.urlRoot then Base.joinPath @app.urlRoot, url.substring(3) else url.substring(3)
            else
                if @app.urlRoot then Base.joinPath @app.urlRoot, module.name, url else Base.joinPath module.name, url

        loadModel: (name = '', module) ->
            return name if name instanceof Backbone.Model
            name = url: name if _.isString name

            url = if _.isFunction name.url then name.url.apply module else url
            name.urlRoot = @app.url module.name, url or ''
            delete name.url

            model = Backbone.Model.extend name
            new model()

        loadCollection: (name = '', module) ->
            return name if name instanceof Backbone.Collection
            name = url: name if _.isString name
            url = if _.isFunction name.url then name.url.apply module else url
            name.url = @app.url module.name, url or ''

            collection = Backbone.Collection.extend name
            new collection()

        loadHandlers: (view, name) ->
            view.options.handlers or {}
    Loader
