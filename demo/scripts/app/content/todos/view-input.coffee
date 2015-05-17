define ['jquery', 'drizzle'], ($, D) ->

    bind: todos: true

    actions:
        'keypress input': 'createTodo'

    dataForAction:
        createTodo: (data, e) ->
            return false unless e.keyCode is 13
            e.preventDefault()
            data
