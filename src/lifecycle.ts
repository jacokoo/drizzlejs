import {Application} from './application'

export interface Lifecycle {
    stage?: string
    init? (): any

    collect? (data: object): object

    beforeRender? (): any
    rendered? (data: object): any

    beforeUpdate? (): any
    updated? (data: object): any

    beforeDestroy? (): any
    destroyed? (): any
}

const callIt = (
    ctx: LifecycleContainer, cycles: Lifecycle[], method: string, reverse = false, args: any[] = []
): Promise<any> => {
    return cycles.filter(it => it[method])[reverse ? 'reduceRight' : 'reduce']((acc, it) => {
        return acc.then(() => it[method].apply(ctx, args))
    }, Promise.resolve())
}

export class LifecycleContainer {
    app: Application
    private _cycles: Lifecycle[] = []

    constructor (app: Application, options: {cycles?: Lifecycle[]} & Lifecycle, ...args: Lifecycle[]) {
        this.app = app

        const cs = options.cycles || []
        cs.push(options)
        args.forEach(it => it && cs.push(it))
        cs.forEach(it => !it.stage && (it.stage = 'default'))

        app.options.stages.forEach(s => cs.forEach(c => {
            if (c.stage === s) this._cycles.push(c)
        }))
    }

    protected _doInit () {
        return callIt(this, this._cycles, 'init')
    }

    protected _doCollect (data: object): object {
        return this._cycles.filter(it => !!it.collect).reduce((acc, item) => item.collect.call(this, acc), data)
    }

    protected _doBeforeRender () {
        return callIt(this, this._cycles, 'beforeRender')
    }

    protected _doRendered (data: object) {
        return callIt(this, this._cycles, 'rendered', false, [data])
    }

    protected _doBeforeUpdate () {
        return callIt(this, this._cycles, 'beforeUpdate')
    }

    protected _doUpdated (data: object) {
        return callIt(this, this._cycles, 'updated', false, [data])
    }

    protected _doBeforeDestroy () {
        return callIt(this, this._cycles, 'beforeDestroy', true)
    }

    protected _doDestroyed () {
        return callIt(this, this._cycles, 'destroyed', true)
    }
}
