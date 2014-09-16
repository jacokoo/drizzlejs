require.config
    baseUrl: 'scripts'
    paths:
        text: '../bower_components/requirejs-text/text'
        jquery: '../bower_components/jquery/dist/jquery'
        drizzle: 'drizzlejs/drizzle-all'
        handlebars: '../bower_components/handlebars/handlebars'
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap'
    shim:
        handlebars: exports: 'Handlebars'
        bootstrap: ['jquery']

require ['drizzle', 'bootstrap'], (D) ->
    D.Region.register 'multi', D.MultiRegion # just for demo

    window.app = app = new D.Application()
    app.show('main/viewport').done (viewport) ->
        {top, sidebar, content} = viewport.regions
        app.setRegion content
        app.chain [
            top.show 'main/top'
            sidebar.show 'main/sidebar'
        ], ->
            app.startRoute('index', '/', 'main/top')
