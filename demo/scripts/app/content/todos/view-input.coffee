define ['jquery', 'drizzle'], ($, D) ->

    bind: todos: false

    events:
        'keypress input': 'addItem'

    handlers:
        addItem: (e) ->
            return unless e.keyCode is 13
            t = @$ 'input'
            text = t.value
            return unless text
            @data.todos.append(id: D.uniqueId('todo'), text: text)
            t.value = ''
