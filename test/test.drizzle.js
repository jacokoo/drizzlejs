describe('Drizzle', function() {
    var d;

    before(function() {
        d = Drizzle;
    });

    it('type determination', function() {
        var values = [function() {}, {}, [], 'a', 1, null, undefined, false, true],
            i, result = [];

        for (i = 0; i < values.length; i ++) {
            result.push(d.isFunction(values[i]));
        }
        expect(result).to.deep.equal([true, false, false, false, false, false, false, false, false]);

        result = [];
        for (i = 0; i < values.length; i ++) {
            result.push(d.isString(values[i]));
        }
        expect(result).to.deep.equal([false, false, false, true, false, false, false, false, false]);

        result = [];
        for (i = 0; i < values.length; i ++) {
            result.push(d.isObject(values[i]));
        }
        expect(result).to.deep.equal([false, true, false, false, false, false, false, false, false]);

        result = [];
        for (i = 0; i < values.length; i ++) {
            result.push(d.isArray(values[i]));
        }
        expect(result).to.deep.equal([false, false, true, false, false, false, false, false, false]);
    });

    it('#uniqueId', function() {
        var id = d.uniqueId();
        expect(id).to.be.string;
        expect(d.uniqueId()).to.equal((Number(id) + 1) + '');
        expect(d.uniqueId('hello')).to.equal('hello' + (Number(id) + 2));
    });

    it('#adapter', function() {
        var h = function() {};
        Drizzle.adapt({ h: h});
        expect(Drizzle.Adapter.h).to.equal(h);
    });

    it('#extend', function() {
        var A = function(name) {
            this.name = name;
        };
        A.a = 'a';
        A.prototype.hello = function() { return 'hello ' + this.name; };

        var B = function(name) {
            B.__super__.constructor.call(this, name);
        };

        Drizzle.extend(B, A, {
            greet: function() {
                return 'hi ' + this.name;
            }
        });

        var b = new B('b');
        expect(B.a).to.equal('a');
        expect(b).to.be.an.instanceof(A);
        expect(b.hello()).to.equal('hello b');
        expect(b.greet()).to.equal('hi b');
    });
});
