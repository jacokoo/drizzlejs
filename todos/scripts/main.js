import {Application} from 'drizzlejs'
import todos from 'todos'

var app = new Application({
    entry: todos,
    container: document.querySelector('#content')
})

app.start()
