module.exports = {
    interceptors: {
        todos: 'showTodos'
    },

    routes: {
        todos: 'showTodos',
        'todos/:id': 'filterTodos'
    },

    showTodos: function() {
        return this.app.show('content', 'todos', { forceRender: false });
    },

    filterTodos: function(todos, id) {
        todos.filter(id);
    }
};
