/*
 compiled by Handlebars:
 {{#layout}}
    <div data-region="a"></div>
    <div data-region="b"></div>
{{/layout}}
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['app/demo/templates'] = template({"1":function(depth0,helpers,partials,data) {
    return "    <div data-region=\"a\"></div>\n    <div data-region=\"b\"></div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, options;

  stack1 = ((helper = (helper = helpers.layout || (depth0 != null ? depth0.layout : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"layout","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0,options) : helper));
  if (!helpers.layout) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"useData":true});
})();

describe('Module', function() {
    var modules = {
        'app/demo/view-item': {},
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
        Drizzle.Adapter.ajax = function() {
            return app.Promise.resolve('aa');
        }
    });

    it('should be instanced correctly', function(done) {
        var i = 0, mod = new Drizzle.Module('demo', app, app.getLoader('demo'), {items: {
            item: 'a'
        }, store: {
            demo: {autoLoad: true},
            foo: {autoLoad: 'after'}
        }, mixin: {
            a: 1,
            b: function() {
                return 'b';
            },
            render: function(su, options) {
                var result;
                expect(su).to.be.a.function;
                result = su.call(this, options);
                expect(options.a).to.equal(1);
                expect(options).to.equal(this.renderOptions);
                i ++;
                return result;
            },
            renderItems: function(su) {
                expect(this.store.demo.data).to.equal('aa');
                i ++;
                return su.call(this);
            }
        }});

        mod.loadedPromise.then(function() {
            expect(mod.a).to.equal(1);
            expect(mod.b).to.be.a.function;
            expect(mod.b()).to.equal('b');

            expect(mod.layout).to.be.an.instanceof(Drizzle.Module.Layout);

            expect(mod.store.demo).to.be.an.instanceof(Drizzle.Model);
            expect(mod.store.foo).to.be.an.instanceof(Drizzle.Model);

            expect(mod.items.item).to.be.an.instanceof(Drizzle.View);

            app.show(mod, {a: 1}).then(function() {
                expect(i).to.equal(2);
                expect(mod.store.foo.data).to.equal('aa');

                expect(mod.regions.a).to.be.an.instanceof(Drizzle.Region);
                expect(mod.regions.a.current).to.equal(mod.items.item);
                done();
            });
        });
    });

    it('#dispatch', function() {
        var i = 0, mod = new Drizzle.Module('demo', app, app.getLoader('demo'), { actions: {
            demo: function(payload) {
                i ++;
                expect(payload.foo).to.equal('aa');
            }
        }});

        mod.dispatch('demo', {foo: 'aa'});
        expect(i).to.equal(1);

        mod.dispatch({name: 'demo', payload: {foo: 'aa'}});
        expect(i).to.equal(2);
    });

    it('#close', function(done) {
        var mod = new Drizzle.Module('demo', app, app.getLoader('demo')),
            region = app.region;

        region.Promise.chain(region.show(mod), region.close, function() {
            expect(mod.region).to.be.undefined;
            expect(mod.regions).to.be.undefined;
            done();
        });
    });

    after(function() {
        app.destory();
        Drizzle.Adapter.ajax = null;
    });

});
