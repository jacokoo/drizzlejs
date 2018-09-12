import { Module } from './module'
import { Lifecycle } from './lifecycle'
import { View } from './view'

interface DefaultHandler {
    enter (args: object): Promise<Router>
    update? (args: object): Promise<any>
    leave? (): Promise<any>
}

interface ActionHandler {
    action: string
}

interface ModuleHandler {
    ref: string
    region?: string
    model?: string
}

type Handler = DefaultHandler | ActionHandler | ModuleHandler | string

export interface RouteOptions {
    [route: string]: Handler
}

interface MatchResult {
    remain: string[]
    consumed: string
    args?: object
}

// /name
class Token {
    protected key: string
    protected next: Token
    protected v = 9

    constructor(key: string, next: Token) {
        this.key = key
        this.next = next
    }

    match (keys: string[]): MatchResult | false {
        const c = keys[0]
        if (!c) return false
        return this.doMatch(c, keys.slice(1))
    }

    value (v: number = 0): number {
        const vv = v + this.v
        return this.next ? this.next.value(vv * 10) : vv
    }

    protected doMatch (key: string, keys: string[]): MatchResult | false {
        if (key !== this.key) return false
        if (this.next) {
            const o = this.next.match(keys)
            if (!o) return false
            o.consumed = `${key}/${o.consumed}`
            return o
        }
        return {remain: keys, consumed: key}
    }
}

// /:name
class ArgToken extends Token {
    v = 8
    doMatch (key: string, keys: string[]): MatchResult | false {
        const oo = {[this.key]: key}
        if (!this.next) return {remain: keys, args: oo, consumed: key}

        const o = this.next.match(keys)
        if (o === false) return false

        o.args ? Object.assign(o.args, oo) : (o.args = oo)
        o.consumed = `${key}/${o.consumed}`
        return o
    }
}

// /*name
class AllToken extends Token {
    v = 7
    match (keys: string[]): MatchResult | false {
        if (!keys.length) return false
        return { args: {[this.key]: keys}, remain: [], consumed: keys.join('/')}
    }
}

const create = (path) => {
    const ts = path.trim().split('/').filter(it => !!it)
    return ts.reduceRight((acc, item) => {
        if (item.charAt(0) === '*') return new AllToken(item.slice(1), acc)
        if (item.charAt(0) === ':') return new ArgToken(item.slice(1), acc)
        return new Token(item, acc)
    }, null)
}

interface RouterContainer {
    _router?: Router
}

export class Router {
    static get (item: Module): Router {
        return (item as RouterContainer)._router
    }

    _prefix: string

    private _module: Module
    private _keys: Token[] = []
    private _defs: DefaultHandler[] = []
    private _currentKey: number = -1
    private _next: Router

    constructor (module: Module, routes: RouteOptions) {
        this._module = module
        this.initRoutes(routes)
    }

    route (prefix: string, keys: string[]) {
        this._prefix = prefix
        for (let i = 0; i < this._keys.length; i ++) {
            const re = this._keys[i].match(keys)
            if (re) return this.doRoute(i, re)
        }
        return Promise.resolve(false)
    }

    private leave (): Promise<any> {
        return Promise.resolve().then(() => {
            if (this._next) return this._next.leave()
        }).then(() => {
            const h = this._defs[this._currentKey]
            if (h && h.leave) return h.leave()
        })
    }

    private enter (idx: number, result: MatchResult) {
        this._currentKey = idx
        return this._defs[idx].enter(result.args).then(it => {
            this._next = it
            if (it) return it.route(`${this._prefix}${result.consumed}/`, result.remain)
        })
    }

    private doRoute (idx: number, result: MatchResult): Promise<any> {
        const h = this._defs[idx]
        if (this._currentKey === -1) {
            return this.enter(idx, result)
        }
        if (idx === this._currentKey) {
            return Promise.resolve().then(() => {
                if (h.update) return h.update(result.args)
            }).then(() => {
                if (this._next) return this._next.route(`${this._prefix}${result.consumed}/`, result.remain)
            })
        }

        return this.leave().then(() => {
            return this.enter(idx, result)
        })
    }

    private initRoutes (routes: RouteOptions) {
        Object.keys(routes).map(key => {
            return { key, token: create(key) }
        }).sort((a, b) => b.token.value() - a.token.value()).forEach(it => {
            this._keys.push(it.token)
            this._defs.push(this.createHandler(routes[it.key]))
        })
    }

    private createHandler (h: Handler): DefaultHandler {
        if (typeof h === 'string') return this.createModuleHandler({ref: h})
        if ('enter' in h) return h as DefaultHandler
        if ('action' in h) return this.createActionHandler(h as ActionHandler)
        if ('ref' in h) return this.createModuleHandler(h as ModuleHandler)
        throw new Error('unsupported router handler')
    }

    private createActionHandler (h: ActionHandler) {
        return {
            enter: (args: object) => {
                return this._module._dispatch(h.action, args).then(() => null)
            },
            update: (args: object) => {
                return this._module._dispatch(h.action, args)
            }
        }
    }

    private createModuleHandler (h: ModuleHandler) {
        let item
        return {
            enter: (args: object) => {
                const o = h.model ? {[h.model]: args} : args
                return this._module.regions[h.region || 'default'].show(h.ref, o).then(it => {
                    item = it
                    if (it instanceof Module) return Router.get(it)
                    return null
                })
            },

            update: (args: object) => {
                if (!args) return Promise.resolve()
                const o = h.model ? {[h.model]: args} : args
                if (item && (item instanceof Module)) return item.set(o)
                return Promise.resolve()
            }
        }
    }
}

export const RouterModuleLifecycle: Lifecycle = {
    stage: 'init',
    init (this: Module) {
        const {routes} = this._options
        if (!routes) return
        (this as RouterContainer)._router = new Router(this, routes)
    },

    collect (this: Module, data: object): object {
        const r = Router.get(this)
        if (!r) return data

        data['@router'] = r._prefix
        return data
    }
}

export const RouterViewLifecycle: Lifecycle = {
    collect (this: View, data: object): object {
        const r = Router.get(this._module)
        if (!r) return data
        data['@router'] = r._prefix
        return data
    }
}
