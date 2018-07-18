exports.bindings = {
    todos: true,
    filter: true
}

exports.dataForTemplate = {
    info ({ filter, todos }) {
        return {
            left: todos.filter(it => !it.completed).length,
            haveCompleted: todos.some(it => it.completed),
            haveItem: todos.length > 0,
            [filter]: true
        }
    }
}

exports.actions = {
    'click remove': 'clearCompleted'
}
