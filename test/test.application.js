describe('Application', function() {
    var template = Handlebars.compile('{{#module}}<div id="layout"></div>{{/module}}'),
        modules = {
        'app/router': {},
        'app/demo/index': {
            store: {
                callbacks: {
                    'app.action': function(payload) {
                        expect(payload).to.deep.equal({a: 1});
                        payload.a ++;
                    }
                }
            }
        },
        'app/demo/templates': function() { return template; },
        'app/router': {}
    }, app, getResource = function(path) {
        return modules[path];
    };

    beforeEach(function() {
        app = new Drizzle.Application({
            getResource: getResource,
            viewport: 'demo',
            routers: ['']
        });
    });

    afterEach(function() {
        app.stop();
    });

    it('#before start', function() {
        expect(app).to.include.keys('id', 'name', 'options', 'Promise', 'global');
        expect(app).to.include.keys('_loaders', '_modules', '_templateEngine', '_defaultLoader', '_region');

        expect(app.name).to.equal('Application');
        expect(app.options.getResource).to.equal(getResource);
        expect(app.options.scriptRoot).to.equal('app');
        expect(app.options.container).to.equal(document.body);
        expect(app.Promise).to.be.an.instanceof(Drizzle.Promise);
        expect(app.global).to.be.empty;

        expect(app._loaders).to.have.keys('default');
        expect(app._loaders['default']).to.be.an.instanceof(Drizzle.Loader);
        expect(app._loaders['default']).to.equal(app._defaultLoader);
        expect(app._modules).to.be.empty;
        expect(app._templateEngine).to.be.an.instanceof(Drizzle.TemplateEngine);
        expect(app._region).to.be.an.instanceof(Drizzle.Region);
    });

    it('#start without default route', function(done) {
        app.start().then(function(arg) {
            expect(arg).to.equal(app);
            expect(app).to.include.keys('viewport');
            expect(app.viewport).to.be.an.instanceof(Drizzle.Module);
            expect(app.viewport.name).to.equal('demo');
            expect(app).to.not.include.keys('_router');
            done();
        });
    });

    it('#start with default route', function(done) {
        app.start('hello').then(function(arg) {
            expect(arg).to.equal(app);
            expect(app).to.include.keys('_router');
            expect(app._router).to.be.an.instanceof(Drizzle.Router);
            expect(window.location.hash).to.equal('#!/hello');
            done();
        });
    });
/*
    it('#load', function(done) {
        app.load('demo').then(function(mod) {
            expect(mod[0].name).to.equal('demo');
            done();
        });
    });

    it('#show module name', function(done) {
        app.show('demo').then(function(mod) {
            var content = document.getElementById('content'), id = mod.layout.id;
            expect(content.innerHTML).to.equal('<div id="' + id + 'layout"></div>')
            done();
        });
    });

    it('#show module', function(done) {
        app.Promise.chain(app.load('demo'), function(mod) {
            return app.show(mod[0]);
        }, function(mod) {
            var content = document.getElementById('content'), id = mod.layout.id;
            expect(content.innerHTML).to.equal('<div id="' + id + 'layout"></div>')
            done();
        });
    });
*/
    it('#dispatch', function(done) {
        app.start().then(function() {
            var payload = {a: 1};
            app.dispatch('action', payload);
            expect(payload.a).to.equal(2);

            payload.a = 1;
            app.dispatch({name: 'action', payload: payload});
            expect(payload.a).to.equal(2);
            done();
        });
    });

    it('#navigate', function(done) {
        location.hash = '';
        app.navigate('index');
        expect(location.hash).to.equal('');

        app.start('index').then(function() {
            expect(location.hash).to.equal('#!/index');

            app.navigate('demo')
            expect(location.hash).to.equal('#!/demo');

            location.hash = ''
            done();
        })
    });

    it('#register loader', function() {
        var loader = new Drizzle.Loader(app);
        app.registerLoader('demo', loader);
        expect(app._loaders).to.include.keys('demo');
        expect(app._loaders.demo).to.equal(loader);

        expect(app._defaultLoader).to.equal(app._loaders['default']);
        app.registerLoader('demo', loader, true);
        expect(app._defaultLoader).to.equal(loader);
    });

});
