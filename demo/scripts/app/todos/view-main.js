var _ = require('lodash/collection');

module.exports = {
    bind: {
        todos: true
    },

    dataForTemplate: {
        todos: function(data) {
            var d = [], i, item, filter = this.module.filterKey;
            if (!filter || filter === 'all') {
                return data.todos;
            }
            return _.filter(data.todos, 'completed', filter === 'completed');
        },
        completed: function(data) {
            return _.all(data.todos, 'completed', true);
        },
        haveItem: function(data) {
            return data.todos.length > 0;
        }
    },

    actions: {
        'change toggle-*': 'completeTodo',
        'click destroy-*': 'removeTodo',
        'change toggleAll': 'toggleAllTodos'
    },

    dataForAction: {
        completeTodo: function(data, e) {
            data.completed = e.target.checked
            return data;
        },

        toggleAllTodos: function(data, e) {
            this.allCompleted = data.completed = e.target.checked
            return data;
        }
    }

}
