D.Store = class Store extends Base {

    _initialize () {
        this._callbacks = this._def('callbacks');
        this._callbackContext = {}; // TODO
    }

    _initializeModels () {
        this._models = {};

        const promises = [];
        const keys = [];
        mapObj(this._def('models'), (value, k) => {
            const v = (isFunction(value) ? value.call(this) : value) || {};
            keys.push(k);
            if (v.replaceable === true) {
                const modelMap = this._parent._opt('models');
                const from = this._parent._parent;
                if (modelMap[k] && from && from._store._models[k]) {
                    promises.push(Promise.resolve(from._store._models[k]));
                    return;
                }
            }

            promises.push(Loader._createModel(this, k, v));
        });

        return Promise.all(promises).then(models => map(models, (m, i) => this._models[keys[i]] = m));
    }

    dispatch (action, obj) {
        let n = action, p = obj;
        if (isObject(action)) {
            n = action.name;
            p = action.payload;
        }

        return this._doDispatch(n, p);
    }

    _doDispatch (name, payload) {
        if (!this._context) {
            this._context = { current: 0, changed: {} };
        }
        this._context.current ++;

        const callback = this._callbacks[name];
        if (callback) throw new Error(`[${this._parent.name}]: No action callback for action ${name}`);
        let result = callback.call(this._callbackContext, payload);
        if (!result || !result.then) {
            result = Promise.resolve(result);
        }

        return result.then(() => {
            this._context.current --;
            if (this._context.current === 0) {
                this._doRenderRelatedItems();
                delete this._context;
            }
        }, () => {
            delete this._context;
        });
    }

    _doRenderRelatedItems () {
        const called = {};
        mapObj(this._models, m => map(m._getBinded(), r => {
            if (called[v.id]) return;
            called[v.id] = true;
            r.render();
        }));
    }
};
