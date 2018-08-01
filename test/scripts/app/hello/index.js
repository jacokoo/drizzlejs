(() => {
    const {
        SN, DN, TN, TX, RG, REF, E, NDA, NSA, SV, DV, AT, KV, H, TR, HIF, HEQ, HGT, HLT, HGTE, HLTE, HNE,
        EACH, IF, EQ, GT, LT, GTE, LTE, NE, C
    } = drizzle.factory
    const {ModuleTemplate} = drizzle

    const template = new ModuleTemplate()
    template.views('create-todo', 'todo-list', 'todo-footer')

    const d1 = SN('section', null, KV('class', 'todoapp'))
    const d2 = SN('header', null, KV('class', 'header'))
    const d3 = SN('h1')
    const d4 = TX('todos')
    const d5 = REF('create-todo')
    const d6 = REF('todo-list', null, [KV('todos')])
    const d7 = REF('todo-footer', null, [KV('todos')])

    C(d1, d2, d6, d7)
    C(d2, d3, d5)
    C(d3, d4)
    template.nodes = [d1]

    let id = 0

    MODULES['app/hello/index'] = {
        template: template,
        store: {
            models: {
                todos: {
                    data: () => [{name: 'task 1', completed: true, id: id++}, {name: ' task 2', id: id++}]
                }
            },

            actions: {
                newTodo (payload) {
                    this.set({todos: this.get('todos').concat([Object.assign(payload, {id: id++})])})
                },

                toggleAll (payload) {
                    this.set({todos: this.get('todos').map(it => Object.assign(it, payload))})
                },

                toggle ({id, checked}) {
                    const todos = this.get('todos')
                    todos.find(it => it.id === id).completed = checked
                    this.set({ todos })
                },

                remove (item) {
                    this.set({todos: this.get('todos').filter(it => it.id !== item.id)})
                },

                update ({id, name}) {
                    const todos = this.get('todos')
                    todos.find(it => it.id === id).name = name
                    this.set({ todos })
                },

                commitEdit (payload) {
                    this.dispatch('update', payload)
                },

                revertEdit (payload) {
                    this.dispatch('update', payload)
                },
            }
        }
    }
})()
