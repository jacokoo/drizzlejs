import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import {compile} from 'sleet'
import {generate} from 'escodegen'

const sleet = {
    name: 'sleet',
    resolveId (a, b) {
        if (a === 'drizzle') {
            return '../dist/drizzle.js'
        }
        if (b && b.slice(-11) === 'index.sleet' && a && a.slice(0, 2) === './') {
            return b.slice(0, -11) + a.slice(2) + '.sleet'
        }
    },
    transform (source, id) {
        if (id.slice(-6) !== '.sleet') return
        console.log('compile', id)
        return compile(source).content
    }
}

const key = (ast, key) => ast.key.name === key || ast.key.value === key

const demo = () => {
    return {
        name: 'demo',
        // otions: opt => null
        buildStart() {
            console.log('start')
        },
        buildEnd () {
            console.log('end')
        },
        resolveId(a, b) {
            console.log('resolve', a, b)
        },

        transform (source, id) {
            if (id.slice(-11) !== 'index.sleet') return
            const ast = this.parse(source)
            const obj = ast.body.find(it => it.type === 'ExportDefaultDeclaration')
            if (!obj || obj.declaration.type !== 'ObjectExpression') return source
            const items = obj.declaration.properties.find(it => key(it, 'items'))
            if (!items || items.value.type !== 'ObjectExpression') return source
            const views = items.value.properties.find(it => key(it, 'views'))

            const mods = []
            if (views && views.value.type === 'ArrayExpression') {
                views.value.elements.map(it => it.value).forEach(it => {
                    const name = `_${it.replace(/-/g, '_')}`
                    ast.body.unshift({
                        type: 'ImportDeclaration',
                        specifiers: [{type: 'ImportDefaultSpecifier', local: {type: 'Identifier', name}}],
                        source: {type: 'Literal', value: `./${it}`}
                    })

                    mods.push({name, value: {
                        type: 'Property',
                        key: { type: 'Literal', value: it },
                        value: { type: 'Identifier', name }
                    }})
                })
            }

            if (mods.length) {
                obj.declaration.properties.push({
                    type: 'Property',
                    key: {type: 'Identifier', name: '_loadedItems'},
                    value: {
                        type: 'ObjectExpression',
                        properties: mods.map(it => it.value)
                    }
                })
            }

            return {code: generate(ast)}
        }
    }
}

export default {
    input: 'scripts/app/todos/index.sleet',
    plugins: [
        commonjs({
            include: ['./dist/drizzle.js'],
            namedExports: {
                '../dist/drizzle.js': ['factory']
            }
        }),
        sleet,
        demo(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'main',
        sourcemap: true
    }
}
