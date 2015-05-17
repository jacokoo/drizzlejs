module.exports = {
    bind: {
        todos: true
    },

    actions: {
        'keypress new-todo': 'createTodo'
    },

    dataForAction: {
        createTodo: function(data, e) {
            if (e.keyCode !== 13 ) {
                return false;
            }
            e.preventDefault();

            if (!data.text) {
                return false;
            }
            return data;
        }
    }
}
