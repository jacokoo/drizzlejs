const D = require('drizzlejs')

exports.store = {
    callbacks: {
        createTodo (payload) {
            const { todos } = this.models
            todos.data.unshift({ id: D.uniqueId('todo'), text: payload.text, completed: false })
            todos.changed()
        },

        updateTodo (payload) {
            const { todos } = this.models
            todos.data.find(it => it.id === payload.id).text = payload.text
            todos.changed()
        },

        removeTodo (payload) {
            const { todos } = this.models
            todos.set(todos.data.filter(it => it.id !== payload.id), true)
        },

        completeTodo (payload) {
            const { todos } = this.models
            todos.data.find(it => it.id === payload.id).completed = payload.completed
            todos.changed()
        },

        toggleAllTodos (payload) {
            const { todos } = this.models
            todos.data.forEach(item => item.completed = payload.completed)
            todos.changed()
        },

        clearCompleted () {
            const { todos } = this.models
            todos.set(todos.data.filter(it => !it.completed), true)
        }
    },

    models: {
        todos: { autoLoad: 'after', data: [] },
        filter: { data: 'all' }
    }
}

exports.items = {
    header: 'header',
    main: 'main',
    footer: 'footer'
}

exports.mixin = {
    filter (id) {
        this.store.models.filter.set(id, true)
    }
}
