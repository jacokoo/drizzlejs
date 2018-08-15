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
            beforeRender (this: View) { return Delay.also(d => me.render(this._context(), d)) },
            updated (this: View) { return Delay.also(d => me.update(this._context(), d)) },
            beforeDestroy () { return Delay.also(d => me.destroy(d)) }
        }
    }
}
