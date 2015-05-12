require.config
    baseUrl: 'scripts'
    paths:
        text: '../bower_components/requirejs-text/text'
        jquery: '../bower_components/jquery/dist/jquery'
        drizzle: 'drizzlejs/drizzle-all'
        'handlebars.runtime': '../bower_components/handlebars/handlebars.runtime.amd'
        'diff-dom': '../bower_components/diff-dom/diffDOM'
    shim:
        'diff-dom': exports: 'diffDOM'

require ['drizzle', 'jquery'], (D) ->
    D.Region.register 'multi', D.MultiRegion # just for demo

    window.app = app = new D.Application
        urlRoot: 'data'
        urlSuffix: '.json'
        amd: true
        defaultRegion: document.getElementById 'content'

    app.startRoute 'index', '/', 'main/top'

    ###
    app.show('main/viewport').done (viewport) ->
        {top, sidebar, content} = viewport.regions
        app.setRegion content
        app.Promise.chain [
            top.show 'main/top'
            sidebar.show 'main/sidebar'
        ], ->
            app.startRoute('index', '/', 'main/top')
    ###
