import { Disposable } from './drizzle'

type Handler = (data: any) => void

export class Events {
    _handlers: {[name: string]: Handler[]} = {}

    on (name: string, handler: (data: any) => void): Disposable {
        if (!this._handlers[name]) this._handlers[name] = []
        const hs = this._handlers[name]

        if (hs.indexOf(handler) !== -1) return {dispose: () => {}}
        hs.push(handler)

        return {
            dispose: () => {
                const idx = hs.indexOf(handler)
                if (idx !== -1) hs.splice(idx, 1)
            }
        }
    }

    fire (name: string, data: any) {
        if (!this._handlers[name]) return
        const hs = this._handlers[name].slice()
        hs.forEach(it => it.call(this, data))
    }
}
