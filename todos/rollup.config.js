import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import {compile} from 'sleet'
import {generate} from 'escodegen'
import walk from 'acorn/dist/walk'
import path from 'path'
import fs from 'fs'

const sleet = {
    name: 'sleet',
    resolveId (a, b) {
        if (a.indexOf('.') === -1 && fs.existsSync(path.resolve('scripts/app', a, 'index.sleet'))) {
            return path.resolve('scripts/app', a, 'index.sleet')
        }
        if (a === 'drizzlejs') {
            return path.resolve('../dist/drizzle.js')
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

const mainjs = function (source) {
    const ast = this.parse(source)
    walk.simple(ast, {
        ImportDeclaration (node) {
            if (!node.source.value === 'drizzlejs') return
            console.log('import', JSON.stringify(node))

        },
        NewExpression (node) {
            console.log(JSON.stringify(node))
        }
    })
}

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
            if (id.slice(-7) === 'main.js') {
                mainjs.call(this, source)
            }
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
    input: 'scripts/main.js',
    plugins: [
        commonjs({
            include: ['../dist/drizzle.js'],
            namedExports: {
                '../dist/drizzle.js': ['factory', 'ModuleTemplate', 'ViewTemplate', 'Application']
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
