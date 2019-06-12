const {ST, TX, C, TS, SA, REF, DT, EV, DV, SV, IF, H, MP, DA, EAD, EH, HIF, HB, HM, HC, R, HE, E, T, RO} = Drizzle.factory
const {Application, ComponentTemplate, ViewTemplate, RouterPlugin} = Drizzle

const cache = {}

const index = new ComponentTemplate()
H(index, 'h1', HE('todos'))
H(index, 'h2', HE('filter'))
R(index, 'container', 't6')

const t1 = ST('t1', 'div')
SA(t1, 'class', 'todoapp-container', true)

const t2 = ST('t2', 'section')
SA(t2, 'class', 'todoapp', true)

const t3 = ST('t3', 'header')
SA(t3, 'class', 'todo-header', true)

const t4 = ST('t4', 'h1')
const t5 = TX('t5', [0, 'todos'])

const t6 = REF('t6', false, 'create-todo')
const t7 = REF('t7', true, 'todo-list', [], ['todos', 'h1'], ['filter', 'h2'])
const t8 = REF('t8', false, 'todo-footer', [], ['todos', 'h1'], ['filter', 'h2'])

C(t4, t5)
C(t3, t4, t6)
C(t2, t3, t7, t8)
C(t1, t2)

T(index, t1, t2, t3, t4, t5)
RO(index, t1)

let id = 0

cache['app/demo/index'] = {
    template: index,
    items: { views: ['create-todo', 'todo-list', 'todo-footer'] },
    routes: {
        '/:filter': {
            action: 'updateFilter'
        }
    },

    updated () {
        console.log(this.ref('container'))
    },

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

const createTodo = new ViewTemplate()
E(createTodo, 'e1', EV('enter', 'newTodo', true, 'this.value', 'this'))

const v11 = DT('v11', 'input', ['e1'])
SA(v11, 'class', 'new-todo', true)
SA(v11, 'placeholder', 'What needs to be done?', true)

T(createTodo, v11)
RO(createTodo, v11)

cache['app/demo/create-todo'] = {
    template: createTodo,
    actions: {
        newTodo (cb, name, el) {
            el.value = ''
            cb({name})
        }
    }
}

const todoList = new ViewTemplate()
H(todoList, 'h1', HB('todos.length'))
H(todoList, 'h2', HE('allDone'))
H(todoList, 'h3', HB('todo.completed'))
H(todoList, 'h4', HB('todo', SV('=='), 'editing'))
H(todoList, 'h5', HIF('h3', SV('completed')))
H(todoList, 'h6', HIF('h4', SV('editing')))
H(todoList, 'h7', HM(' ', 'h5', 'h6'))
H(todoList, 'h8', HE('todo.name'))
H(todoList, 'h9', HE('filtered'))

E(todoList, 'e1', EV('change', 'toggleAll', true, 'this.checked'))
E(todoList, 'e2', EV('change', 'toggle', true, 'todo.id', 'this.checked'))
E(todoList, 'e3', EV('dblclick', 'edit', false, 'todo'))
E(todoList, 'e4', EV('click', 'remove', true, 'todo.id'))
E(todoList, 'e5', EV('blur', 'commitEdit', true, 'todo', 'this.value'))
E(todoList, 'e6', EV('enter', 'commitEdit', true, 'todo', 'this.value'))
E(todoList, 'e7', EV('escape', 'revertEdit', false, 'this', 'todo'))

R(todoList, 'items', 'v210', 'v26')

const v22 = ST('v22', 'section')
SA(v22, 'class', 'main', true)

const v23 = DT('v23', 'input', ['e1'])
SA(v23, 'class', 'toggle-all', true)
SA(v23, 'type', 'checkbox', true)
SA(v23, 'id', 'toggle-all', true)
DA(v23, 'checked', 'h2', false)

const v24 = ST('v24', 'label')
SA(v24, 'for', 'toggle-all', true)

const v25 = ST('v25', 'ul')
SA(v25, 'class', 'todo-list', true)

const v27 = DT('v27', 'li')
DA(v27, 'class', 'h7', true)

const v28 = ST('v28', 'div')
SA(v28, 'class', 'view', true)

const v29 = DT('v29', 'input', ['e2'])
SA(v29, 'class', 'toggle', true)
SA(v29, 'type', 'checkbox', true)
DA(v29, 'checked', 'h3', false)

const v210 = DT('v210', 'label', ['e3'])
const v211 = TX('v211', [1, 'h8'])
const v212 = DT('v212', 'button', ['e4'])
SA(v212, 'class', 'destroy', true)
const v213 = DT('v213', 'input', ['e5', 'e6', 'e7'])
SA(v213, 'class', 'edit', true)
DA(v213, 'value', 'h8', false)

const v26 = EH('v26', false, EAD('h9', 'todo'), TS(v27))
C(v210, v211)
C(v28, v29, v210, v212)
C(v27, v28, v213)
C(v25, v26)
C(v22, v23, v24, v25)

const v21 = IF('v21', false, 'h1', TS(v22))
T(todoList, v21, v22, v23, v24, v25, v26, v27, v28, v29, v210, v211, v212, v213)
RO(todoList, v21)

cache['app/demo/todo-list'] = {
    template: todoList,
    computed: {
        allDone ({todos}) {
            return !todos.some(it => !it.completed)
        },
        filtered ({todos, filter}) {
            if (filter === 'completed') return todos.filter(it => it.completed)
            if (filter === 'active') return todos.filter(it => !it.completed)
            return todos
        }
    },

    updated () {
        console.log(this.ref('items'))
    },

    customEvents: {
        escape: {
            on (state, node, cb) {
                const ee = function (e) {
                    if (e.keyCode !== 27) return
                    e.preventDefault()
                    cb.call(this, e)
                }
                state.set('escape', ee)
                node.addEventListener('keydown', ee, false)
            },

            off (state, node, cb) {
                const ee = state.get(`escape`)
                if (!ee) return
                node.removeEventListener('keydown', ee, false)
                state.clear('escape')
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
        },
        toggleAll (cb, completed) {
            cb({completed})
        },
        toggle (cb, id, checked) {
            cb({id, checked})
        },
        remove (cb, id) {
            cb({id})
        }
    }
}
const todoFooter = new ViewTemplate()
H(todoFooter, 'h1', HB('todos.length'))
H(todoFooter, 'h2', HE('remaining'))
H(todoFooter, 'h3', HB('remaining', SV('=='), SV(1)))
H(todoFooter, 'h4', HIF('h3', SV(' item left'), SV(' items left')))
H(todoFooter, 'h5', HB('filter', SV('=='), SV('all')))
H(todoFooter, 'h6', HB('filter', SV('=='), SV('active')))
H(todoFooter, 'h7', HB('filter', SV('=='), SV('completed')))
H(todoFooter, 'h8', HIF('h5', SV('selected')))
H(todoFooter, 'h9', HIF('h6', SV('selected')))
H(todoFooter, 'h10', HIF('h7', SV('selected')))
H(todoFooter, 'h11', HC('@router', SV('all')))
H(todoFooter, 'h12', HC('@router', SV('active')))
H(todoFooter, 'h13', HC('@router', SV('completed')))
H(todoFooter, 'h14', HB('haveCompleted'))
E(todoFooter, 'e1', EV('click', 'clearCompleted', true))

const v32 = ST('v32', 'footer')
SA(v32, 'class', 'footer', true)

const v33 = ST('v33', 'span')
SA(v33, 'class', 'todo-count', true)
const v34 = ST('v34', 'strong')
const v35 = TX('v35', [1, 'h2'], [0, ' '], [1, 'h4'])

const v36 = ST('v36', 'ul')
SA(v36, 'class', 'filters', true)

const v37 = ST('v37', 'li')
const v38 = ST('v38', 'li')
const v39 = ST('v39', 'li')

const v310 = DT('v310', 'a')
DA(v310, 'class', 'h8', true)
DA(v310, 'href', 'h11', true)
C(v37, v310)
const v313 = TX('v313', [0, 'All'])
C(v310, v313)

const v311 = DT('v311', 'a')
DA(v311, 'class', 'h9', true)
DA(v311, 'href', 'h12', true)
C(v38, v311)
const v314 = TX('v314', [0, 'Active'])
C(v311, v314)

const v312 = DT('v312', 'a')
DA(v312, 'class', 'h10', true)
DA(v312, 'href', 'h13', true)
C(v39, v312)
const v315 = TX('v315', [0, 'Completed'])
C(v312, v315)

const v316 = DT('v316', 'button', ['e1'])
SA(v316, 'class', 'clear-completed', true)
const v317 = TX('v317', [0, 'Clear completed'])
C(v316, v317)

const v318 = IF('v318', false, 'h14', TS(v316))

C(v36, v37, v38, v39)
C(v34, v35)
C(v33, v34)
C(v32, v33, v36, v318)

const v31 = IF('v31', false, 'h1', TS(v32))

T(todoFooter, v31, v32, v33, v34, v35, v36, v37, v38, v39, v310, v311, v312, v313, v314, v315, v316, v317, v318)
RO(todoFooter, v31)

cache['app/demo/todo-footer'] = {
    template: todoFooter,
    computed: {
        remaining ({todos}) {
            return todos.filter(it => !it.completed).length
        },

        haveCompleted ({todos}) {
            return todos.some(it => !!it.completed)
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

app.use(RouterPlugin)
app.start()
