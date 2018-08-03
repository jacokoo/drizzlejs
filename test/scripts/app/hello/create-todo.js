(() => {
    const {
        SN, DN, TN, TX, RG, REF, E, NDA, NSA, SV, DV, AT, KV, H, HH,
        EACH, IF, IFC, UN, C, DA, A, B
    } = drizzle.factory
    const {ViewTemplate} = drizzle

    const template = new ViewTemplate()

    const d1 = DN(
        'input', 'create', [KV('class', 'new-todo'), KV('placeholder', 'What needs to be done?')],
        [], [], [],
        [E('enter', 'newTodo', AT('name', DV('this.value')))]
    )
    template.nodes = [d1]

    MODULES['app/hello/create-todo'] = {
        template: template,

        actions: {
            newTodo (cb, payload) {
                if (!payload.name) return
                this.ids.create.value = ''
                cb(payload)
            }
        }
    }
})()

