var app = new drizzlejs.Application({
    entry: 'hello',
    container: document.querySelector('#content'),
    getResource: function (file) {
        return Promise.resolve(MODULES[file])
    }
})

app.start()
