import { Lifecycle } from '../lifecycle'
import { Delay, Template } from './template'
import { View } from '../view'

export class ViewTemplate extends Template<View> {
    constructor () {
        super()
        const me = this
        this.life = {
            stage: 'template',
            init (this: View) { Delay.also(d => me.init(this, d)) },
            beforeRender (this: View) { Delay.also(d => me.render(this._state, d)) },
            updated (this: View) { Delay.also(d => me.update(this._state, d)) },
            beforeDestroy () { Delay.also(d => me.destroy(d)) }
        }
    }
}
