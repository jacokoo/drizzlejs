D.Loader = class Loader extends D.Base
    @analyse: (name) ->
        return loader: null, name: name unless D.isString name

        [loaderName, name, args...] = name.split ':'
        if not name
            name = loaderName
            loaderName = null
        loader: loaderName, name: name, args: args

    constructor: (@app) ->
        @name = 'default'
        @fileNames = @app.options.fileNames
        super 'L'

    loadResource: (path) ->
        path = @app.options.scriptRoot + '/' + path
        @Promise.create (resolve, reject) ->

            if @app.options.amd
                error = (e) ->
                    if e.requireModules?[0] is path
                        define path, null
                        require.undef path
                        require [path], ->
                        resolve null
                    else
                        reject null
                        throw e
                require [path], (obj) ->
                    resolve obj
                , error
            else
                resolve require(path)

    loadModuleResource: (module, path) ->
        @loadResource module.name + '/' + path

    loadModule: (path, parent) ->
        {name} = Loader.analyse path
        @Promise.chain @loadResource(name + '/' + @fileNames.module), (options) =>
            module = new D.Module name, @app, @, options
            module.module = parent if parent
            module

    loadView: (name, module, options) ->
        {name} = Loader.analyse name
        @Promise.chain @loadModuleResource(module, @fileNames.view + name), (options) =>
            new D.View name, module, @, options

    #load template for module
    loadTemplate: (module) ->
        @loadModuleResource(module, @fileNames.templates)

    #load template for view
    loadSeparatedTemplate: (view, name) ->
        @loadModuleResource(module, @fileNames.template + name)

    loadRouter: (path) ->
        {name} = Loader.analyse path
        path = name + '/' + @fileNames.router
        @loadResource(path)

D.SimpleLoader = class SimpleLoader extends D.Loader
    constructor: ->
        super
        @name = 'simple'

    loadModule: (path, parentModule) ->
        {name} = Loader.analyse path
        module = new D.Module(name, @app, @, separatedTemplate: true)
        module.parentModule = parentModule if parentModule
        @Promise.resolve module

    loadView: (name, module, item) ->
        {name} = Loader.analyse name
        @Promise.resolve new D.View(name, module, @, {})
