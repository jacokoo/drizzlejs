define

    routes:
        'index': 'showIndex'
        'alert/:message': 'alert'

    deps:
        'alert/:message': 'index'

    showIndex: ->
        @app.show 'content/index'

    alert: (module, message)->
        console.log module
        @app.message.success message
