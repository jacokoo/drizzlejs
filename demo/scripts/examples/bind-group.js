const index = `#! drizzle

module(names color) > .columns
    .column > view-a(names)
    .column > view-b(color)

script..
export default {
    items: { views: ['view-a', 'view-b'] },
    store: {
        models: {
            names: () => [],
            color: () => 'red'
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

const viewB = `#! drizzle

view
    .control
        label(class='radio')
            input(type='radio' bind:group=color value='red')
            |  Red
    .control
        label(class='radio')
            input(type='radio' bind:group=color value='green')
            |  Green
    .control
        label(class='radio')
            input(type='radio' bind:group=color value='blue')
            |  Blue

    span(style='color:' + color + ';') Selected color: $color

script..
export default {
}
`

const json = `{
    "names": ["a", "b", "c"],
    "color": "red"
}`

export default {
    code: 'bind-group',
    name: 'Group binding',
    files: {index, 'view-a': view, 'view-b': viewB},
    json,
}
