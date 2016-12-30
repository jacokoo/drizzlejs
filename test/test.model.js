describe('Store & Model', function() {
    var returnValue = {a: 1}, spy1 = sinon.stub().returns(returnValue), template = Handlebars.compile([
            '{{#module}}<div id="layout" data-region="content"></div><div data-region="foo"></foo>{{/module}}',
            '{{#view "hello"}}hello{{/view}}'
        ].join('')),
        modules = {
            'app/demo/index': {
                store: {
                    models: {
                        qux: function() { return {data: [1, 2, 3]}; },
                        replaced: {replaceable: true}
                    }
                }
            },
            'app/demo/templates': template,
            'app/foo/index': {
                urlPrefix: 'prefix',
                items: {
                    hello: 'content',
                    demo: {region: 'foo', isModule: true, models: {replaced: 'qux'}}
                },

                store: {
                    models: {
                        foo: {url: 'foo', data: [1, 2], params: returnValue},
                        bar: {url: '../bar', autoLoad: 'after', root: 'a'},
                        baz: {url: '../../baz', autoLoad: true, parse: function(data) {
                            data.b = 2;
                            return data;
                        }},
                        qux: {shared: true}
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
        }, xhr, requests = [], handled = [];

    before(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        xhr.onCreate = function(options) {
            requests.push(options);
            setTimeout(function() {
                if (handled.length === 8) {
                    options.respond(500, {'Content-Type': 'application/json'}, '{"a": 1}');
                    return;
                }
                options.respond(200, {'Content-Type': 'application/json'}, '{"a": 1}');
                handled.push(options);
            }, 100);
        };
    });

    beforeEach(function() {
        requests = [];
        handled = [];
        app = new Drizzle.Application({
            getResource: getResource,
            viewport: 'demo',
            urlRoot: 'api',
            urlSuffix: '.json'
        });
    });

    it('#store', function(done) {
        app.chain(app.start(), function() {
            return app.show('content', 'foo');
        }, function(foo) {
            expect(foo.store).to.be.an.instanceof(Drizzle.Store);
            expect(foo.store).to.include.keys('app', 'module');
            expect(foo.store.app).to.equal(app);
            expect(foo.store.module).to.equal(foo);

            expect(foo.store.models).to.have.keys('foo', 'bar', 'baz', 'qux');
            expect(foo.store.models.foo).to.be.an.instanceof(Drizzle.Model);
            expect(foo.store.models.bar).to.be.an.instanceof(Drizzle.Model);
            expect(foo.store.models.baz).to.be.an.instanceof(Drizzle.Model);
            expect(foo.store.models.qux).to.equal(foo.items.demo.store.models.replaced);

            var obj = {a: 1};
            foo.store.dispatch({name: 'foo', payload: obj});
            expect(spy1).to.be.calledWith(obj);
        }, done);
    });

    it('#model', function(done) {
        app.chain(app.start(), function() {
            return app.show('content', 'foo');
        }, function(foo) {
            var models = foo.store.models;
            expect(models.foo).to.include.keys('app', 'module', 'store');
            expect(models.foo.app).to.equal(app);
            expect(models.foo.module).to.equal(foo);
            expect(models.foo.store).to.equal(foo.store);
            expect(models.qux.module).to.equal(app.viewport);

            expect(models.foo.data).to.deep.equal([1, 2]);
            expect(models.foo.params).to.deep.equal({a: 1});

            expect(models.bar.data).to.equal(1);
            expect(models.baz.data).to.deep.equal({a: 1, b: 2});

            models.foo.clear();
            models.baz.clear();
            models.bar.clear();
            expect(models.foo.data).to.eql([]);
            expect(models.baz.data).to.eql({});
            expect(models.bar.data).to.eql({});

            var data = {a: 1, b: [1, 2, 3], c: null};
            models.foo.set(data);
            expect(models.foo.data).to.equal(data);
            expect(models.foo.get()).to.equal(data);
            expect(models.foo.get(true)).to.not.equal(data);
            expect(models.foo.get(true)).to.eql(data);

            expect(models.foo.getFullUrl()).to.equal('api/prefix/foo/foo.json');
            expect(models.bar.getFullUrl()).to.equal('api/prefix/bar.json');
            expect(models.baz.getFullUrl()).to.equal('api/baz.json');
            expect(models.qux.getFullUrl()).to.equal('api/demo.json');

            var spy = sinon.spy();
            models.foo.on('changed', spy);
            models.foo.set(data, true)
            expect(spy).to.be.calledOnce;
            models.foo.changed();
            expect(spy).to.be.calledTwice;
            models.foo.clear(true);
            expect(spy).to.have.callCount(3);
        }, done);
    });

    it('#request', function(done) {
        app.chain(app.start(), function() {
            return app.show('content', 'foo');
        }, function(foo) {
            var index = requests.length,
                model = foo.store.models.foo, request;
            Drizzle.Request.get(model);
            request = requests[index ++];

            expect(request.method).to.equal('GET');
            expect(request.url).to.equal('api/prefix/foo/foo.json?a=1');

            model.set({name: '2'});
            Drizzle.Request.post(model);
            request = requests[index ++];
            expect(request.method).to.equal('POST');
            expect(request.url).to.equal('api/prefix/foo/foo.json');
            expect(request.requestBody).to.eql('name=2');

            model.set({id: 1, name: '2'});
            Drizzle.Request.put(model);
            request = requests[index ++];
            expect(request.method).to.equal('PUT');
            expect(request.url).to.equal('api/prefix/foo/foo/1.json');
            expect(request.requestBody).to.eql('id=1&name=2');

            model.set({id: 1, name: '2'});
            Drizzle.Request.del(model);
            request = requests[index ++];
            expect(request.method).to.equal('DELETE');
            expect(request.url).to.equal('api/prefix/foo/foo/1.json');
            expect(request.requestBody).to.eql('id=1&name=2');

            model.set({name: '2'});
            Drizzle.Request.save(model);
            request = requests[index ++];
            expect(request.method).to.equal('POST');
            expect(request.url).to.equal('api/prefix/foo/foo.json');
            expect(request.requestBody).to.eql('name=2');

            model.set({name: '2', id: 1});
            Drizzle.Request.save(model);
            request = requests[index ++];
            expect(request.method).to.equal('PUT');
            expect(request.url).to.equal('api/prefix/foo/foo/1.json');
            expect(request.requestBody).to.eql('name=2&id=1');

            return Drizzle.Request.save(model);
        }).then(null, function() { done(); });
    });

    afterEach(function() {
        app.stop();
    });

    after(function() {
        xhr.restore();
    });
});
