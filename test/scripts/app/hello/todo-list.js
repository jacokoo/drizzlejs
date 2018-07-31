(() => {
    const {
        SN, DN, TN, TX, RG, REF, E, NDA, NSA, SV, DV, AT, KV, H, TR, HIF, HEQ, HGT, HLT, HGTE, HLTE, HNE,
        EACH, IF, EQ, GT, LT, GTE, LTE, NE, C, DA, A, B
    } = drizzle.factory
    const {ViewTemplate} = drizzle

    const template = new ViewTemplate()

    const d1 = SN('section', [KV('class', 'main')])
    const d2 = DN(
        'input', null, [KV('class', 'toggle-all'), KV('type', 'checkbox'), KV('id', 'toggle-all')],
        [DA('checked', H('allDone'))], [], [],
        [A('change', 'toggleAll', AT('completed', DV('this.checked')))]
    )
    const d3 = SN('label', null, KV('for', 'toggle-all'))
    const d4 = SN('ul', null, KV('class', 'todo-list'))

    const d5 = () => {
        const d6 = DN(
            'li', [], null,
            [DA('class', HIF('todo.completed', SV('completed')))]
        )
        const d7 = SN('div', KV('class', 'view'))
        const d8 = DN(
            'input', null, [KV('type', 'checkbox'), KV('class', 'toggle')], null,
            [], [B('checked', 'todo.completed')]
        )
        const d9 = DN('label')
        const d10 = TN(H('todo.name'))
        const d11 = DN('button', [KV('class', 'destroy')])

        C(d9, d10)
        C(d7, d8, d9, d11)
        C(d6, d7)
        return d6
    }

    const d12 = DN(
        'input', [KV('class', 'edit')], null
    )

    const b0 = IF('todos.length', d1)
    const b1 = EACH(['todos', 'as', 'todo'], d5)

    C(d1, d2, d3, d4)
    C(d4, b1)
    template.nodes = [b0]

    MODULES['app/hello/todo-list'] = {
        template,

        computed: {
            allDone ({todos}) {
                console.log(!todos.some(it => !it.computed))
                return !todos.some(it => !it.computed)
            }
        }
    }
})()
