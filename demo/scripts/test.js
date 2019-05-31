const {SN, TX, C, TS, SA, REF, DN, EVD, DV, IF, H, MP, DA} = Drizzle.factory
const {Application, ComponentTemplate, ViewTemplate} = Drizzle

const cache = {}

const t1 = SN('t1', 'div')
SA(t1, 'class', 'todoapp-container', true)

const t2 = SN('t2', 'section')
SA(t2, 'class', 'todoapp', true)

const t3 = SN('t3', 'header')
SA(t3, 'class', 'todo-header', true)

const t4 = SN('t4', 'h1')
const t5 = TX('t5', [0, 'todos'])

const t6 = REF('t6', false, 'create-todo')
const t7 = REF('t7', false, 'todo-list')
MP(t7, 'todos', 'h1')
MP(t7, 'filter', 'h2')

C(t4, t5)
C(t3, t4, t6)
C(t2, t3, t7)
C(t1, t2)
const index = new ComponentTemplate(TS(t1))
H(index, 'h1', DV('todos'))
H(index, 'h2', DV('filter'))

index.tag(t1, t2, t3, t4, t5)

let id = 0

cache['app/demo/index'] = {
    template: index,
    items: { views: ['create-todo', 'todo-list'] },
    store: {
        models: {
            todos: {
                data: () => []
            },
            filter: {
                data: () => 'all'
            }
        },

        actions: {
            init () {
                this.set({todos: [{name: 'task 1', completed: true, id: id++}, {name: 'task 2', id: id++}]})
            },
            newTodo (payload) {
                console.log(payload)
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

            clearCompleted (payload) {
                this.set({todos: this.get('todos').filter(it => !it.completed)})
            },

            updateFilter (payload) {
                if (payload.filter !== 'completed' && payload.filter !== 'active') payload.filter = 'all'
                this.set(payload)
            }
        }
    }
}

const v11 = DN('v11', 'input', ['e1'])
SA(v11, 'class', 'new-todo', true)
SA(v11, 'placeholder', 'What needs to be done?', true)
const createTodo = new ViewTemplate(TS(v11))
createTodo.tag(v11)
EVD(createTodo, 'e1', 'enter', 'newTodo', true, DV('this.value'))

cache['app/demo/create-todo'] = {
    template: createTodo,
    actions: {
        newTodo (cb, name) {
            cb({name})
        }
    }
}


const v22 = SN('v22', 'section')
SA(v22, 'class', 'main', true)

const v23 = DN('v23', 'input')
SA(v23, 'class', 'toggle-all', true)
SA(v23, 'type', 'checkbox', true)
SA(v23, 'id', 'toggle-all', true)
DA(v23, 'checked', 'h2', false)

const v24 = SN('v24', 'label')
SA(v24, 'for', 'toggle-all', true)

C(v22, v23, v24)

const v21 = IF('v21', false, 'h1', TS(v22))
const todoList = new ViewTemplate(TS(v21))
todoList.tag(v21, v22, v23, v24)
H(todoList, 'h1', DV('todos.length'))
H(todoList, 'h2', DV('allDone'))

cache['app/demo/todo-list'] = {
    template: todoList,
    computed: {
        allDone ({todos}) {
            console.log(!todos.some(it => !it.completed))
            return !todos.some(it => !it.completed)
        },
        filtered ({todos, filter}) {
            if (filter === 'completed') return todos.filter(it => it.completed)
            if (filter === 'active') return todos.filter(it => !it.completed)
            return todos
        }
    },

    customEvents: {
        escape (node, cb) {
            const ee = function (e) {
                if (e.keyCode !== 27) return
                e.preventDefault()
                cb.call(this, e)
            }
            node.addEventListener('keydown', ee, false)
            return {
                dispose () {
                    node.removeEventListener('keydown', ee, false)
                }
            }
        }
    },

    events: {
        edit (todo) {
            this.set({editing: todo})
        },
        revertEdit (el, todo) {
            el.value = todo.name
            this.set({editing: false})
        }
    },

    actions: {
        commitEdit (cb, todo, name) {
            this.set({editing: false})
            if (todo.name === name) return
            cb({id: todo.id, name})
        }
    }
}

const app = new Application({
    container: document.body,
    entry: 'demo',
    getResource (file, comp) {
        console.log(file, comp)
        return Promise.resolve(cache[file])
    }
})

app.start()
