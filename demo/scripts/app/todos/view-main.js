var _ = require('lodash/collection');

exports.bindings = {
    todos: true,
    filter: true
};

exports.events = {
    'dblclick edit-*': 'showEdit',
    'blur input-*': 'cancelEdit'
};

exports.handlers = {
    showEdit: function(id, e) {
        e.target.parentNode.parentNode.classList.add('editing');
        this.$('input-' + id).focus();
    },
    cancelEdit: function(id, e) {
        e.target.parentNode.parentNode.classList.remove('editing');
    }
};

exports.dataForTemplate = {
    todos: function(data) {
        var filter = data.filter;
        if (!filter || filter === 'all') {
            return data.todos;
        }
        return _.filter(data.todos, 'completed', filter === 'completed');
    },
    completed: function(data) {
        return _.every(data.todos, 'completed', true);
    },
    haveItem: function(data) {
        return data.todos.length > 0;
    }
};

exports.actions = {
    'change toggle-*': 'completeTodo',
    'click destroy-*': 'removeTodo',
    'change toggleAll': 'toggleAllTodos',
    'keypress input-*': 'updateTodo'
};

exports.dataForActions = {
    completeTodo: function(data, e) {
        data.completed = e.target.checked;
        return data;
    },

    toggleAllTodos: function(data, e) {
        this.allCompleted = data.completed = e.target.checked;
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
        return data;
    }
};
