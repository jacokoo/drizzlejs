describe('MultiRegion', function() {
    var template = Handlebars.compile('{{#module}}<div data-region="multiple:content"></div>{{/module}}'),
        modules = {
            'app/demo/index': { store: { models: {
                foo: {type: 'pageable', pageSize: 2, root: 'items', params: {a: 1}}
            }}},
            'app/demo/templates': template
        },
        app, getResource = function(path) {
            return modules[path];
        };

    Drizzle.registerRegion('multiple', Drizzle.MultiRegion);

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

    it('should handle multiple renderables in a single region', function(done) {
        app.chain(app.start(), function() {
            var region = app.viewport.regions.content;
            expect(region).to.be.an.instanceof(Drizzle.MultiRegion);
            expect(region.name).to.equal('content');

            return region.show('demo', {key: 'item-1'});
        }, function() {
            var region = app.viewport.regions.content;
            expect(region._getElement().innerHTML)
                .to.equal('<div data-current="demo"><div data-region="multiple:content"></div></div>');

            return region.show('demo', {key: 'item-2'});
        }, function() {
            var region = app.viewport.regions.content;
            expect(region._getElement().innerHTML)
                .to.equal(['<div data-current="demo"><div data-region="multiple:content"></div></div>',
                           '<div data-current="demo"><div data-region="multiple:content"></div></div>'].join(''));

            return region.close();
        }, function() {
            var region = app.viewport.regions.content;
            expect(region._getElement().innerHTML).to.equal('');
        }, done);
    });
});
