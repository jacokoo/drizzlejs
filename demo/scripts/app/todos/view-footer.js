var _ = require('lodash/collection');

exports.bindings = {
    todos: true,
    filter: true
};

exports.dataForTemplate = {
    info: function(data) {
        var info = {
            left: _.filter(data.todos, 'completed', false).length,
            haveCompleted: _.some(data.todos, 'completed', true),
            haveItem: data.todos.length > 0
        };

        info[data.filter] = true;
        return info;
    }
};

exports.actions = {
    'click remove': 'clearCompleted'
};
