import {Application, Loader, components} from 'drizzlejs'
import {editor} from './app/component/ace-editor'

components['ace-editor'] = editor

class MLoader extends Loader {
    load (file, mod) {
        if (!mod) return null
        return Promise.resolve(mod._options._loadedItems[file === 'index' ? this._path : file])
    }
}

var app = new Application({
    container: document.body
})

app.registerLoader(MLoader)

app.start()
