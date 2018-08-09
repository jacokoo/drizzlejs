import path from 'path'
import fs from 'fs'
import {compile} from 'sleet'
import {generate} from 'escodegen'
import walk from 'acorn/dist/walk'

/*
 * three types of modules could be included
 * 1. modules in current project --- use default loader
 * 2. modules imported from npm --- use npm loader
 *      ps. modules from npm should be layouted as modules in current project  ????
 *          so the sub resouces cound be imported by default loader
 *          otherwise it could not be imported
 * 3. modules from url --- use url loader
 *
 * when use rollup, the default loader will be replaced to rollup-loader
 * and the 1st and 2nd type of modules are packed to single file
 * so that they can be loaded as local modules
 */

const key = (ast, key) => ast.key.name === key || ast.key.value === key

const importDefault = (name, source) => {
    return {
        type: 'ImportDeclaration',
        specifiers: [{type: 'ImportDefaultSpecifier', local: {type: 'Identifier', name}}],
        source: {type: 'Literal', value: source}
    }
}

const literal = (value) => { return { type: 'Literal', value} }
const identifier = (name) => { return { type: 'Identifier', name} }
const property = (key, value) => { return { type: 'Property', key, value } }

const findImport = (ast) => {
    const result = {drizzle: [], app: []}
    walk.simple(ast, { ImportDeclaration (node) {
        if (!node.source.value === 'drizzlejs' || !node.specifiers.length) return
        walk.simple(node, {
            ImportSpecifier (node) {
                if (node.imported.name === 'Application') result.app.push(node.local.name)
            },

            ImportDefaultSpecifier (node) {
                result.drizzle.push(node.local.name)
            },

            ImportNamespaceSpecifier (node) {
                result.drizzle.push(node.local.name)
            }
        })
    }})
    return result
}

export default function(options) {
    const { scriptRoot } = options
    let basedir, entry

    const analyseEntry = (ast) => {
        console.log(findImport(ast))
    }

    // transfrom items to import
    const transformIndex = (ast) => {
        const obj = ast.body.find(it => it.type === 'ExportDefaultDeclaration')
        if (!obj || obj.declaration.type !== 'ObjectExpression') return source
        const items = obj.declaration.properties.find(it => key(it, 'items'))
        if (!items || items.value.type !== 'ObjectExpression') return source
        const views = items.value.properties.find(it => key(it, 'views'))

        const mods = []
        if (views && views.value.type === 'ArrayExpression') {
            views.value.elements.map(it => it.value).forEach(it => {
                const name = `_${it.replace(/-/g, '_')}`
                ast.body.unshift(importDefault(name, `./${it}`))
                mods.push(property(literal(it), identifier(name)))
            })
        }

        if (mods.length) {
            obj.declaration.properties.push(property(identifier('_loadedItems'), {
                type: 'ObjectExpression', properties: mods
            }))
        }

        return {code: generate(ast)}
    }

    return {
        name: 'drizzlejs',

        options (input) {
            entry = input.entry
        },

        resolveId (importee, importer) {
            if (!importer && importee === entry) {
                const resolved = path.resolve('.', importee)
                entry = resolved
                basedir = path.dirname(resolved)
                return resolved
            }

            if (!importee.includes('.') && fs.existsSync(path.resolve(basedir, scriptRoot, importee, 'index.sleet'))) {
                return path.resolve(basedir, scriptRoot, importee, 'index.sleet')
            }

            if (importer && path.basename(importer) === 'index.sleet' && importee.indexOf('./') === 0) {
                return path.resolve(path.dirname(importer), importee + '.sleet')
            }
        },

        transform (source, id) {
            if (id === entry) {
                analyseEntry(this.parse(source))
                return
            }

            if (path.extname(id) === '.sleet') {
                const content = compile(source).content

                if (path.basename(id) !== 'index.sleet') return content
                return transformIndex(this.parse(content))
            }
        }
    }
}
