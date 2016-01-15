var _ = require('lodash/collection');

exports.bindings = {
    todos: true
};

exports.dataForTemplate = {
    info: function(data) {
        var info = {
            left: _.filter(data.todos, 'completed', false).length,
            haveCompleted: _.any(data.todos, 'completed', true),
            haveItem: data.todos.length > 0
        };

        info[this.module.filterKey] = true;
        return info;
    }
};

exports.actions = {
    'click remove': 'clearCompleted'
};
