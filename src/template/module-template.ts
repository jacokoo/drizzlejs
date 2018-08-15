import {ItemOptions, Module} from '../module'
import { Delay, Template } from './template'

export class ModuleTemplate extends Template<Module> {
    exportedModels: string[] = []

    constructor(exportedModels: string[]) {
        super()
        const me = this
        this.exportedModels = exportedModels
        this.life = {
            stage: 'template',
            init (this: Module) { return Delay.also(d => me.init(this, d)) },
            beforeRender (this: Module) { return Delay.also(d => me.render(this._context(), d)) },
            updated (this: Module) { return Delay.also(d => me.update(this._context(), d)) },
            beforeDestroy () { return Delay.also(d => me.destroy(d)) }
        }
    }
}
