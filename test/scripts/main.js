var app = new drizzle.Application({
    entry: 'hello',
    container: document.querySelector('#content'),
    getResource: function (file) {
        console.log(file, MODULES[file])
        return Promise.resolve(MODULES[file])
    }
})

app.start()

console.log('h')
