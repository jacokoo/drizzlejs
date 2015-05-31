describe('Factory', function() {

    it('should create object correctly', function() {
        var A = function(name) { this.type = 'A'; this.name = name; },
            B = function(name) { this.type = 'B'; this.name = name; },
            a, b;

        Drizzle.assign(A, Drizzle.Factory);
        A.register('b', B);

        b = A.create('b', 'BB');
        expect(b).is.an.instanceof(B);
        expect(b.name).to.equal('BB');

        a = A.create(null, 'AA');
        expect(a).is.an.instanceof(A);
        expect(a.name).to.equal('AA');
    })

});
