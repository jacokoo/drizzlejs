(() => {
    const {
        SN, DN, TN, TX, RG, REF, E, NDA, NSA, SV, DV, AT, KV, H, TR, HIF, HEQ, HGT, HLT, HGTE, HLTE, HNE,
        EACH, IF, EQ, GT, LT, GTE, LTE, NE, C
    } = drizzle.factory
    const {ModuleTemplate} = drizzle

    const template = new ModuleTemplate()
    template.views('create-todo', 'todo-list')

    const d1 = SN('section', null, KV('class', 'todoapp'))
    const d2 = SN('header', null, KV('class', 'header'))
    const d3 = SN('h1')
    const d4 = TX('todos')
    const d5 = REF('create-todo')
    const d6 = REF('todo-list', null, [KV('todos')])

    C(d1, d2, d6)
    C(d2, d3, d5)
    C(d3, d4)
    template.nodes = [d1]

    MODULES['app/hello/index'] = {
        template: template,
        store: {
            models: {
                todos: {
                    data: () => [{name: 'task 1', completed: true}, {name: ' task 2'}]
                }
            },

            actions: {
                newTodo (payload) {
                    const {todos} = this.models
                    todos.set(todos.get().concat([payload]))
                },

                toggleAll (payload) {
                    const {todos} = this.models
                    todos.set(todos.get().map(it => Object.assign(it, payload)))
                },

                remove (item) {
                    const {todos} = this.models
                    todos.set(todos.get().filter(it => it !== item))
                },

                commitEdit({todo, name}) {
                    const todos = this.models.todos.get()
                    todos.find(it => it === todo).name = name
                    this.models.todos.set(todos)
                },

                revertEdit ({todo, cached}) {
                    const todos = this.models.todos.get()
                    todos.find(it => it === todo).name = cached
                    this.models.todos.set(todos)
                }
            }
        }
    }
})()
