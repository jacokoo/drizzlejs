import { EachKey } from './each-tag'
import { EachDef, EachState, RefDef, RefContainer } from './common'
import { Disposable } from '../drizzle'

const walk = (re: any[], def: RefDef, current: number, o: object) => {
    if (current === def.each.length) {
        if (o[def.id]) re.push(o[def.id])
        return
    }

    const keys = o[`_keys_${def.each[current]}`]
    keys.forEach(it => {
        walk(re, def, current + 1, o[def.each[current]][it])
    })
}

export class Cache implements EachState {
    current: any
    cache: object = {}
    _id: string[] = []
    _def: EachDef[] = []
    _state: (string | number)[] = []

    push (id: string, def: EachDef) {
        const c = this.getCache()
        if (!c[id]) {
            c[id] = {}
        }

        this._id.push(id)
        this._def.push(def)
        this._state.push(0)
        this.current = null
    }

    next (key: EachKey): Disposable {
        const ca = this.getCache(this, 1)
        const id = this._id[this._id.length - 1]
        const c = ca[id]
        let o = c[key]
        if (!o) {
            o = {}
            c[key] = o
        }
        this.current = o

        this._state.pop()
        this._state.push(key)

        return {
            dispose () {
                delete c[key]
            }
        }
    }

    pop (clear?: boolean) {
        const id = this._id.pop()
        this._def.pop()
        this._state.pop()
        this.current = null
        if (this._def.length) this.current = this.getCache()

        if (clear) {
            const c = this.getCache()
            delete c[id]
        }
    }

    getCache (state: EachState = this, exclude: number = 0): object {
        if (exclude === 0 && this.current) return this.current
        let o = this.cache
        state._id.forEach((it, i) => {
            if (i + exclude >= state._id.length) return
            o = o[it]
            if (!o) return
            o = o[state._state[i]]
        })
        return o
    }

    get (key: string): any {
        if (!this._id.length) return this.getCache()[key]

        for (let i = 0; i <= this._id.length; i ++) {
            const v = this.getCache(this, i)[key]
            if (v) return v
        }
        return null
    }

    set (key: string, value: any) {
        this.getCache()[key] = value
    }

    clear (key: string) {
        delete this.getCache()[key]
    }

    ref (def: RefDef): any {
        if (!def.each.length) {
            return this.cache[def.id]
        }

        const re = []
        walk(re, def, 0, this.cache)
        return re
    }
}
