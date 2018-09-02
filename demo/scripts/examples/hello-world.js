const index = `#! drizzle

module(name) > view-a(name)

script..
export default {
    items: { views: ['view-a'] },
    store: {
        models: {
            name: () => ''
        }
    }
}
`

const view = `#! drizzle

view
    input.input(bind:value=name)
    h3 hello $name !

script..
export default {
}
`

const json = `{
    "name": "world"
}`

export default {
    code: 'hello-world',
    name: 'Hello World',
    files: {index, 'view-a': view},
    json,
}
