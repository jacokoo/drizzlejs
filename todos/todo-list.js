import {factory} from 'drizzle'
import {ViewTemplate} from 'drizzle'

const {KV, SN, C, A, AT, SV, NSA, DV, NDA, DN, HH, E, H, TN, EACH, IFC} = factory
const template = new ViewTemplate()
const o2 = SN('section', null, KV('class', 'main'))
const o3 = DN('input', null, [KV('type', 'checkbox'), KV('id', 'toggle-all'), KV('class', 'toggle-all')], [DA('checked', H('allDone'))], [], [], [A('change', 'toggleAll', AT('completed', DV('this.checked')))])
const o4 = SN('label', null, KV('for', 'toggle-all'))
const o5 = SN('ul', null, KV('class', 'todo-list'))
const o7 = () => {
    const o8 = DN('li', null, [], [DA('class', HH('if', DV('todo.completed'), SV('completed')), HH('if', DV('todo'), DV('eq'), DV('editing'), SV('editing')))], [], [], [])
    const o9 = SN('div', null, KV('class', 'view'))
    const o10 = DN('input', null, [KV('type', 'checkbox'), KV('class', 'toggle')], [DA('checked', H('todo.completed'))], [], [], [A('change', 'toggle', AT('id', DV('todo.id')), AT('changed', DV('this.changed')))])
    const o11 = DN('label', null, [], [], [], [E('dblclick', 'edit', NDA('todo'))], [])
    const o12 = TN(H(DV('todo.name')))
    const o13 = DN('button', null, [KV('class', 'destroy')], [], [], [], [A('click', 'remove', AT('id', DV('todo.id')))])
    const o14 = DN('input', null, [KV('class', 'edit')], [DA('value', H('todo.name'))], [], [], [A('blur', 'commitEdit', NDA('todo')), A('endter', 'commitEdit', NDA('todo')), A('escape', 'revertEdit', NDA('todo'), NDA('nameCache'))])

    C(o11, o12)
    C(o9, o10, o11, o13)
    C(o8, o9, o14)
    return o8

}
const o6 = EACH(['todos', 'as', 'todo'], o7)
const o1 = IFC([DV('todos.length')], o2)

C(o5, o6)
C(o2, o3, o4, o5)
template.nodes = [o1]

export default {
    computed: {
        allDone({todos}) {
            return !todos.some(it => !it.completed);
        }
    },
    events: {
        edit(todo) {
            this.set({
                nameCache: todo.name,
                editing: todo
            });
        }
    },
    actions: {
        revertEdit(cb, todo, cached) {
            console.log(todo, cached);
            this.set({
                editing: false,
                nameCache: false
            });
            cb({
                id: todo.id,
                name: cached
            });
        },
        commitEdit(cb, todo) {
            this.set({
                nameCache: false,
                editing: false
            });
            cb({
                id: todo.id,
                name: todo.name
            });
        }
    },
    template
};
