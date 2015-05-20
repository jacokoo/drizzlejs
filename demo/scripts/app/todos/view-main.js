var _ = require('lodash/collection');
var $ = require('jquery');

module.exports = {
    bind: {
        todos: true
    },

    events: {
        'dblclick edit-*': 'showEdit',
        'blur input-*': 'cancelEdit'
    },

    handlers: {
        showEdit: function(id, e) {
            $(e.target).closest('li').addClass('editing');
            this.$('input-' + id).focus();
        },
        cancelEdit: function(id, e) {
            $(e.target).closest('li').removeClass('editing');
        }
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
        'change toggleAll': 'toggleAllTodos',
        'keypress input-*': 'updateTodo'
    },

    dataForAction: {
        completeTodo: function(data, e) {
            data.completed = e.target.checked
            return data;
        },

        toggleAllTodos: function(data, e) {
            this.allCompleted = data.completed = e.target.checked
            return data;
        },

        updateTodo: function(data, e) {
            if (e.keyCode !== 13) {
                return false;
            }
            e.preventDefault();

            if (!data.text) {
                return false;
            }
            // caused by https://github.com/marcelklehr/vdom-virtualize/issues/23
            data.id = data.qid
            return data;
        }
    }

}
