(() => {
    const {
        SN, DN, TN, TX, RG, REF, E, NDA, NSA, SV, DV, AT, KV, H, HH, HIF, HUN,
        EACH, IF, IFC, UN, C, DA, A, B
    } = drizzle.factory
    const {ViewTemplate} = drizzle

    const template = new ViewTemplate()
    const d1 = SN('footer', null, KV('class', 'footer'))
    const d2 = SN('span', null, KV('class', 'todo-count'))
    const d3 = SN('strong')
    const d4 = TN(H('remaining'), HIF(DV('remaining'), SV('eq'), SV(1), SV('item left'), SV('items left')))

    const d5 = SN('ul', null, KV('class', 'filters'))
    const d6 = SN('li')
    const d7 = DN('a', null, [KV('href', '#/')], [DA('class', HIF(DV('status'), SV('eq'), SV(''), SV('selected')))])

    const d8 = SN('li')
    const d9 = DN('a', null, [KV('href', '#/active')], [DA('class', HIF(DV('status'), SV('eq'), SV('active'), SV('selected')))])

    const d10 = SN('li')
    const d11 = DN('a', null, [KV('href', '#/complated')], [DA('class', HIF(DV('status'), SV('eq'), SV('complated'), SV('selected')))])

    const d12 = DN('button', null, [KV('class', 'clear-completed')], [], [], [], [
        A('click', 'clearCompleted')
    ])
    const b2 = IF('haveCompleted', d12)

    C(d1, d2, d5, b2)
    C(d2, d3, d4)
    C(d5, d6, d8, d10)
    C(d6, d7)
    C(d7, TX('All'))
    C(d8, d9)
    C(d9, TX('Active'))
    C(d10, d11)
    C(d11, TX('Completed'))
    C(d12, TX('Clear completed'))

    const b1 = IF('todos.length', d1)
    template.nodes = [b1]

    MODULES['app/hello/todo-footer'] = {
        template,

        computed: {
            remaining ({todos}) {
                return todos.filter(it => !it.completed).length
            },

            haveCompleted ({todos}) {
                return todos.some(it => !!it.completed)
            }
        }
    }
})()
