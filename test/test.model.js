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

describe('Model & Request', function() {
    var modules = {
        'app/demo/index': {},
        'app/demo/templates': Handlebars.templates['app/demo/templates'],
        'app/foo/index': {
            urlPrefix: 'prefix'
        },
        'app/foo/templates': Handlebars.templates['app/demo/templates']
    }, app, getResource;

    before(function() {
        getResource = function(path) {
            return modules[path];
        };
        app = new Drizzle.Application({
            getResource: getResource,
            defaultRegion: document.getElementById('content'),
            urlRoot: 'api',
            urlSuffix: '.json'
        });
    });

    it('#constructor', function(done) {
        app.show('demo').then(function(mod) {
            var demo = new Drizzle.Model(app, mod, {
                url: 'foo', data: {name: 'foo'}
            }), demos = new Drizzle.Model(app, mod, {
                url: 'bar', data: [{id: 1, name: 'bar'}], params: {name: 'bar'}
            });

            expect(demo).is.an.instanceof(Drizzle.Model);
            expect(demos).is.an.instanceof(Drizzle.Model);

            expect(demo.data).to.have.keys('name').and.is.an.object;
            expect(demo.data.name).to.equal('foo');

            expect(demos.data).to.have.length(1).and.is.an.array;
            expect(demos.data[0]).to.deep.equal({id: 1, name: 'bar'});

            expect(demos.params).to.deep.equal({name: 'bar'});
            expect(demos.getParams()).to.not.equal(demos.params);
            expect(demos.getParams()).to.deep.equal(demos.params);

            done();
        });
    });

    it('#url', function(done) {
        app.show('demo').then(function(mod) {
            var demo = new Drizzle.Model(app, mod, { url: 'foo' }),
                demo2 = new Drizzle.Model(app, mod),
                demo3 = new Drizzle.Model(app, mod, { data: {id: 1} }),
                demo4 = new Drizzle.Model(app, mod, { data: {name: 1}, idKey: 'name' });

            expect(demo.url()).to.equal('foo');
            expect(demo.getFullUrl()).to.equal('api/demo/foo.json');

            expect(demo2.url()).to.equal('');
            expect(demo2.getFullUrl()).to.equal('api/demo.json');

            expect(demo3.getFullUrl()).to.equal('api/demo/1.json');
            expect(demo4.getFullUrl()).to.equal('api/demo/1.json');
            done();
        });
    });

    it('#url with url-prefix', function(done) {
        app.show('foo').then(function(mod) {
            var demo = new Drizzle.Model(app, mod),
                demo2 = new Drizzle.Model(app, mod, {url: '../hello'}),
                demo3 = new Drizzle.Model(app, mod, {url: '../../hello'});
                demo4 = new Drizzle.Model(app, mod, {url: '../../../hello'});
                demo5 = new Drizzle.Model(app, mod, {url: '../../../../../hello'});

            expect(demo.getFullUrl()).to.equal('api/prefix/foo.json');
            expect(demo2.getFullUrl()).to.equal('api/prefix/hello.json');
            expect(demo3.getFullUrl()).to.equal('api/hello.json');
            expect(demo4.getFullUrl()).to.equal('hello.json');
            expect(demo5.getFullUrl()).to.equal('hello.json');
            done();
        })
    });

    it('#set', function(done) {
        app.show('foo').then(function(mod) {
            var data = {name: 'foo'},
                demo = new Drizzle.Model(app, mod),
                demo2 = new Drizzle.Model(app, mod, {
                    parse: function(data) {
                        expect(this).to.equal(demo2);
                        data.name = 'parse'
                        return data;
                    }
                }),
                demo3 = new Drizzle.Model(app, mod, {
                    root: 'item'
                });

            demo.set(data);
            expect(demo.data).to.equal(data);

            demo2.set(data);
            expect(demo2.data).to.deep.equal({name: 'parse'});

            demo3.set({ name: 'foo', item: {name: 'bar'}});
            expect(demo3.data).to.deep.equal({name: 'bar'});

            demo.set([{name: 'foo'}, {name: 'bar'}]);
            expect(demo.data).to.have.length(2).and.is.an.array;

            done();
        });
    });

    it('#clear', function(done) {
        app.show('foo').then(function(mod) {
            var demo = new Drizzle.Model(app, mod, {
                data: {name: 'foo'}
            });

            demo.clear();
            expect(demo.data).to.be.empty.and.is.an.object;

            demo.set([{name: 'foo'}, {name: 'bar'}]);
            demo.clear();
            expect(demo.data).to.be.empty.and.is.an.array;

            done();
        });
    });

    it('#change', function(done) {
        app.show('foo').then(function(mod) {
            var i = 0, demo = new Drizzle.Model(app, mod);
                demo.on('change', function() {
                    i ++;
                });

            demo.set({a: 1}, true);
            demo.clear(true);
            demo.changed();

            expect(i).to.equal(3);

            done();
        });
    })


    describe('Request', function() {
        it('#get', function(done) {
            app.show('foo').then(function(mod) {
                var i = 0, demo = new Drizzle.Model(app, mod);
                Drizzle.Adapter.ajax = function(options) {
                    expect(options).to.deep.equal({type: 'GET', url: 'api/prefix/foo.json', data: {}});
                    return demo.Promise.resolve({name: 'foo', id: 1});
                };

                demo.on('change', function() {
                    i ++;
                })

                Drizzle.Request.get(demo).then(function() {
                    expect(demo.data).to.deep.equal({name: 'foo', id: 1});
                    expect(i).to.equal(1);
                    done();
                });
            });
        });

        it('#get with params and id', function(done) {
            app.show('foo').then(function(mod) {
                var i = 0, demo = new Drizzle.Model(app, mod, {
                    data: {id: 1}, params: {name: 'foo'}
                });
                Drizzle.Adapter.ajax = function(options) {
                    expect(options).to.deep.equal({type: 'GET', url: 'api/prefix/foo/1.json', data: {
                        name: 'foo'
                    }});
                    return demo.Promise.resolve({name: 'foo', id: 1});
                };

                demo.on('change', function() {
                    i ++;
                })

                Drizzle.Request.get(demo).then(function() {
                    expect(demo.data).to.deep.equal({name: 'foo', id: 1});
                    expect(i).to.equal(1);
                    done();
                });
            });
        });

        it('#put', function(done) {
            app.show('foo').then(function(mod) {
                var i = 0, demo = new Drizzle.Model(app, mod, {
                    data: {id: 1}, params: {name: 'foo'}
                });
                Drizzle.Adapter.ajax = function(options) {
                    expect(options).to.deep.equal({type: 'PUT', url: 'api/prefix/foo/1.json', data: {
                        id: 1
                    }});
                    return demo.Promise.resolve({name: 'foo', id: 1});
                };

                demo.on('change', function() {
                    i ++;
                })

                Drizzle.Request.put(demo).then(function() {
                    expect(demo.data).to.deep.equal({name: 'foo', id: 1});
                    expect(i).to.equal(1);
                    done();
                });
            });
        });

        it('#post', function(done) {
            app.show('foo').then(function(mod) {
                var i = 0, demo = new Drizzle.Model(app, mod, {
                    data: {name: 'name', age: 1}, params: {name: 'foo'}
                });
                Drizzle.Adapter.ajax = function(options) {
                    expect(options).to.deep.equal({type: 'POST', url: 'api/prefix/foo.json', data: {
                        name: 'name', age: 1
                    }});
                    return demo.Promise.resolve({name: 'foo', id: 1});
                };

                demo.on('change', function() {
                    i ++;
                })

                Drizzle.Request.post(demo).then(function() {
                    expect(demo.data).to.deep.equal({name: 'foo', id: 1});
                    expect(i).to.equal(1);
                    done();
                });
            });
        });

        it('#delete', function(done) {
            app.show('foo').then(function(mod) {
                var i = 0, demo = new Drizzle.Model(app, mod, {
                    data: {name: 'name', age: 1}, params: {name: 'foo'}
                });
                Drizzle.Adapter.ajax = function(options) {
                    expect(options).to.deep.equal({type: 'DELETE', url: 'api/prefix/foo.json', data: {
                        name: 'name', age: 1
                    }});
                    return demo.Promise.resolve({name: 'foo', id: 1});
                };

                demo.on('change', function() {
                    i ++;
                })

                Drizzle.Request.del(demo).then(function() {
                    expect(demo.data).to.deep.equal({name: 'foo', id: 1});
                    expect(i).to.equal(1);
                    done();
                });
            });
        });

        it('#save without id', function(done) {
            app.show('foo').then(function(mod) {
                var i = 0, demo = new Drizzle.Model(app, mod, {
                    data: {name: 'name', age: 1}, params: {name: 'foo'}
                });
                Drizzle.Adapter.ajax = function(options) {
                    expect(options).to.deep.equal({type: 'POST', url: 'api/prefix/foo.json', data: {
                        name: 'name', age: 1
                    }});
                    return demo.Promise.resolve({name: 'foo', id: 1});
                };

                demo.on('change', function() {
                    i ++;
                })

                Drizzle.Request.save(demo).then(function() {
                    expect(demo.data).to.deep.equal({name: 'foo', id: 1});
                    expect(i).to.equal(1);
                    done();
                });
            });
        });

        it('#save with id', function(done) {
            app.show('foo').then(function(mod) {
                var i = 0, demo = new Drizzle.Model(app, mod, {
                    data: {id: 1}, params: {name: 'foo'}
                });
                Drizzle.Adapter.ajax = function(options) {
                    expect(options).to.deep.equal({type: 'PUT', url: 'api/prefix/foo/1.json', data: {
                        id: 1
                    }});
                    return demo.Promise.resolve({name: 'foo', id: 1});
                };

                demo.on('change', function() {
                    i ++;
                })

                Drizzle.Request.save(demo).then(function() {
                    expect(demo.data).to.deep.equal({name: 'foo', id: 1});
                    expect(i).to.equal(1);
                    done();
                });
            });
        });

        it('#fail', function(done) {
            app.show('foo').then(function(mod) {
                var i = 0, demo = new Drizzle.Model(app, mod, {
                    data: {id: 1}, params: {name: 'foo'}
                });
                Drizzle.Adapter.ajax = function(options) {
                    expect(options).to.deep.equal({type: 'PUT', url: 'api/prefix/foo/1.json', data: {
                        id: 1
                    }});
                    return demo.Promise.reject({name: 'foo', id: 1});
                };

                demo.on('change', function() {
                    i ++;
                })

                Drizzle.Request.save(demo).then(null, function(obj) {
                    expect(obj).to.deep.equal([{name: 'foo', id: 1}]);
                    expect(demo.data).to.deep.equal({id: 1});
                    expect(i).to.equal(0);
                    done();
                });
            });
        });

        afterEach(function() {
            Drizzle.Adapter.ajax = null;
        });
    })

    after(function() {
        app.destory();
    });
});
