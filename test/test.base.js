describe('Base', function() {

    it('#constructor', function(done) {
        var a = {a: 1}, id = Drizzle.uniqueId(), b = new Drizzle.Base('a', a);
        expect(b.options).to.equal(a);
        expect(b.id).to.equal('a' + (Number(id) + 1));

        expect(b.Promise.chain(function() {
            expect(this).to.equal(b);
            done();
        }));
    });

    it('#option', function() {
        var b, options = {
            a: 1,
            b: function() {
                expect(this).to.equal(b);
                return 'b';
            }
        };

        b = new Drizzle.Base('a', options);

        expect(b.option('a')).to.equal(1);
        expect(b.option('b')).to.equal('b');
    });

    it('#error', function() {
        var b = new Drizzle.Base('a', {});

        try {
            b.error('message');
        } catch (e) {
            expect(e.message).to.equal('[] message');
        }

        b.name = 'name'
        try {
            b.error('message');
        } catch (e) {
            expect(e.message).to.equal('[name] message');
        }

        b.module = { name: 'module' };
        try {
            b.error('message');
        } catch (e) {
            expect(e.message).to.equal('[module:name] message');
        }
    });

    it('#mixin', function() {
        var b = new Drizzle.Base('a', {}), tmp = b.error;

        b.mixin({
            a: 'a',
            error: function(su, message) {
                expect(su).to.equal(tmp);
                su.call(this, message + ' from mixin');
            },
            hello: function(name) {
                return 'hello ' + name;
            }
        });

        expect(b.a).to.equal('a');
        expect(b.hello('jaco')).to.equal('hello jaco');

        try {
            b.error('message');
        } catch (e) {
            expect(e.message).to.equal('[] message from mixin');
        }
    });
})
