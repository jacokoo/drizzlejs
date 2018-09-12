const index = `#! drizzle

module(names) > view-a(names)

script..
export default {
    items: { views: ['view-a'] },
    store: {
        models: {
            names: () => []
        }
    }
}
`

const view = `#! drizzle

view
    .control
        label(class='checkbox')
            input(type='checkbox' bind:group=names value='a')
            |  a
    .control
        label(class='checkbox')
            input(type='checkbox' bind:group=names value='b')
            |  b
    .control
        label(class='checkbox')
            input(type='checkbox' bind:group=names value='c')
            |  c

    p@each(names as name) $name checked

script..
export default {
}
`

const json = `{
    "names": ["a", "b", "c"]
}`

export default {
    code: 'bind-group',
    name: 'Group binding',
    files: {index, 'view-a': view},
    json,
}
