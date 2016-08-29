describe('Region', function() {
    var template = Handlebars.compile('{{#module}}<div id="layout">Layout</div><div class="a" data-region="content"><p>hello</p></div>{{/module}}'),
        modules = {
            'app/demo/index': {},
            'app/demo/templates': template,
        }, app, getResource = function(path) {
            return modules[path];
        };


    beforeEach(function() {
        app = new Drizzle.Application({
            getResource: getResource,
            viewport: 'demo'
        });
    });

    it('#public properties', function() {
        var region = app._region;
        expect(region).to.be.an.instanceof(Drizzle.Region);
        expect(region).to.include.keys('id', 'name', 'Promise', 'app', 'module');
        expect(region._getElement()).to.equal(document.body);
        expect(region.app).to.equal(app);
        expect(region.module).to.be.undefined;
    });

    it('#show string(module name) & #_isCurrent', function(done) {
        app.start().then(function() {
            var a = {a: 1};
            app.show('content', 'demo', a).then(function(mod) {
                var region = app.viewport.regions.content,
                    el = region._getElement();

                expect(mod.renderOptions).to.equal(a);
                expect(region.name).to.equal('content');
                expect(region.module).to.equal(app.viewport);

                expect(mod).to.be.an.instanceof(Drizzle.Module);
                expect(mod._getElement()).to.equal(el);
                expect(mod._getElement().getAttribute('data-current')).to.equal('demo');

                expect(mod._region).to.equal(region);
                expect(region._isCurrent(mod)).to.be.true;
                expect(region._isCurrent('demo')).to.be.true;
                expect(region._isCurrent(app.viewport)).to.be.false;
                expect(region._isCurrent('hello')).to.be.false;

                expect(el.innerHTML).to.be.equal('<div id="' + mod.id + 'layout">Layout</div><div class="a" data-region="content"><p>hello</p></div>');

                var els = region.$$('.a p');
                expect(els).to.have.length(1);
                expect(els[0].innerHTML).to.equal('hello');
                done();
            });
        });
    });

    it('#show object(module or view)', function(done) {
        app.start().then(function() {
            var region = app.viewport.regions.content,
                demo = app._createModule('demo'), a = {a: 1};

            app.chain(demo, function(dd) {
                return region.show(dd, a).then(function(d) {
                    expect(d).to.equal(dd);
                    expect(d.renderOptions).to.equal(a)
                    return d;
                });
            }, function(dd) {
                var i = sinon.spy(), m = sinon.spy();
                dd.options.afterRender = i;
                dd.options.afterClose = m;

                expect(region._isCurrent(dd)).to.be.ture;

                return region.show(dd).then(function(d) {
                    expect(region._isCurrent(d)).to.be.ture;
                    expect(d).to.equal(dd);
                    i.should.have.been.calledOnce;
                    expect(m).to.have.not.been.called;

                    return region.show(dd, {forceRender: false}).then(function(ddd) {
                        expect(region._isCurrent(ddd)).to.be.ture;
                        expect(ddd).to.equal(dd);
                        expect(i).to.have.been.calledOnce;
                        expect(m).to.have.not.been.called;
                    });
                });
            }, function() {
                region.show({}).then(function() {}, function(error) {
                    expect(error.message).to.equal('[demo:content] The item is expected to be an instance of Renderable ');
                });
            }, done);
        });
    });

    it('#close', function(done) {
        var region = app._region, i = 0;
        app.chain(app.start(), function() {
            expect(app.viewport._region).to.equal(region);
            app.viewport.options.afterClose = function() { i ++; };
        }, function() {
            return region.close();
        }, function() {
            expect(i).to.equal(1);
            expect(region._getElement().innerHTML).to.equal('');
        }, done);
    });

    it('#delegate dom event', function(done) {
        var i = 0, h = function() { i ++; };
        app.chain(app.start(), function() {
            return app.show('content', 'demo');
        }, function(demo) {
            var region = app.viewport.regions.content, id = '#' + demo.id + 'layout';
            expect(region._isCurrent(demo)).to.be.true;
            region._delegateDomEvent(demo, 'click', id, h);

            expect(region._delegated).to.have.all.keys('click');
            expect(region._delegated.click.listener).to.be.a.function;
            expect(region._delegated.click.items).to.have.length(1);
            var item = region._delegated.click.items[0];
            expect(item.fn).to.equal(h);
            expect(item.selector).to.equal(id);

            demo.$('layout').click();
            demo.$('layout').click();
            expect(i).to.equal(2);
        }, done);
    });

    it('#undelegate dom event', function(done) {
        var i = 0, h = function() { i ++; };
        app.chain(app.start(), function() {
            return app.show('content', 'demo');
        }, function(demo) {
            var region = app.viewport.regions.content, id = '#' + demo.id + 'layout';
            region._delegateDomEvent(demo, 'click', id, h);
            demo.$('layout').click();
            expect(i).to.equal(1);
            region._undelegateDomEvents(demo);
            demo.$('layout').click();
            expect(i).to.equal(1);
        }, done);
    });

    afterEach(function() {
        app.stop()
    });

});
