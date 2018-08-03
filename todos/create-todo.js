import {factory} from 'drizzle'
import {ViewTemplate} from 'drizzle'

const {KV, A, AT, SV, NSA, DV, NDA, DN, C} = factory
const template = new ViewTemplate()
const o1 = DN('input', 'create', [KV('placeholder', 'What needs to be done?'), KV('class', 'new-todo')], [], [], [], [A('enter', 'newTodo', AT('name', DV('this.value')))])

template.nodes = [o1]

export default {
    actions: {
        newTodo(cb, payload) {
            if (!payload.name)
                return;
            this.ids.create.value = '';
            cb(payload);
        }
    },
    template
};
