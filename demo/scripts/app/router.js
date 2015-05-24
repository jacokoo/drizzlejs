module.exports = {
    interceptors: {
        '/': 'showViewport',
        'todos': 'showTodos'
    },

    routes: {
        'todos': 'showTodos',
        'todos/:id': 'filterTodos'
    },

    showViewport: function() {
        return this.Promise.chain(
            this.app.show('viewport', {forceRender: false}),
            function(viewport) {
                return viewport.regions.content;
            }
        );
    },

    showTodos: function(content) {
        return content.show('todos', {forceRender: false});
    },

    filterTodos: function(todos, id) {
        todos.filter(id);
    }
};
