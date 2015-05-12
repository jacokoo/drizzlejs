define ['jquery'], ($) ->

    bind: todos: true

    events:
        'change chk-*': 'completeIt'
        'click rm-*': 'removeIt'

    handlers:
        completeIt: (id, e) ->
            @data.todos.findOne('id', id).completed = $(e.target).is(':checked')
            @data.todos.changed()

        removeIt: (id) ->
            data = (item for item in @data.todos.data when item.id isnt id)
            @data.todos.set(data)
