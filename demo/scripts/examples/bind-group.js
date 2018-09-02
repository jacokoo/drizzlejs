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
            | A checked
        label(class='checkbox')
            input(type='checkbox' bind:group=names value='b')
            | B checked
        label(class='checkbox')
            input(type='checkbox' bind:group=names value='c')
            | C checked

    h3 hello $names !

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
