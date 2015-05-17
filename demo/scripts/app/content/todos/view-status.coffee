define

    bind: todos: true

    dataForTemplate:
        info: (data) ->
            todos = data.todos or []
            completed = 0
            completed++ for item in todos or [] when item.completed is true

            total: todos.length
            completed: completed
            left: todos.length - completed

    actions:
        'click remove': 'removeCompleted'

    handlers:
        removeCompleted: ->
            data = (item for item in @data.todos.data when not item.completed)
            @data.todos.set(data).trigger('changed')
