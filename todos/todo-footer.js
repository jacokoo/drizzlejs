import {factory} from 'drizzle'
import {ViewTemplate} from 'drizzle'

const {KV, SN, C, H, HH, DV, SV, TN, DN, TX, A, AT, NSA, NDA, IFC} = factory
const template = new ViewTemplate()
const o1 = SN('footer', null, KV('class', 'footer'))
const o2 = SN('span', null, KV('class', 'todo-count'))
const o3 = SN('strong', null)
const o4 = TN(H(DV('remaining')))
const o5 = TN(HH('if', DV('remaining'), DV('eq'), SV(1), SV('item left'), SV('items left')))
const o6 = SN('ul', null, KV('class', 'filters'))
const o7 = SN('li', null)
const o8 = DN('a', null, [KV('href', '#/')], [DA('class', HH('if', DV('status'), DV('eq'), SV(''), SV('selected')))], [], [], [])
const o9 = TX('All')
const o10 = SN('li', null)
const o11 = DN('a', null, [KV('href', '#/active')], [DA('class', HH('if', DV('status'), DV('eq'), SV('active'), SV('selected')))], [], [], [])
const o12 = TX('Active')
const o13 = SN('li', null)
const o14 = DN('a', null, [KV('href', '#/completed')], [DA('class', HH('if', DV('status'), DV('eq'), SV('completed'), SV('selected')))], [], [], [])
const o15 = TX('Completed')
const o17 = DN('button', null, [KV('class', 'clear-completed')], [], [], [], [A('click', 'clearCompleted')])
const o16 = IFC([DV('haveCompleted')], o17)

C(o3, o4)
C(o2, o3, o5)
C(o8, o9)
C(o7, o8)
C(o11, o12)
C(o10, o11)
C(o14, o15)
C(o13, o14)
C(o6, o7, o10, o13)
C(o1, o2, o6, o16)
template.nodes = [o1]

export default {
    computed: {
        remaining({todos}) {
            return todos.filter(it => !it.completed).length;
        },
        haveCompleted({todos}) {
            return todos.some(it => !!it.completed);
        }
    },
    template
};
