describe('Base', function() {

    it('#constructor', function(done) {
        var a = {a: 1}, id = Drizzle.uniqueId(), b = new Drizzle.Base('name', a, { hello: 'world' });
        expect(b.options).to.equal(a);
        expect(b.id).to.equal('D' + (Number(id) + 1));
        expect(b.name).to.equal('name');
        expect(b.hello).to.equal('world');

        expect(b.Promise.chain(function() {
            expect(this).to.equal(b);
            done();
        }));
    });

    it('#option', function() {
        var b, options = {
            a: 1,
            b: function(c) {
                expect(this).to.equal(b);
                expect(c).to.equal(2);
                return 'b';
            }
        };

        b = new Drizzle.Base('a', options);

        expect(b._option('a')).to.equal(1);
        expect(b._option('b', 2)).to.equal('b');
    });

    it('#error', function() {
        var b = new Drizzle.Base('name', {});

        try {
            b._error('message', 'hello');
        } catch (e) {
            expect(e.message).to.equal('[name] message hello');
        }

        b.module = { name: 'module' };
        try {
            b._error('message', 'world');
        } catch (e) {
            expect(e.message).to.equal('[module:name] message world');
        }
    });

    it('#mixin', function() {
        var b = new Drizzle.Base('a', {}), tmp = b._error;

        b._mixin({
            a: 'a',
            _error: function(su, message) {
                expect(su).to.equal(tmp);
                expect(this).to.equal(b);
                expect(message).to.equal('message');
                su.call(this, message, 'from mixin');
            },
            hello: function(name) {
                return 'hello ' + name;
            }
        });

        expect(b.a).to.equal('a');
        expect(b.hello('jaco')).to.equal('hello jaco');

        try {
            b._error('message');
        } catch (e) {
            expect(e.message).to.equal('[a] message from mixin');
        }
    });
})
