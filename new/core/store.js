const STATE_CHANGE_ACTION = D.uniqueId('__SCA__');
const STATE_INIT_ACTION = D.uniqueId('__SIA__');

D.Store = class Store extends Base {

    _initialize () {
        this._callbacks = this._def('callbacks');

        assign(this._callbacks, {
            [STATE_CHANGE_ACTION] (payload) {
                const state = this.models.state;

                state.data = assign(state.data, payload.data);
                payload.slient ? state._doUpdateBinding() : state.changed();
            },

            [STATE_INIT_ACTION] () {
                const init = this._store._defs.init;
                if (isFunction(init)) init.call(this);
            }
        });

        this._callbackContext = assign({
            _store: this,
            models: this.models
        }, {}); // TODO
    }

    _load () {
        this._doLoadModels();
        return Promise.resolve();
    }

    _doLoadModels () {
        this._models = {};

        const map = this._parent._opt('models');
        const from = this._parent._parent;
        mapObj(this._def('modes'), (value, key) => {
            const v = (isFunction(value) ? value.call(this) : value) || {};
            if (v.replaceable === true && map[key] && from && from._store._models[map[key]]) {
                this._models[key] = from._store._models[map[key]];
                return;
            }

            this._doCreateModel(key, v);
        });

        this._doCreateModel('state', {});
    }

    _doCreateModel (key, options) {
        if (this._models[key]) return;
        this._models[key] = Loader._createModel(this, key, options);

        this.addDisposable(() => {
            this._models[key].destroy();
            delete this._models[key];
        });
    }

    dispatch (action, obj) {
        let n = action, p = obj;
        if (isObject(action)) {
            n = action.name;
            p = action.payload;
        }

        return this._doDispatch(n, p);
    }

    _setState (data, slient) {
        return this.dispatch(STATE_CHANGE_ACTION, { data, slient });
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
