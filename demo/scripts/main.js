import {Application, Loader} from 'drizzlejs'
import {editor} from './app/component/ace-editor'

class MLoader extends Loader {
    load (file, mod) {
        if (!mod) return null
        return Promise.resolve(mod._options._loadedItems[file === 'index' ? this._path : file])
    }
}

var app = new Application({
    container: document.body,
    components: {'ace-editor': editor}
})

app.registerLoader(MLoader)

app.start()
