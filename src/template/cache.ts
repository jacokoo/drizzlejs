import { EachKey } from './each-tag'
import { EachDef, EachState } from './common'
import { Disposable } from '../drizzle'

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

    next (key: EachKey): Disposable {
        const c = this.getCache(this, 1)[this._id[this._id.length - 1]] as Array<any>
        let o = c.find(it => it.KEY === key)
        if (!o) {
            o = {KEY: key}
            c.push(o)
        }
        this._state.pop()
        this._state.push(key)

        return {
            dispose () {
                c.splice(c.indexOf(o), 1)
            }
        }
    }

    pop (clear?: boolean) {
        const id = this._id.pop()
        this._def.pop()
        this._state.pop()

        if (clear) {
            delete this.getCache()[id]
        }
    }

    getCache (state: EachState = this, exclude: number = 0): object {
        let o = this.cache
        state._id.forEach((it, i) => {
            if (i + exclude >= state._id.length) return
            o = o[it]
            if (!o) return
            o = (o as any[]).find(iit => iit.KEY === state._state[i])
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
}
