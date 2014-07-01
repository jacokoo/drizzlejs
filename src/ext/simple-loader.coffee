define ['../loader', '../module', '../view'], (Loader, Module, View) ->

    class Simple extends Loader
        constructor: (app, name = 'simple') ->
            super app, name

        loadModule: (path, parentModule) ->
            {name} = Loader.analyse path
            @deferred new Module(name, @app, @, separatedTemplate: true)

        loadView: (name, module, item) ->
            {name} = Loader.analyse name
            @deferred new View(name, module, @, {})

    Simple
