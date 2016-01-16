describe('Renderable', function() {
    var template = Handlebars.compile([
            '{{#module}}<div id="layout" data-region="content"></div>{{/module}}',
            '{{#view "hello"}}',
                '<div id="a"></div>',
                '<div id="b-2"></div>',
                '<div id="b-3"></div>',
            '{{/view}}'
        ].join('')),
        modules = {
        'app/demo/index': {},
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

    it('#create', function(done) {
        app.chain(app.start(), function() {
            var loader = app._defaultLoader, mod = app.viewport,
                templateEngine = new Drizzle.TemplateEngine(),
                options = {templateEngine: templateEngine},
                item = new Drizzle.Renderable('hello', app, mod, loader, options);

            expect(item).to.include.keys('id', 'name', 'app', 'module', 'components');
            expect(item.name).to.equal('hello');
            expect(item.app).to.equal(app);
            expect(item.module).to.equal(mod);
            expect(item.components).to.be.empty;

            expect(item._templateEngine).to.equal(templateEngine);
            expect(item.options).to.equal(options);

        }, done)
    });

    it('#events', function(done) {
        var i = 0;
        app.chain(app.start(), function() {
            return new Drizzle.Renderable('hello', app, app.viewport, app._defaultLoader, {
                events: {
                    'click a': 'aClicked',
                    'click b-*': 'bClicked'
                },
                handlers: {
                    aClicked: function() {
                        i ++;
                    },
                    bClicked: function(id) {
                        i += +id;
                    }
                }
            });
        }, function(item) {
            return app.show('content', item);
        }, function(item) {
            item.$('a').click();
            expect(i).to.equal(1);
            item.$('b-2').click();
            expect(i).to.equal(3);
            item.$('b-3').click();
            expect(i).to.equal(6);
        }, done);
    });

    it('#components', function(done) {
        var i = 0, m = 0, foo = {a: 1}, options;
        Drizzle.ComponentManager.register('hello', function() {
            i ++;
            foo.args = [].slice.call(arguments);
            return foo;
        }, function() {
            m ++;
        });
        app.chain(app.start(), function() {
            return new Drizzle.Renderable('hello', app, app.viewport, app._defaultLoader, {
                components: [{
                    id: 'a', name: 'hello', options: options
                }]
            });
        }, function(item) {
            return app.show('content', item, foo);
        }, function(item) {
            expect(item.renderOptions).to.equal(foo);
            expect(i).to.equal(1);
            expect(m).to.equal(0);
            expect(item.components.a).to.equal(foo);
            expect(foo.args).to.have.length(3);
            expect(foo.args[0]).to.equal(item);
            expect(foo.args[1]).to.equal(item.$('a'));
            expect(foo.args[2]).to.equal(options);
            return item.render();
        }, function(item) {
            expect(i).to.equal(2);
            expect(m).to.equal(1);

            return app.viewport.regions.content.close();
        }, function() {
            expect(i).to.equal(2);
            expect(m).to.equal(2);
        }, done);
    });

    it('#two or more components in one element', function(done) {
        var i = 0, m = 0, foo = {a: 1};
        Drizzle.ComponentManager.setDefaultHandler(function() {
            i ++;
            return foo;
        }, function() {
            m ++;
        });

        app.chain(app.start(), function() {
            return new Drizzle.Renderable('hello', app, app.viewport, app._defaultLoader, {
                components: [{
                    id: 'a', name: 'foo'
                }, {
                    id: 'a', name: 'bar'
                }]
            });
        }, function(item) {
            return app.show('content', item);
        }, function(item) {
            expect(item.components.a).to.be.an.array;
            expect(item.components.a).to.have.length(2);
            expect(item.components.a[0]).to.equal(foo);
            expect(item.components.a[1]).to.equal(foo);
            expect(i).to.equal(2);

            return item.render();
        }, function(item) {
            expect(i).to.equal(4);
            expect(m).to.equal(2);
        }, done)
    });

    afterEach(function() {
        app.stop();
    });
});
