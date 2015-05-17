define ['jquery'], ($) ->

    bind: todos: true

    actions:
        'change chk-*': 'completeTodo'
        'click rm-*': 'removeTodo'

    dataForAction:
        completeTodo: (data, e) ->
            data.completed = e.target.checked
            data
