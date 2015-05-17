define ['drizzle'], (D) ->

    store: todos: data: []

    actions:
        createTodo: (payload) ->
            @store.todos.append(id: D.uniqueId('todo'), text: payload.text)

        removeTodo: (payload) ->
            data = (item for item in @store.todos.data when item.id isnt payload.id)
            @store.todos.set data

        completeTodo: (payload) ->
            todo = @store.todos.findOne('id', payload.id)
            todo.completed = payload.completed
            @store.todos.changed()

        removeCompleted: (payload) ->
            data = (item for item in @store.todos.data when not item.completed)
            @store.todos.set data

    items:
        input: 'input'
        list: 'list'
        status: 'status'
