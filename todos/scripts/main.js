import {Application, Loader} from 'drizzlejs'

class MLoader extends Loader {
    load (file, mod) {
        if (!mod) return null
        return Promise.resolve(mod._options._loadedItems[file])
    }
}

var app = new Application({
    container: document.querySelector('#content')
})

app.registerLoader(MLoader)

app.start()
