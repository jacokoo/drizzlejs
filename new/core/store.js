D.Store = class Store extends Base {
    constructor (...args) {
        super(...args);

        this._callbacks = this._def('callbacks');
        this._bindings = {};
    }

    _bind (modelName, renderable) {
        if (this._bindings[modelName]) {
            this._bindings[modelName].push(renderable);
        } else {
            this._bindings[modelName] = [renderable];
        }
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
                this._doRenderItems();
                delete this._context;
            }
        }, () => {
            delete this._context;
        });
    }

    _registerChange (model) {
        if (!this._context) {
            throw new Error(`[${this._parent.name}]: Can't change model while no action is dispatching`);
        }

        this._context.changed[model.name] = true;
    }

    _doRenderItems () {
        const called = {};
        mapObj(this._bindings, (value, key) => this._context.changed[key] && map(value, (v) => {
            if (!called[v.id]) {
                v.render();
                called[v.id] = true;
            }
        }));
    }
};
