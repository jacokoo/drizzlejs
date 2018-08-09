import {Application, Loader as l} from 'drizzlejs'
import * as a from 'drizzlejs'
import b from 'drizzlejs'

class MLoader extends Loader {
    load (file, mod) {
        if (!mod) return null
        return Promise.resolve(mod._options._loadedItems[file])
    }
}

var app = new Application({
    entry: 'todos',
    container: document.querySelector('#content')
})

app.registerLoader(MLoader)

app.start()
