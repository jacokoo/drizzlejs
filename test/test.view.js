describe('View', function() {
    var template = Handlebars.compile([
            '{{#module}}<label for="layout">A</label><div id="layout" data-region="content"></div>{{/module}}',
            '{{#view "qux"}}',
                '{{#each foo}}',
                    '<span id="{{id}}">{{name}}</span>',
                '{{/each}}',
                '<span id="bar">{{bar}}</span>',
            '{{/view}}'
        ].join('')),
        modules = {
            'app/demo/index': { store: { models: {
                foo: {data: [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}]}
            } } },
            'app/demo/templates': template,
        }, app, getResource = function(path) {
            return modules[path];
        };

    beforeEach(function() {
        app = new Drizzle.Application({
            getResource: getResource,
            viewport: 'demo',
            defaultRegion: document.body
        });
    });

    afterEach(function() {
        app.stop();
    });

    it('#bind data', function(done) {
        var loader = app._getLoader('qux', app.viewport);
            stub = sinon.stub(loader, 'loadView'),
            spy = sinon.spy(function() {return 'bar'});
        stub.returns({
            bindings: {foo: true},
            dataForTemplate: {bar: spy}
        });

        app.chain(app.start(), function() {
            return app._createView('qux', app.viewport);
        }, function(view) {
            return view.chain(view._loadedPromise, view);
        }, function(view) {
            expect(stub).to.have.been.calledOnce;

            expect(view.bindings).to.have.keys('foo');
            expect(view.bindings.foo).to.be.an.instanceof(Drizzle.Model);
            expect(spy).to.have.not.been.called;
            return app.show('content', view);
        }, function(view) {
            expect(spy).to.have.been.calledOnce;
            var data = spy.getCall(0).args[0];
            expect(data.foo).to.deep.equal([{id: 1, name: 'foo'}, {id: 2, name: 'bar'}]);
            expect(view._element.innerHTML).to.equal('<span id="' + view.id + '1">foo</span><span id="'
                                                     + view.id + '2">bar</span><span id="'+ view.id + 'bar">bar</span>');

            app.viewport.store.models.foo.set([{id: 3, name: 'baz'}], true);

            return app.Promise.create(function(resolve) {
                setTimeout(function() {
                    expect(spy).to.have.been.calledTwice;
                    data = spy.getCall(1).args[0];
                    expect(data.foo).to.deep.equal([{id: 3, name: 'baz'}]);
                    expect(view._element.innerHTML).to.equal('<span id="' + view.id + '3">baz</span><span id="' + view.id + 'bar">bar</span>');

                    stub.restore();
                    resolve();
                }, 100);
            });
        }, done);
    });
});
