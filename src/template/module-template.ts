import {ItemOptions, Module} from '../module'
import { Delay, Template } from './template'

export class ModuleTemplate extends Template<Module> {
    options: {
        exportedModels: string[]
        items: ItemOptions
    }

    constructor(exportedModels: string[]) {
        super()
        this.options = {exportedModels, items: {}}
        const me = this
        this.life.init = function(this: Module) { return Delay.also(d => me.init(this, d)) }
        this.life.beforeRender = function(this: Module) { return Delay.also(d => me.render(this.get(), d)) }
        this.life.updated = function(this: Module) { return Delay.also(d => me.update(this.get(), d)) }
        this.life.beforeDestroy = function(this: Module) { return Delay.also(d => me.destroy(d)) }
    }

    views (...views: string[]) {
        views.forEach(it => this.options.items[it] = {view: it})
    }

    modules (name: string, path: string, loader?: string, args?: string[]) {
        this.options.items[name] = loader ? {path, loader: {name: loader, args}} : {path}
    }
}
