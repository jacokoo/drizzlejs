describe('Application', function() {
    var app, modules;

    before(function() {
        modules = {};
        app = new Drizzle.Application({
            getResource: function(path) {
                return modules[path];
            },
            defaultRegion: document.getElementById('content')
        });
    });

    it('#constructor', function() {
        console.log(app);
    });

    after(function() {
        app.destory()
    });

});
