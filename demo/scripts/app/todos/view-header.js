module.exports = {
    bind: {
        todos: false
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
            this.$('new-todo').value = ''
            return data;
        }
    }
}
