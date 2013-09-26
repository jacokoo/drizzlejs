define [
    'jquery'
    'underscore'
    'backbone'
    './util'
    './config'
], ($, _, Backbone, util, config) ->

    class View extends Backbone.View
        constructor: (@root, @module, @name, @options = {}) ->
            @id = _.uniqueId 'v'
            util.extend @, options.extend if options.extend

        loadTemplate: ->

        loadHandlers: ->

        render: ->

        delegateEvents: ->

        undelegateEvents: ->

        serializeData: ->

        processIdReplacement: ->

        renderComponent: ->
