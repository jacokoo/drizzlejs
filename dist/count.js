const fs = require('fs')

const content = fs.readFileSync('./drizzle.js', 'utf-8')
const obj = content.split(/\b/).reduce((acc, item) => {
    if (!item.match(/\w+/)) return acc
    if (!acc[item]) acc[item] = 0
    acc[item] ++
    return acc
}, {})

Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach(it => console.log(it, obj[it]))
