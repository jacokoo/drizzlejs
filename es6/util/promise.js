D.Promise = class Promiser {
    constructor (context) {
        this.context = context;
    }

    create (fn) {
        return new D.Adapter.Promise((resolve, reject) => {
            fn.call(this.context, resolve, reject);
        });
    }

    resolve (data) {
        return D.Adapter.Promise.resolve(data);
    }

    reject (data) {
        return D.Adapter.Promise.reject(data);
    }

    parallel (items, ...args) {
        return this.create((resolve, reject) => {
            let result = [], thenables = [], indexMap = {};
            map(items, (item, i) => {
                let value = D.isFunction(item) ? item.apply(this.context, args) : item;
                if (value && value.then) {
                    indexMap[thenables.length] = i;
                    thenables.push(value);
                } else {
                    result[i] = value;
                }
            });

            if (thenables.length === 0) return resolve(result);

            D.Adapter.Promise.all(thenables).then((args) => {
                mapObj(indexMap, (key, value) => result[value] = args[key]);
                resolve(result);
            }, (args) => {
                reject(args);
            });
        });
    }

    chain (...args) {
        let prev = null,
            doRing = (rings, ring, resolve, reject) => {
                let nextRing = (data) => {
                    prev = data;
                    rings.length === 0 ? resolve(prev) : doRing(rings, rings.shift(), resolve, reject);
                }

                if (D.isArray(ring)) {
                    ring.length > 0 ? this.parallel(ring, ...(prev != null ? [prev] : [])).then(nextRing, reject) : nextRing([]);
                } else {
                    let value = D.isFunction(ring) ? ring.apply(this.context, prev != null ? [prev] : []) : ring;
                    value && value.then ? value.then(nextRing, reject) : nextRing(value);
                }
            };

        if (args.length === 0) return this.resolve();

        return this.create((resolve, reject) => {
            doRing(args, resolve, reject, args.shift(), 0);
        });
    }
};
