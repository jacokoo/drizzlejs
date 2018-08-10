import { Lifecycle } from '../lifecycle'
import { Delay, Template } from './template'
import { View } from '../view'

export class ViewTemplate extends Template<View> {
    constructor () {
        super()
        const me = this
        this.life = {
            stage: 'template',
            init (this: View) { return Delay.also(d => me.init(this, d)) },
            beforeRender (this: View) { return Delay.also(d => me.render(me.getContext(this), d)) },
            updated (this: View) { return Delay.also(d => me.update(me.getContext(this), d)) },
            beforeDestroy () { return Delay.also(d => me.destroy(d)) }
        }
    }

    getContext (view: View): any {
        const c: any = view._state
        if (view._options.computed) {
            c._computed = view._options.computed
        }
        return c
    }
}
