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
            const result = [], thenables = [], indexMap = {};
            map(items, (item, i) => {
                const value = D.isFunction(item) ? item.apply(this.context, args) : item;
                if (value && value.then) {
                    indexMap[thenables.length] = i;
                    thenables.push(value);
                } else {
                    result[i] = value;
                }
            });

            if (thenables.length === 0) return resolve(result);

            D.Adapter.Promise.all(thenables).then((as) => {
                mapObj(indexMap, (key, value) => result[value] = as[key]);
                resolve(result);
            }, (as) => {
                reject(as);
            });
        });
    }

    chain (...args) {
        let prev = null;
        const doRing = (rings, ring, resolve, reject) => {
            const nextRing = (data) => {
                prev = data;
                rings.length === 0 ? resolve(prev) : doRing(rings, rings.shift(), resolve, reject);
            };

            if (D.isArray(ring)) {
                ring.length === 0 ? nextRing([]) :
                    this.parallel(ring, ...(prev != null ? [prev] : [])).then(nextRing, reject);
            } else {
                const value = D.isFunction(ring) ? ring.apply(this.context, prev != null ? [prev] : []) : ring;
                value && value.then ? value.then(nextRing, reject) : nextRing(value);
            }
        };

        if (args.length === 0) return this.resolve();

        return this.create((resolve, reject) => {
            doRing(args, args.shift(), resolve, reject);
        });
    }
};
