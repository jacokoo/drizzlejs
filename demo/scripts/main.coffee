require.config
    baseUrl: 'scripts'
    paths:
        text: '../bower_components/requirejs-text/text'
        jquery: '../bower_components/jquery/dist/jquery'
        drizzle: 'drizzlejs/drizzle'
        handlebars: '../bower_components/handlebars/handlebars'
    shim:
        handlebars: exports: 'Handlebars'

require ['drizzle'], (D) ->
    window.app = app = new D.Application()
    app.show('main/viewport').done (viewport) ->
        {top, sidebar, content} = viewport.regions
        app.setRegion content
        app.chain [
            top.show 'main/top'
            sidebar.show 'main/sidebar'
        ], ->
            app.startRoute('index', '/', 'main/top')