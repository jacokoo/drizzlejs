import {Application} from './application'

export interface Lifecycle {
    stage?: string
    init? (): any

    beforeRender? (): any
    rendered? (): any

    beforeUpdate? (): any
    updated? (): any

    beforeDestroy? (): any
    destroyed? (): any
}

const callIt = (ctx: LifecycleContainer, cycles: Lifecycle[], method: string, reverse = false): Promise<any> => {
    return cycles.filter(it => it[method])[reverse ? 'reduceRight' : 'reduce']((acc, it) => {
        return acc.then(() => it[method].apply(ctx))
    }, Promise.resolve())
}

export class LifecycleContainer {
    app: Application
    private _cycles: Lifecycle[] = []

    constructor (app: Application, options: {cycles?: Lifecycle[]} & Lifecycle) {
        this.app = app

        const cs = options.cycles || []
        cs.push(options)
        cs.forEach(it => !it.stage && (it.stage = 'default'))

        app.options.stages.forEach(s => cs.forEach(c => {
            if (c.stage === s) this._cycles.push(c)
        }))
    }

    protected _doInit () {
        return callIt(this, this._cycles, 'init')
    }

    protected _doBeforeRender () {
        return callIt(this, this._cycles, 'beforeRender')
    }

    protected _doRendered () {
        return callIt(this, this._cycles, 'rendered')
    }

    protected _doBeforeUpdate () {
        return callIt(this, this._cycles, 'beforeUpdate')
    }

    protected _doUpdated () {
        return callIt(this, this._cycles, 'updated')
    }

    protected _doBeforeDestroy () {
        return callIt(this, this._cycles, 'beforeDestroy', true)
    }

    protected _doDestroyed () {
        return callIt(this, this._cycles, 'destroyed', true)
    }
}
