const index = `#! drizzle

module(number) > view-a(number)

script..
export default {
    items: { views: ['view-a'] },
    store: {
        models: {
            number: () => 200
        }
    }
}
`

const view = `#! drizzle

view
    div
        h3 Simple
        p@if(number > 10) greater then 10
    div
        h3 With else
        p@if(number < 10) less then 10
        p@else not less then 10
    div
        h3 With elseif
        p@if(number < 10) less then 10
        p@elseif(number < 20) less then 20
        p@elseif(number < 40) less then 40
        p@elseif(number < 80) less then 80
        p@elseif(number < 160) less then 160
        p@elseif(number <= 320) less then 320
        p@else greater then 320

script..
export default {
}
`

const json = `{
    "number": 200
}`
export default {
    code: 'if-block',
    name: 'If Block',
    files: {index, 'view-a': view},
    json,
}
