describe('Pageable Model', function() {
    var template = Handlebars.compile('{{#module}}<div data-region="content"></div>{{/module}}'),
        modules = {
            'app/demo/index': { store: { models: {
                foo: {type: 'pageable', pageSize: 2, root: 'items', params: {a: 1}}
            }}},
            'app/demo/templates': template
        },
        app, getResource = function(path) {
            return modules[path];
        };

    beforeEach(function() {
        app = new Drizzle.Application({
            getResource: getResource,
            viewport: 'demo',
            defaultRegion: document.body,
        });
    });

    afterEach(function() {
        app.stop();
    });

    it('should handle page turning correctly', function(done) {
        app.chain(app.start(), function() {
            var model = app.viewport.store.models.foo;
            expect(model).to.be.an.instanceof(Drizzle.PageableModel);
            expect(model.pageInfo).to.deep.equal({page: 1, start: 0, end: 0, total: 0});

            model.set({recordCount: 3, items: [{id: 1}, {id: 2}, {id: 3}]});
            expect(model.pageInfo).to.deep.equal({page: 1, start: 1, end: 2, total: 3});
            expect(model.params).to.deep.equal({a: 1, _page: 1, pageSize: 2});

            model.turnToPage(2);
            expect(model.pageInfo).to.deep.equal({page: 2, start: 3, end: 3, total: 3});
            expect(model.params).to.deep.equal({a: 1, _page: 2, pageSize: 2});

            model.nextPage();
            expect(model.pageInfo).to.deep.equal({page: 2, start: 3, end: 3, total: 3});

            model.prevPage();
            expect(model.pageInfo).to.deep.equal({page: 1, start: 1, end: 2, total: 3});

            model.lastPage();
            expect(model.pageInfo).to.deep.equal({page: 2, start: 3, end: 3, total: 3});

            model.firstPage();
            expect(model.pageInfo).to.deep.equal({page: 1, start: 1, end: 2, total: 3});

            model.clear();
            expect(model.pageInfo).to.deep.equal({page: 1, start: 0, end: 0, total: 0});
        }, done);
    });

    it('should use default values', function(done) {
        Drizzle.PageableModel.setDefault({
            pageSize: 3,
            pageKey: 'page',
            pageSizeKey: 'max',
            recordCountKey: 'count',
            params: function(params) {
                params.first = (params.page - 1) * 2;
                delete params.page;
                return params;
            }
        });
        app.chain(app.start(), function() {
            var model = app.viewport.store.models.foo;
            expect(model.pageInfo).to.deep.equal({page: 1, start: 0, end: 0, total: 0});

            model.set({count: 10, items: [1,2,3,4,5,6,7,8,9,10]});
            model.lastPage();

            expect(model.pageInfo).to.deep.equal({page: 5, start: 9, end: 10, total: 10});
            expect(model.params).to.deep.equal({a: 1, first: 8, max: 2});
        }, done);
    });
});
