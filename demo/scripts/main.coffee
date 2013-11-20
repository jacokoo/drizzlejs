require.config
    shim:
        underscore: exports: '_'
        backbone:
            deps: ['jquery', 'underscore'], exports: 'Backbone'
        handlebars: exports: 'Handlebars'
        'jqueryui/jquery-ui': ['jquery']
    paths:
        jquery: '../bower_components/jquery/jquery'
        jqueryui: '../bower_components/jquery-ui/ui/'
        underscore: '../bower_components/lodash/lodash'
        backbone: '../bower_components/backbone/backbone'
        drizzle: '../bower_components/drizzlejs'
        text: '../bower_components/requirejs-text/text'
        handlebars: '../bower_components/handlebars/handlebars'

define [
    'jquery'
    'drizzle/drizzle'
    'jqueryui/jquery-ui'
], ($, Drizzle) ->

    app = window.app = new Drizzle.Application()
    app.global.applicationName = 'Drizzle Demos'
    $ ->
        app.chain app.show('simple:main/viewport'), (viewport) ->
            viewport.regions.sidebar.show 'main/menu'
