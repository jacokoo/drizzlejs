describe('Module', function() {
    var returnValue = {a: 1}, spy1 = sinon.stub().returns(returnValue), template = Handlebars.compile([
            '{{#module}}<div id="layout" data-region="content"></div><div data-region="foo"></foo>{{/module}}',
            '{{#view "hello"}}hello{{/view}}'
        ].join('')),
        modules = {
            'app/demo/index': {},
            'app/demo/templates': template,
            'app/foo/index': {
                items: {
                    hello: 'content',
                    demo: {region: 'foo', isModule: true}
                },

                store: {
                    models: {
                        bar: {url: 'bar', autoLoad: 'after'},
                        baz: {url: 'baz', autoLoad: true}
                    },
                    callbacks: {
                        foo: spy1
                    }
                }
            },
            'app/foo/templates': template,
            'app/foo/view-hello': {}
        }, app, getResource = function(path) {
            return modules[path];
        }, xhr, requests = [];

    before(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        xhr.onCreate = function(options) {
            requests.push(options);
            setTimeout(function() {
                options.respond(200, {'Content-Type': 'application/json'}, '{"a": 1}');
            }, 500);
        };
    });

    beforeEach(function() {
        requests = [];
        app = new Drizzle.Application({
            getResource: getResource,
            viewport: 'demo',
            defaultRegion: document.body
        });
    });

    it('#renderable container', function(done) {
        app.chain(app.start(), function() {
            return app.show('content', 'foo');
        }, function(foo) {
            expect(foo).to.be.an.instanceof(Drizzle.RenderableContainer);
            expect(foo).to.be.an.instanceof(Drizzle.Module);
            expect(foo.name).to.equal('foo');
            expect(foo.items).to.have.keys('hello', 'demo');
            expect(foo.items.hello).to.be.an.instanceof(Drizzle.View);
            expect(foo.items.demo).to.be.an.instanceof(Drizzle.Module);
            expect(foo.items.hello.moduleOptions.region).to.equal('content');

            expect(foo.regions).to.have.keys('content', 'foo');
            expect(foo.regions.content).to.be.an.instanceof(Drizzle.Region);
            expect(foo.regions.foo).to.be.an.instanceof(Drizzle.Region);

            expect(foo.regions.content.name).to.equal('content')
            expect(foo.regions.foo.name).to.equal('foo');

            expect(requests).to.have.length(2);
        }, done);
    });

    it('#dispatch', function(done) {
        var obj = {b: 1};
        app.chain(app.start(), function() {
            return app.show('content', 'foo');
        }, function(foo) {
            return foo.dispatch('foo', obj);
        }, function(item) {
            expect(spy1).to.be.calledWith(obj);
            expect(item).to.equal(returnValue);
        }, done);
    });

    it('#dispatch with errors', function(done) {
        var obj = {b: 1};
        app.chain(app.start(), function() {
            return app.show('content', 'foo');
        }, function(foo) {
            expect(foo.store).to.be.an.instanceof(Drizzle.Store);
            return foo.dispatch('hello', obj);
        }).catch(function(e) {
            expect(e.message).to.equal('[foo:Store] No action callback for name: hello ');
            done();
        });
    });

    afterEach(function() {
        app.stop();
    });

    after(function() {
        xhr.restore();
    });
});
