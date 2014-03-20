define [
    'jquery'
    'underscore'
    'backbone'
    'handlebars'
    './base'
    './config'
    './module'
    './view'
    './collection'
], ($, _, Backbone, Handlebars, Base, config, Module, View, Collection) ->

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
                @logger.warn 'resource:', path, 'not found, define it to null', e
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
                obj = obj(@app) if _.isFunction obj
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
                    new Module.Layout name, module, @, _.extend(layout, options)

        innerLoadTemplate: (module, p) ->
            path = p + '.html'
            template = Loader.TemplateCache[module.name + path]
            template = Loader.TemplateCache[module.name + path] = @loadModuleResource module, path, 'text' unless template

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

        parseUrl: (u = '', module) ->
            url = if _.isFunction u then u.apply module else u
            prefix = if module.options.urlPrefix then module.options.urlPrefix + module.name else module.name
            @app.url prefix, url or ''

        loadModel: (name = '', module) ->
            return name if name instanceof Backbone.Model
            name = url: name if _.isString name
            name = _.extend {}, name
            name.urlRoot = @parseUrl name.url, module
            delete name.url
            delete name.autoLoad
            data = name.data
            delete name.data

            model = Backbone.Model.extend name
            m = new model()
            m.set data if data
            m

        loadCollection: (name = '', module) ->
            return name if name instanceof Backbone.Collection or name instanceof Backbone.Model
            name = url: name if _.isString name
            name = _.extend {}, name
            name.url = @parseUrl name.url, module

            new Collection(null, name)

        loadHandlers: (view, name) ->
            view.options.handlers or {}

        loadRouter: (path) ->
            {name} = Loader.analyse path
            path = Base.joinPath name, config.fileNames.router
            path = path.substring(1) if path.charAt(0) is '/'
            @chain 'load router:' + path, @loadResource(path)

    Loader
