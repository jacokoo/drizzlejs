describe('Promise', function() {
    var context = {
            name: 'jaco',
            hello: function() { return 'hello ' + this.name; }
    }, promise = new Drizzle.Promise(context), delay = function(time, value) {
        return promise.create(function(resolve) {
            setTimeout(function() { resolve(value); }, time);
        });
    };

    describe('#create', function() {
        it('should be resolved', function(done) {
            promise.create(function(resolve) {
                setTimeout(function() { resolve(1); }, 20)
            }).then(function(obj) {
                expect(obj).to.be.equals(1);
                done();
            });
        });

        it('should be rejected', function(done) {
            promise.create(function(resolve, reject) {
                setTimeout(function() { reject(1); }, 20)
            }).then(null, function(obj) {
                expect(obj).to.be.equals(1);
                done();
            });
        });
    });

    describe('#resolve & #reject', function() {
        it('should be resolved', function(done) {
            promise.resolve(1).then(function(obj) {
                expect(obj).to.be.equals(1);
                done();
            })
        });

        it('should be rejected', function(done) {
            promise.reject(1).then(null, function(obj) {
                expect(obj).to.be.equals(1);
                done();
            })
        });
    });

    describe('#when', function() {
        it('should return a resolved thenable object', function(done) {
            var p = promise.when(1);
            expect(p.then).to.be.a.function;
            p.then(function(obj) {
                expect(obj).to.be.equals(1);
                done()
            });
        });

        it('the function should be called', function(done) {
            promise.when(function(obj) {
                expect(obj).to.be.equals('a');
                expect(this).to.be.equals(context);
                expect(this.hello()).to.be.equals('hello jaco');
                return 'returned'
            }, 'a').then(function(obj) {
                expect(obj).to.be.equals('returned');
                done();
            });
        });
    });

    describe('#chain', function() {
        it('should be executed one by one', function(done) {
            promise.chain(function() {
                expect(this).to.be.equals(context);
                expect(this.hello()).to.be.equals('hello jaco');
                return 1;
            }, function(obj) {
                expect(this).to.be.equals(context);
                expect(this.hello()).to.be.equals('hello jaco');
                expect(obj).to.be.equals(1);
                return 2;
            }, function(obj) {
                expect(this).to.be.equals(context);
                expect(this.hello()).to.be.equals('hello jaco');
                expect(obj).to.be.equals(2);
                return 3;
            }).then(function(obj) {
                expect(this).to.be.equals(window);
                expect(obj).to.be.equals(3);
                done();
            });
        });

        it('not thenable objects will pass through directly', function(done) {
            promise.chain(1).then(function(obj) {
                expect(obj).to.be.equals(1);
            });

            promise.chain(true, function(obj) {
                expect(obj).to.be.equals(true);
            });

            promise.chain(1, 2, 3, function(obj) {
                expect(obj).to.be.equals(3);
                done();
            })
        });

        it('should wait for previous item resolved', function(done) {
            promise.chain(delay(20, 1), function(obj) {
                expect(obj).to.be.equals(1);
                return delay(20, false);
            }, function(obj) {
                expect(obj).to.be.equals(false);
                done();
            });
        });

        it('should be called in scope "context"', function(done) {
            promise.chain(context.hello, function(obj) {
                expect(obj).to.be.equals('hello jaco');
                expect(this).to.be.equals(context);
                done();
            })
        });

        it('they should be called parallelly', function(done) {
            var result = [];
            promise.chain('value', [function(v) {
                var p = delay(30, 1);
                expect(v).to.be.equals('value');
                p.then(function(obj) { result.push(obj); });
                return p;
            }, function(v) {
                var p = delay(10, 2);
                expect(v).to.be.equals('value');
                p.then(function(obj) { result.push(obj); });
                return p;
            }, function(v) {
                var p = delay(20, 3);
                expect(v).to.be.equals('value');
                p.then(function(obj) { result.push(obj); });
                return p;
            }], function(obj) {
                expect(obj).to.deep.equals([1, 2, 3]);
                expect(result).to.deep.equals([2, 3, 1]);
                done();
            });
        });
    });
});
