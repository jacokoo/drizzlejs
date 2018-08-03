import {factory} from 'drizzle'
import {ModuleTemplate} from 'drizzle'

const {KV, SN, C, TX, REF} = factory
const template = new ModuleTemplate(['todos'])
const o1 = SN('section', null, KV('class', 'todoapp'))
const o2 = SN('header', null, KV('class', 'header'))
const o3 = SN('h1', null)
const o4 = TX('todos')
const o5 = REF('create-todo', null, [], [], [])
const o6 = REF('todo-list', null, [KV('todos')], [], [])
const o7 = REF('todo-footer', null, [KV('todos')], [], [])
let id = 0;

C(o3, o4)
C(o2, o3, o5)
C(o1, o2, o6, o7)
template.nodes = [o1]

export default {
    items: {
        views: [
            'create-todo',
            'todo-list',
            'todo-footer'
        ]
    },
    store: {
        models: {
            todos: {
                data: () => [
                    {
                        name: 'task 1',
                        completed: true,
                        id: id++
                    },
                    {
                        name: ' task 2',
                        id: id++
                    }
                ]
            }
        },
        actions: {
            newTodo(payload) {
                this.set({ todos: this.get('todos').concat([Object.assign(payload, { id: id++ })]) });
            },
            toggleAll(payload) {
                this.set({ todos: this.get('todos').map(it => Object.assign(it, payload)) });
            },
            toggle({id, checked}) {
                const todos = this.get('todos');
                todos.find(it => it.id === id).completed = checked;
                this.set({ todos });
            },
            remove(item) {
                this.set({ todos: this.get('todos').filter(it => it.id !== item.id) });
            },
            update({id, name}) {
                const todos = this.get('todos');
                todos.find(it => it.id === id).name = name;
                this.set({ todos });
            },
            commitEdit(payload) {
                this.dispatch('update', payload);
            },
            revertEdit(payload) {
                this.dispatch('update', payload);
            }
        }
    },
    template
};
