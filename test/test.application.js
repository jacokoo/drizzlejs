(function() {
    /*
        compiled by Handlebars:
        {{#layout}}<div id="layout"></div>{{/layout}}
    */
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
  templates['app/demo/templates'] = template({"1":function(depth0,helpers,partials,data) {
      return "<div id=\"layout\"></div>";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helper, options;

    stack1 = ((helper = (helper = helpers.layout || (depth0 != null ? depth0.layout : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"layout","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0,options) : helper));
    if (!helpers.layout) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
    if (stack1 != null) { return stack1; }
    else { return ''; }
  },"useData":true});
})()

describe('Application', function() {
    var modules = {
        'app/router': {},
        'app/demo/index': {
            actions: {
                'app.action': function(payload) {
                    expect(payload).to.deep.equal({a: 1});
                    payload.a ++;
                }
            }
        },
        'app/demo/templates': Handlebars.templates['app/demo/templates']
    }, app, getResource;

    before(function() {
        getResource = function(path) {
            return modules[path];
        };
        app = new Drizzle.Application({
            getResource: getResource,
            defaultRegion: document.getElementById('content')
        });
    });

    it('#constructor', function() {
        expect(app).to.include.keys(
            'id', 'options', 'modules', 'global',
            'regions', 'region', 'loaders'
        );

        expect(app.options.getResource).to.equal(getResource);
        expect(app.options.scriptRoot).to.equal('app');

        expect(app.modules).to.be.empty;
        expect(app.global).to.be.empty;

        expect(app.regions).to.have.length(1);
        expect(app.regions[0]).to.be.an.instanceof(Drizzle.Region);
        expect(app.regions[0].el).to.equal(document.getElementById('content'));
        expect(app.region).to.equal(app.regions[0]);

        expect(app.loaders).to.have.all.keys('loader', 'simple');

        expect(app.message).to.have.all.keys('success', 'info', 'error');
    });

    it('#getLoader', function() {
        var defaults = app.loaders.loader, simple = app.loaders.simple;

        expect(app.getLoader('name')).to.equal(defaults);
        expect(app.getLoader('simple:name')).to.equal(simple);
    });

    it('#load', function(done) {
        app.load('demo').then(function(mod) {
            expect(mod[0].name).to.equal('demo')
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

    it('#dispatch', function(done) {
        app.show('demo').then(function() {
            var payload = {a: 1};
            app.dispatch('action', payload);
            expect(payload.a).to.equal(2);

            payload.a = 1;
            app.dispatch({name: 'action', payload: payload});
            expect(payload.a).to.equal(2);
            done();
        });
    });

    it('#startRoute && #navigate', function(done) {
        location.hash = '';
        app.navigate('index');
        expect(location.hash).to.equal('');

        app.startRoute('index', '/').then(function() {
            expect(location.hash).to.equal('#index');

            app.navigate('demo')
            expect(location.hash).to.equal('#demo');

            location.hash = ''
            done();
        })
    })

    after(function() {
        app.destory()
    });

});
