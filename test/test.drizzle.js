describe('Drizzle', function() {
    var d = Drizzle;

    it('type determination', function() {
        var values = [function() {}, {}, [], 'a', 1, null, undefined, false, true],
            i, result = [];

        for (i = 0; i < values.length; i ++) {
            result.push(d.isFunction(values[i]));
        }
        expect(result).to.deep.equals([true, false, false, false, false, false, false, false, false]);

        result = [];
        for (i = 0; i < values.length; i ++) {
            result.push(d.isString(values[i]));
        }
        expect(result).to.deep.equals([false, false, false, true, false, false, false, false, false]);

        result = [];
        for (i = 0; i < values.length; i ++) {
            result.push(d.isObject(values[i]));
        }
        expect(result).to.deep.equals([false, true, false, false, false, false, false, false, false]);

        result = [];
        for (i = 0; i < values.length; i ++) {
            result.push(d.isArray(values[i]));
        }
        expect(result).to.deep.equals([false, false, true, false, false, false, false, false, false]);
    });

    it('#uniqueId', function() {
        var id = d.uniqueId();
        expect(id).to.be.string;
        expect(d.uniqueId()).to.be.equals((Number(id) + 1) + '');
        expect(d.uniqueId('hello')).to.be.equals('hello' + (Number(id) + 2));
    });

    it('#assign', function() {
        var a = {};
        expect(d.assign(null, {a: 1})).to.be.null;
        expect(d.assign({}, {a: 1, b: 2}, {c: 3})).to.deep.equals({a: 1, b: 2, c: 3});
        expect(d.assign(a)).to.be.equals(a).and.not.have.keys;
        expect(d.assign(a, {a: 1})).to.be.equals(a).and.deep.equals({a: 1});
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
        expect(b.a).to.be.equals('a');
        expect(b.b).to.be.equals('b');
        expect(b.hello()).to.be.equals('hello jacokoo');
        expect(b.echo()).to.be.equals('b');
        expect(B.echo()).to.be.equals('static a');
    });

});
