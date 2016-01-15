describe('Promise', function() {
    var context = {
            name: 'jaco',
            hello: function() { return 'hello ' + this.name; }
    }, promise, delay = function(time, value) {
        return promise.create(function(resolve) {
            setTimeout(function() { resolve(value); }, time);
        });
    };

    before(function() {
        promise = new Drizzle.Promise(context)
    });

    describe('#create', function() {
        it('should be resolved', function(done) {
            promise.create(function(resolve) {
                setTimeout(function() { resolve(1); }, 20)
            }).then(function(obj) {
                expect(obj).to.equal(1);
                done();
            });
        });

        it('should be rejected', function(done) {
            promise.create(function(resolve, reject) {
                setTimeout(function() { reject(1); }, 20)
            }).then(null, function(obj) {
                expect(obj).to.equal(1);
                done();
            });
        });
    });

    describe('#resolve & #reject', function() {
        it('should be resolved', function(done) {
            promise.resolve(1).then(function(obj) {
                expect(obj).to.equal(1);
                done();
            })
        });

        it('should be rejected', function(done) {
            promise.reject(1).then(null, function(obj) {
                expect(obj).to.equal(1);
                done();
            })
        });
    });

    describe('#parallel', function() {
        it('should receive same arguments', function(done) {
            promise.parallel([function(a, b) {
                expect(this).to.equal(context);
                expect(a).to.equal(1);
                expect(b).to.equal(2);
                return 3;
            }, function(a, b) {
                expect(this).to.equal(context);
                expect(a).to.equal(1);
                expect(b).to.equal(2);
                return 4;
            }], 1, 2).then(function(args) {
                expect(args.length).to.equal(2);
                expect(args[0]).to.equal(3);
                expect(args[1]).to.equal(4);
                done();
            });
        });
    });

    describe('#chain', function() {
        it('should be executed one by one', function(done) {
            promise.chain(function() {
                expect(this).to.equal(context);
                expect(this.hello()).to.equal('hello jaco');
                return 1;
            }, function(obj) {
                expect(this).to.equal(context);
                expect(this.hello()).to.equal('hello jaco');
                expect(obj).to.equal(1);
                return 2;
            }, function(obj) {
                expect(this).to.equal(context);
                expect(this.hello()).to.equal('hello jaco');
                expect(obj).to.equal(2);
                return 3;
            }).then(function(obj) {
                expect(this).to.equal(window);
                expect(obj).to.equal(3);
                done();
            });
        });

        it('none thenable objects will pass through directly', function(done) {
            promise.chain(1).then(function(obj) {
                expect(obj).to.equal(1);
            });

            promise.chain(true, function(obj) {
                expect(obj).to.equal(true);
            });

            promise.chain(1, 2, 3, function(obj) {
                expect(obj).to.equal(3);
                done();
            })
        });

        it('should wait for previous item resolved', function(done) {
            promise.chain(delay(20, 1), function(obj) {
                expect(obj).to.equal(1);
                return delay(20, false);
            }, function(obj) {
                expect(obj).to.equal(false);
                done();
            });
        });

        it('should be called in scope "context"', function(done) {
            promise.chain(context.hello, function(obj) {
                expect(obj).to.equal('hello jaco');
                expect(this).to.equal(context);
                done();
            })
        });

        it('they should be called parallelly', function(done) {
            var result = [];
            promise.chain('value', [function(v) {
                var p = delay(30, 1);
                expect(v).to.equal('value');
                p.then(function(obj) { result.push(obj); });
                return p;
            }, function(v) {
                var p = delay(10, 2);
                expect(v).to.equal('value');
                p.then(function(obj) { result.push(obj); });
                return p;
            }, function(v) {
                var p = delay(20, 3);
                expect(v).to.equal('value');
                p.then(function(obj) { result.push(obj); });
                return p;
            }], function(obj) {
                expect(obj).to.deep.equal([1, 2, 3]);
                expect(result).to.deep.equal([2, 3, 1]);
                done();
            });
        });

        it('should be interupted', function(done) {
            var i = 0;
            promise.chain(function() {
                i ++;
            }, function() {
                return promise.reject(1);
            }, function() {
                i ++;
            }).then(null, function(obj) {
                expect(i).to.equal(1);
                expect(obj).to.equal(1);
                done();
            })
        })
    });
});
