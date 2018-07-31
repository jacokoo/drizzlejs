const tpl = new drizzle.ViewTemplate()

tpl.nodes = [
    new drizzle.StaticNode('p')
]

MODULES['app/hello/abc'] = {
    template: tpl
}
