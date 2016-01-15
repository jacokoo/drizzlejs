describe('Action Creator', function() {
    var template = Handlebars.compile([
            '{{#module}}<div id="layout" data-region="content"></div>{{/module}}',
            '{{#view "hello"}}',
                '<div id="a" data-name="a" data-value="a"></div>',
                '<div id="b-2" data-name="b" data-value="b-2"></div>',
                '<div id="b-3" data-name="b" data-value="b-3"></div>',
                '<form id="form">',
                    '<input name="c" value="c">',
                    '<a id="d" data-name="d" data-value="d">a</a>',
                    '<a id="e-1" data-name="e" data-value="e1">a</a>',
                    '<a id="e-2" data-name="e" data-value="e2">a</a>',
                '</form>',
            '{{/view}}'
        ].join('')),
        modules = {
        'app/demo/index': { store: { callbacks: {
            actionA: function(payload) {
                return {a : 1};
            },
            actionB: function() {
                throw new Error('do not reach here');
            },
            actionD: function() {
                throw new Error('an error');
            }
        }}},
        'app/demo/templates': template,
    }, app, getResource = function(path) {
        return modules[path];
    }, tmp = Drizzle.Adapter.getFormData;

    before(function() {
        Drizzle.adapt({
            getFormData: function(el) {
                return {el: el};
            }
        });
    });

    beforeEach(function() {
        app = new Drizzle.Application({
            getResource: getResource,
            viewport: 'demo'
        });
    });

    it('#create action', function(done) {
        var a, ac, b, d, e;
        app.chain(app.start(), function() {
            return new Drizzle.ActionCreator('hello', app, app.viewport, app._defaultLoader, {
                actions: {
                    'click a': 'actionA',
                    'click b-*': 'actionB',
                    'click d': 'actionD',
                    'click e-*': 'actionE'
                },
                dataForActions: {
                    actionA: function(data) {
                        a = data;
                        return a;
                    },
                    actionB: function(data) {
                        b = data;
                        return false;
                    },
                    actionD: function(data) {
                        d = data;
                        return d;
                    },
                    actionE: function(data) {
                        e = data;
                        return false;
                    }
                },
                actionCallbacks: {
                    actionA: function(data) {
                        expect(data.a).to.equal(1);
                    },
                    actionD: function() {
                        throw new Error('do not reach here');
                    }
                }
            });
        }, function(item) {
            return app.show('content', item);
        }, function(item) {
            item.$('a').click();
            expect(a.a).to.equal('a');
            expect(a.b).to.be.an.array;
            expect(a.b[0]).to.equal('b-2');
            expect(a.b[1]).to.equal('b-3');
            expect(a).to.not.have.keys('c');
            expect(a.d).to.equal('d');
            expect(a.e).to.be.an.array;
            expect(a.e[0]).to.equal('e1');
            expect(a.e[1]).to.equal('e2');

            item.$('b-2').click();
            expect(b.a).to.equal('a');
            expect(b.b).to.equal('b-2');
            expect(b).to.not.have.keys('c');
            expect(b.d).to.equal('d');
            expect(b.e).to.be.an.array;
            expect(b.e[0]).to.equal('e1');
            expect(b.e[1]).to.equal('e2');

            item.$('b-3').click();
            expect(b.a).to.equal('a');
            expect(b.b).to.equal('b-3');
            expect(b).to.not.have.keys('c');
            expect(b.d).to.equal('d');
            expect(b.e).to.be.an.array;
            expect(b.e[0]).to.equal('e1');
            expect(b.e[1]).to.equal('e2');

            item.$('d').click();
            expect(d).to.not.have.keys('a', 'b', 'c');
            expect(d.d).to.equal('d');
            expect(d.e).to.be.an.array;
            expect(d.e[0]).to.equal('e1');
            expect(d.e[1]).to.equal('e2');
            expect(d.el).to.equal(item.$('form'));

            item.$('e-1').click();
            expect(e).to.not.have.keys('a', 'b', 'c');
            expect(e.d).to.equal('d');
            expect(e.e).to.equal('e1');
            expect(e.el).to.equal(item.$('form'));

            item.$('e-2').click();
            expect(e).to.not.have.keys('a', 'b', 'c');
            expect(e.d).to.equal('d');
            expect(e.e).to.equal('e2');
            expect(e.el).to.equal(item.$('form'));
        }, done);
    });

    afterEach(function() {
        app.stop();
    });

    after(function() {
        Drizzle.adapt({
            getFormData: tmp
        });
    });
});
