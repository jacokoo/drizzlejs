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

    it('#assign', function() {
        var a = {}, tmp;
        expect(d.assign(null, {a: 1})).to.be.null;
        expect(d.assign({}, {a: 1, b: 2}, {c: 3})).to.deep.equal({a: 1, b: 2, c: 3});
        expect(d.assign(a)).to.equal(a).and.not.have.keys;
        expect(d.assign(a, {a: 1})).to.equal(a).and.deep.equal({a: 1});

        tmp = Array.prototype.map;
        Array.prototype.map = null;
        expect(d.assign({}, {a: 1}, {b: 2})).to.deep.equal({a: 1, b: 2});
        Array.prototype.map = tmp;
    });

    it('#extend', function() {
        var A = function(firstname) {
            this.a = 'a'
            this.firstname = firstname;
        }, B = function(firstname, lastname) {
            this.b = 'b';
            this.lastname = lastname;
            B.__super__.constructor.call(this, firstname);
        }, b;

        A.echo = function() { return 'static a'; };
        A.prototype.echo = function() {return this.a;};

        d.extend(B, A, {
            hello: function() {return 'hello ' + this.firstname + this.lastname},
            echo: function() {return this.b}
        });

        b = new B('jaco', 'koo');
        expect(b.a).to.equal('a');
        expect(b.b).to.equal('b');
        expect(b.hello()).to.equal('hello jacokoo');
        expect(b.echo()).to.equal('b');
        expect(B.echo()).to.equal('static a');
    });

});
