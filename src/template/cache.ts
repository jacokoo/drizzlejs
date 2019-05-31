import { EachKey } from './each-tag'
import { EachDef, EachState } from './common'

export class Cache implements EachState {
    cache: object = {}
    _id: string[] = []
    _def: EachDef[] = []
    _state: (string | number)[] = []

    push (id: string, def: EachDef) {
        const c = this.getCache()
        if (!c[id]) c[id] = []

        this._id.push(id)
        this._def.push(def)
        this._state.push(0)
    }

    next (key: EachKey, create: boolean = true) {
        if (create) {
            const c = this.getCache()[this._id[this._id.length - 1]];
            (c as Array<any>).push({KEY: key})
        }
        this._state.pop()
        this._state.push(key)
    }

    pop (clear?: boolean) {
        const id = this._id.pop()
        this._def.pop()
        this._state.pop()

        if (clear) {
            delete this.getCache()[id]
        }
    }

    getCache (state: EachState = this, excludeLast: boolean = false): object {
        let o = this.cache
        state._id.forEach((it, i) => {
            if (excludeLast && i === state._id.length) return
            o = o[it]
            if (!o) return
            o = (o as any[]).find(iit => iit.KEY === state._state[i])
        })
        return o
    }

    get (key: string): any {
        return this.getCache()[key]
    }

    set (key: string, value: any) {
        this.getCache()[key] = value
    }

    clear (key: string) {
        delete this.getCache()[key]
    }
}
