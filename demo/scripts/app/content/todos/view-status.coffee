define

    bind: todos: 'changed#render'

    adjustData: (data) ->
        data.total = data.todos.length
        data.completed = 0
        data.completed++ for item in data.todos when item.completed is true
        data.left = data.total - data.completed
        data

    events:
        'click remove': 'removeCompleted'

    handlers:
        removeCompleted: ->
            data = (item for item in @data.todos.data when not item.completed)
            @data.todos.set(data).trigger('changed')
