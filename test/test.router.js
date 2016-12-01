describe('Router', function() {
    var spy1 = sinon.spy(function() {return 'Main'}),
        spy2 = sinon.spy(function() {return 'Index'}),
        spy3 = sinon.spy(function() {return 'Intercepter'}),
        spy4 = sinon.spy(function() {return 'Foo'}),
        spy5 = sinon.spy(function() {return 'Root'}),
        template = Handlebars.compile('{{#module}}<div id="layout"></div>{{/module}}'),
        modules = {
            'app/router': {
                routes: {
                    main: 'showMain',
                    'main/index': 'showIndex',
                    'main/index/:id': 'showIndex'
                },

                interceptors: {
                    '': 'showRoot',
                    main: 'showIntercepter'
                },

                showMain: spy1,
                showIndex: spy2,
                showIntercepter: spy3,
                showRoot: spy5
            },
            'app/demo/index': {},
            'app/demo/templates': function() { return template; },
            'app/demo/router': {
                routes: {
                    'foo': 'showFoo'
                },
                showFoo: spy4
            }
        }, app, getResource = function(path) {
            return modules[path];
        };

    beforeEach(function() {
        app = new Drizzle.Application({
            getResource: getResource,
            viewport: 'demo',
            routers: ['', 'demo']
        });
    });

    afterEach(function() {
        app.stop();
    });

    it('#!route', function(done) {
        app.chain(app.start('main'), function() {
            expect(app._router).to.be.an.instanceof(Drizzle.Router);
            expect(app._router._started).to.be.true;
            expect(app._router._routes).to.have.length(4);
            expect(spy1).to.be.calledOnce;
            expect(spy5).to.be.calledOnce;
            expect(spy1).to.be.calledWith('Root');

            app.navigate('main/index', false);
            expect(location.hash).to.equal('#!/main/index');
            expect(spy2).to.have.not.been.called;
            expect(spy3).to.have.not.been.called;

            app.navigate('main/index/123');
            expect(spy2).to.have.been.calledOnce;
            expect(spy3).to.have.been.calledOnce;
            expect(spy5).to.have.been.calledTwice;
            expect(spy3).to.be.calledWith('Root');
            expect(spy2).to.be.calledWith('Intercepter', '123');

            app.navigate('demo/foo');
            expect(spy4).to.have.been.calledOnce;
            expect(spy5).to.have.callCount(3);
            expect(spy4).to.have.been.calledWith('Root');
        }, done);
    });
});
