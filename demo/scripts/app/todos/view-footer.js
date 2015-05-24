var _ = require('lodash/collection');

module.exports = {

    bind: {
        todos: true
    },

    dataForTemplate: {
        info: function(data) {
            var info = {
                left: _.filter(data.todos, 'completed', false).length,
                haveCompleted: _.any(data.todos, 'completed', true),
                haveItem: data.todos.length > 0
            };

            info[this.module.filterKey] = true;
            return info;
        }
    },

    actions: {
        'click remove': 'clearCompleted'
    }

};
