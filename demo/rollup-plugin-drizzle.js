import path from 'path'
import fs from 'fs'
import {compile} from 'sleet'
import {generate} from 'escodegen'
import walk from 'acorn/dist/walk'
import {plugin as drizzle} from 'sleet-drizzle'

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

const findApplicationOptions = (ast, imports) => {
    let obj
    walk.simple(ast, {
        NewExpression (node) {
            const {callee} = node
            if (callee.type === 'Identifier' && imports.app.includes(callee.name)) {
                obj = node.arguments[0]
                return
            }

            if (callee.type === 'MemberExpression'
                && imports.drizzle.includes(callee.object.name)
                && callee.property.name === 'Application') {

                obj = node.arguments[0]
            }
        }
    })

    if (obj.type === 'ObjectExpression') return obj
}

export default function(options) {
    const { scriptRoot } = options
    let basedir, input

    const transformInput = (ast) => {
        const opt = findApplicationOptions(ast, findImport(ast))
        if (!opt) return {code: generate(ast)}

        let entry = opt.properties.find(it => key(it, 'entry'))
        if (!entry) {
            entry = property(identifier('entry'), literal('viewport'))
            opt.properties.push(entry)
        }

        const name = entry.value.value
        entry.value = identifier(`_${name}`)
        ast.body.unshift((importDefault(`_${name}`, name)))
        return {code: generate(ast)}
    }

    // transfrom items to import
    const transformIndex = (ast) => {
        const obj = ast.body.find(it => it.type === 'ExportDefaultDeclaration')
        if (!obj || obj.declaration.type !== 'ObjectExpression') return generate(ast)
        const items = obj.declaration.properties.find(it => key(it, 'items'))
        if (!items || items.value.type !== 'ObjectExpression') return generate(ast)

        const mods = []
        const views = items.value.properties.find(it => key(it, 'views'))
        if (views && views.value.type === 'ArrayExpression') {
            views.value.elements.map(it => it.value).forEach(it => {
                const name = `_${it.replace(/-/g, '_')}`
                ast.body.unshift(importDefault(name, `./${it}`))
                mods.push(property(literal(it), identifier(name)))
            })
        }

        const modules = items.value.properties.find(it => key(it, 'modules'))
        if (modules && modules.value.type === 'ObjectExpression') {
            modules.value.properties.forEach(it => {
                const name = it.key.name || it.key.value
                const key = `_${name.replace(/-/g, '_')}`
                const source = it.value.value
                ast.body.unshift(importDefault(key, source))
                mods.push(property(literal(source), identifier(key)))
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

        options (opt) {
            input = opt.entry
        },

        resolveId (importee, importer) {
            if (!importer && importee === input) {
                const resolved = path.resolve('.', importee)
                input = resolved
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
            if (id === input) {
                return transformInput(this.parse(source))
            }

            if (path.extname(id) === '.sleet') {
                const content = compile(source, {
                    defaultPlugin: 'drizzle',
                    plugins: {drizzle},
                    sourceFile: id
                }).code

                if (path.basename(id) !== 'index.sleet') return content
                return transformIndex(this.parse(content))
            }
        }
    }
}
