const template = new drizzle.ModuleTemplate()
template.views('abc')
const a = new drizzle.DynamicNode('input')
a.on('change', 'demo', [[null, [1, 'hello']]])

const b = new drizzle.ReferenceNode('abc')
b.bind('hello')

template.nodes = [
    new drizzle.StaticNode('input', [['type', 'text'], ['value', 'abc']]),
    a, b
]

MODULES['app/hello/index'] = {
    template: template,
    events: {
        demo: function() {
            console.log('args', arguments)
        }
    },

    store: {
        models: {
            hello: {
                data: function() { return 'world' }
            }
        }
    }
}
