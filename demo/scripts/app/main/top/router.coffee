define

    routes:
        '/:id': 'showId'

    showId: (id) ->
        console.log 'showId', id, @
