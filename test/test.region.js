(function() {
    /*
        compiled by Handlebars:
        {{#layout}}<div id="layout"></div><div class="a"><p>hello</p></div>{{/layout}}
    */
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
  templates['app/demo/templates'] = template({"1":function(depth0,helpers,partials,data) {
      return "<div id=\"layout\"></div><div class=\"a\"><p>hello</p></div>";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helper, options;

    stack1 = ((helper = (helper = helpers.layout || (depth0 != null ? depth0.layout : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"layout","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0,options) : helper));
    if (!helpers.layout) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
    if (stack1 != null) { return stack1; }
    else { return ''; }
  },"useData":true});
})();

describe('Region', function() {
    var modules = {
        'app/demo/index': {},
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

    it('#show string(module name) & #isCurrent', function(done) {
        var region = app.region,
            el = document.getElementById('content');

        region.show('demo').then(function(mod) {
            var id = mod.layout.id, els;
            expect(el.getAttribute('data-current')).to.equal('demo');
            expect(region.current).to.equal(mod);
            expect(mod.region).to.equal(region);

            expect(region.isCurrent(mod)).to.be.true;
            expect(region.isCurrent('demo')).to.be.true;

            expect(el.innerHTML).to.be.equal('<div id="' + id + 'layout"></div><div class="a"><p>hello</p></div>');

            els = region.$$('.a p');
            expect(els).to.have.length(1);
            expect(els[0].innerHTML).to.equal('hello');
            done();
        });
    });

    it('#show object(module or view)', function(done) {
        var region = app.region,
            mod = new Drizzle.Module('demo', app, app.getLoader('demo'), {}),
            el = document.getElementById('content'),
            id = mod.layout.id;

        region.show(mod).then(function(m) {
            expect(m).to.equal(mod);
            expect(el.innerHTML).to.be.equal('<div id="' + id + 'layout"></div><div class="a"><p>hello</p></div>');
            done();
        })
    });

    it('#close', function(done) {
        var region = app.region,
            mod = new Drizzle.Module('demo', app, app.getLoader('demo'), {}),
            el = document.getElementById('content');

        region.Promise.chain(region.show(mod), region.close, function() {
            expect(el.innerHTML).to.equal('');
            expect(region.current).to.be.undefined;
            expect(region.isCurrent(mod)).to.be.false;
            done();
        });
    });

    it('#delegate dom event', function() {
        var region = app.region,
            obj = { id: 'V1' },
            i = 0,
            el = document.getElementById('content'),
            o1 = Drizzle.Adapter.delegateDomEvent,
            o2 = Drizzle.Adapter.undelegateDomEvents;

        Drizzle.Adapter.delegateDomEvent = function(e, name, selector, fn) {
            expect(e).to.equal(el);
            expect(name).to.equal('click.events' + region.id + obj.id);
            i ++;
        }

        Drizzle.Adapter.undelegateDomEvents = function(e, namespace) {
            expect(e).to.equal(el);
            expect(namespace).to.equal('.events' + region.id + obj.id);
            i ++;
        }

        region.delegateDomEvent(obj, 'click', '.a', null);
        region.undelegateDomEvents(obj);

        expect(i).to.equal(2);

        Drizzle.Adapter.delegateDomEvent = o1;
        Drizzle.Adapter.undelegateDomEvents = o2;
    });

    after(function() {
        app.destory()
    });

});
