exports.bindings = {
    todos: true,
    filter: true
}

exports.events = {
    'dblclick edit-*': 'showEdit',
    'blur input-*': 'cancelEdit'
}

exports.handlers = {
    showEdit (id, e) {
        e.target.parentNode.parentNode.classList.add('editing')
        this.$(`input-${id}`).focus()
    },
    cancelEdit (id, e) {
        e.target.parentNode.parentNode.classList.remove('editing')
    }
}

exports.dataForTemplate = {
    todos ({ todos, filter }) {
        if (!filter || filter === 'all') {
            return todos
        }
        return todos.filter(it => it.completed === (filter === 'completed'))
    },
    completed ({ todos }) {
        return !todos.some(it => !it.completed)
    },
    haveItem (data) {
        return data.todos.length > 0
    }
}

exports.actions = {
    'change toggle-*': 'completeTodo',
    'click destroy-*': 'removeTodo',
    'change toggleAll': 'toggleAllTodos',
    'keypress input-*': 'updateTodo'
}

exports.dataForActions = {
    completeTodo (data, e) {
        data.completed = e.target.checked
        return data
    },

    toggleAllTodos (data, { target }) {
        this.allCompleted = target.checked
        data.completed = target.checked
        return data
    },

    updateTodo (data, e) {
        if (e.keyCode !== 13) {
            return false
        }
        e.preventDefault()

        if (!data.text) {
            return false
        }
        return data
    }
}
