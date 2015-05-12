define

    routes:
        'index': 'showIndex'
        'alert/:message': 'alert'
        'module/*id': 'showModule'

    interceptors:
        '/': ->
            @Promise.chain(
                -> @app.show('main/viewport', forceRender: false)
                (viewport) ->
                    {top, sidebar, content} = viewport.regions
                    top.show 'main/top'
                    sidebar.show 'main/sidebar'
                    content
            )

    showIndex: (content) ->
        content.show 'content/index'

    showModule: (content, id) ->
        content.show id

    alert: (content, message)->
        console.log content
        @app.message.success message
