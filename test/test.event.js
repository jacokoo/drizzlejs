describe('Event', function() {

    describe('Event itself', function() {
        var app;

        beforeEach(function() {
            app = Object.assign({}, Drizzle.Event);
        });

        it('should be triggered', function() {
            var i = 0, h = function(obj) {
                expect(obj).to.equal(1);
                i ++;
            };
            app.on('a', h);

            expect(app._events).to.have.key('a')
            expect(app._events.a).to.have.length(1).is.an.array;
            expect(app._events.a[0].fn).to.equal(h);

            app.trigger('a', 1);
            app.trigger('a', 1);
            expect(i).to.equal(2);
        });

        it('should be binded', function() {
            var ctx = {name: 'jaco'}, i = 0, h = function() {
                expect(this.name).to.equal('jaco');
                expect(this).to.equal(ctx);
                i ++;
            };

            app.on('a', h, ctx);
            app.trigger('a');
            expect(i).to.equal(1);
        });

        it('should be called with arguments', function() {
            var i = 0, h = function(a, b) {
                expect(a).to.equal(1);
                expect(b).to.equal('b')
                i ++;
            };
            app.on('a', h);
            app.trigger('a', 1, 'b');
            expect(i).to.equal(1);
        });

        it('should be detached(context)', function() {
            var ctx = {name: 'jaco'}, i = 0, h = function() {
                i ++;
            };

            app.on('a', h, ctx);
            app.on('a', h);
            app.on('b', h, ctx);

            app.trigger('a');
            app.trigger('b');
            expect(i).to.equal(3);

            app.off('a', h, ctx);   // context don't matter anything
            app.trigger('a');
            app.trigger('b')
            expect(i).to.equal(4);
        });

        it('should be detached(listener)', function() {
            var ctx = {name: 'jaco'}, i = 0, h = function() {
                i ++;
            };

            app.on('a', h, ctx);
            app.on('a', h);
            app.on('b', h, ctx);

            app.trigger('a');
            app.trigger('b');
            expect(i).to.equal(3);

            app.off('a', h);
            app.trigger('a');
            app.trigger('b')
            expect(i).to.equal(4);
        });

        it('should be detached(name)', function() {
            var ctx = {name: 'jaco'}, i = 0, h = function() {
                i ++;
            };

            app.on('a', h, ctx);
            app.on('a', h);
            app.on('b', h, ctx);

            app.trigger('a');
            app.trigger('b');
            expect(i).to.equal(3);

            app.off('a');
            app.trigger('a');
            app.trigger('b')
            expect(i).to.equal(4);
        });

    });

    describe('Event delegation', function() {
        var app, target, target2;

        beforeEach(function() {
            app = Object.assign({}, Drizzle.Event);
            target = { id: 't1', name: 'target'};
            target2 = { id: 't2', name: 'target2'};
            app.delegateEvent(target);
            app.delegateEvent(target2);
        });

        it('should be attached to event object', function() {
            var i = 0, h = function() {
                expect(this).to.equal(target);
                i ++;
            };

            target.on('a', h);
            expect(app._events).to.have.key('a--t1');
            expect(app._events['a--t1'][0].fn).to.equal(h);

            target.trigger('a');
            expect(i).to.equal(1);
        });

        it('should be detached from event object', function() {
            var i = 0, h = function() {
                expect(this).to.equal(target);
                i ++;
            }, h2 = function() {
                i ++;
            };

            target.on('a', h);
            target.on('a', h2);
            target.trigger('a');
            expect(i).to.equal(2);

            target.off('a', h)
            target.trigger('a');
            expect(i).to.equal(3);
        });

        it('#listenTo', function() {
            var i = 0, h = function(obj) {
                expect(this).to.equal(target);
                expect(obj).to.equal(1);
                i ++;
            };

            target.listenTo(target2, 'a', h);
            target2.trigger('a', 1);
            expect(i).to.equal(1);
        });

        it('#stopListening', function() {
            var i = 0, h = function() {
                expect(this).to.equal(target);
                i ++;
            }, h2 = function() {
                i ++;
            }, target3 = { id: 't3', name: 'target3' }, trigger = function(name) {
                target2.trigger(name);
                target3.trigger(name);
            };

            app.delegateEvent(target3);


            target.listenTo(target2, 'a', h);
            target.listenTo(target2, 'a', h);
            target.listenTo(target2, 'a', h2);
            target.listenTo(target2, 'b', h);

            target.listenTo(target3, 'a', h)
            target.listenTo(target3, 'a', h2);
            target.listenTo(target3, 'b', h);

            trigger('a');
            trigger('b');
            expect(i).to.equal(7);

            target.stopListening(target2, 'a', h2);
            trigger('a');
            trigger('b');
            expect(i).to.equal(13);

            target.stopListening(target2, 'a');
            trigger('a');
            trigger('b');
            expect(i).to.equal(17);

            target.stopListening(target2);
            trigger('a');
            trigger('b');
            expect(i).to.equal(20);

            target.stopListening()
            trigger('a');
            trigger('b');
            expect(i).to.equal(20);
        });

    });
});
