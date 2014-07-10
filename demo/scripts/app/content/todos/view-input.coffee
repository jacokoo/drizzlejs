define ['jquery', 'drizzle'], ($, D) ->

    bind: todos: ''

    events:
        'keypress input': 'addItem'

    handlers:
        addItem: (e) ->
            return unless e.keyCode is 13
            t = $(e.target)
            text = t.val()
            return unless text
            @data.todos.append(id: D.uniqueId('todo'), text: text).trigger 'changed'
            t.val ''
