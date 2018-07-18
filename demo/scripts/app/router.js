module.exports = {
    interceptors: {
        todos: 'showTodos'
    },

    routes: {
        todos: 'showTodos',
        'todos/:id': 'filterTodos'
    },

    showTodos () {
        return this.app.show('content', 'todos', { forceRender: false })
    },

    filterTodos (todos, id) {
        todos.filter(id)
    }
}
