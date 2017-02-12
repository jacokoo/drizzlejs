const CALL_DEF = name => {
    const life = this._defs.life;
    life && life[name] && life[name].call(this);
};

const LIFECYCLE_READY = 'ready';
const LIFECYCLE_BEFORE_RENDER = 'beforeRender';
const LIFECYCLE_AFTER_RENDER = 'afterRender';
const LIFECYCLE_BEFORE_CLOSE = 'beforeClose';
const LIFECYCLE_AFTER_CLOSE = 'afterClose';

D.Renderable = class Renderable extends Base {

    static _LIFECYCLES = {
        _CALL_DEF_: {
            [LIFECYCLE_READY] () { CALL_DEF.call(this, LIFECYCLE_READY); },
            [LIFECYCLE_BEFORE_RENDER] () { CALL_DEF.call(this, LIFECYCLE_BEFORE_RENDER); },
            [LIFECYCLE_AFTER_RENDER] () { CALL_DEF.call(this, LIFECYCLE_AFTER_RENDER); },
            [LIFECYCLE_BEFORE_CLOSE] () { CALL_DEF.call(this, LIFECYCLE_BEFORE_CLOSE); },
            [LIFECYCLE_AFTER_CLOSE] () { CALL_DEF.call(this, LIFECYCLE_AFTER_CLOSE); }
        },

        _BIND_DATA_: {
            [LIFECYCLE_READY] () {
                this.bindings = {};
                map(this._def('bindings'), name => {
                    this.bindings[name] = this._store._models[name]._createBinding(this);
                });
            },

            [LIFECYCLE_AFTER_CLOSE] () {
                mapObj(this.bindings, v => v.unbind());
                delete this.bindings;
            }
        },

        _BIND_EVENT_: {
            [LIFECYCLE_READY] () {
                mapObj(this._def('events'), (v, k) => {
                    const [name, id] = k.split(' ');
                    this._templateEngine._delegateEvent(this, name, id, v);
                });
            },

            [LIFECYCLE_AFTER_CLOSE] () {
                this._templateEngine._undelegeteEvent(this);
            }
        },

        _BIND_ACTION_: {
            [LIFECYCLE_READY] () {
                const te = this._templateEngine;
                mapObj(this._def('actions'), (v, k) => {
                    const [name, id] = k.split(' ');
                    te._delegateEvent(this, name, id, (e, target, value) => {
                        const data = te._getFormData(this, target);
                        if (isString(v)) {
                            this._store.dispatch(v, data);
                            return;
                        }

                        if (!v.check) {
                            this._store.dispatch(v.name, data);
                            return;
                        }

                        v.check(data, d => {
                            this._store.dispatch(v.name, d);
                        }, e, target, value);
                    });
                });
            },

            [LIFECYCLE_AFTER_CLOSE] () {
                this._templateEngine._undelegeteEvent(this);
            }
        }
    };

    static DEFAULT_LIFECYCLES = ['_CALL_DEF_', '_BIND_DATA_', '_BIND_EVENT_', '_BIND_ACTION_'];

    static registerLifecycle (name, obj) {
        this._LIFECYCLES[name] = obj;
    }

    _initialize () {
        this._updatables = [];

        this._templateEngine = this._def('templateEngine')
            || (this._parent && this._parent._templateEngine) || TemplateEngine._INSTANCE;

        this._store = this._parent && this._parent._store;
        this._initializeLifecycle();
    }

    _initializeLifecycle () {
        this._lifecycles = {
            [LIFECYCLE_READY]: [],
            [LIFECYCLE_BEFORE_RENDER]: [],
            [LIFECYCLE_AFTER_RENDER]: [],
            [LIFECYCLE_BEFORE_CLOSE]: [],
            [LIFECYCLE_AFTER_CLOSE]: []
        };

        const seq = [LIFECYCLE_READY, LIFECYCLE_BEFORE_RENDER, LIFECYCLE_BEFORE_CLOSE];
        const rev = [LIFECYCLE_AFTER_RENDER, LIFECYCLE_AFTER_CLOSE];
        const arr = Renderable.DEFAULT_LIFECYCLES.concat(this._def('lifecycles') || []);
        map(arr, name => {
            const obj = Renderable._LIFECYCLES[name];
            map(seq, n => obj[n] && this._lifecycles[n].push(obj[n]));
            map(rev, n => obj[n] && this._lifecycles[n].unshift(obj[n]));
        });
    }

    _load () {
        return Promise.all([this._doLoadTemplate(), this._doLoadItems()]);
    }

    _doLoadTemplate () {
        return this._templateEngine._load(this);
    }

    _doLoadItems () {
        const result = [];
        this.items = {};

        mapObj(this._def('items'), (value, key) => {
            const v = (isString(value) ? { region: value } : value) || {};
            const [name, type] = v.isModule ? [v.name, 'Module'] : [v.name || key, 'View'];
            result.push(Loader[`_create${type}`](this, name, v).then(m => this.items[key] = m));
        });

        return Promise.all(result);
    }

    $ (id) {
        return this._templateEngine._getById(this, id);
    }

    addUpdatable (fn) {
        this._updatables.push(fn);
    }

    _doUpdatables () {
        map(this._updatables, fn => fn.call(this));
        this._updatables = [];
    }

    get _element () {
        return this._region && this._region._element;
    }

    _setRegion (region) {
        this._region = region;
        this._ready();
    }

    setState (key, value, slient) {
        if (isString(key)) {
            return this._store.setState({ [key]: value }, slient);
        }

        return this.store.setState(key, value === true);
    }

    render (state) {
        this._render(state, true);
    }

    _render (state, isUpdate) {
        this._doUpdatables();
        this.setState(state, true);

        this._beforeRender();
        this._renderTemplate(this._serializeData(), isUpdate);
        this._renderChildren(isUpdate);

        this._afterRender();
    }

    _renderChildren (isUpdate) {
        isUpdate ? this._doUpdateChildren() : this._doRenderChildren();
    }

    _doCreateRegion (name, options) {
        if (this.regions[name]) return this.regions[name];

        let o = options;
        if (isString(o)) o = { id: o };
        if (!o.id) o.id = name;

        const region = Loader._createRegion(this, name, o);
        this.regions[name] = region;
        return region;
    }

    _doRenderChildren () {
        this.regions = {};
        mapObj(this._def('regions'), (v, k) => this._doCreateRegion(k, v));

        const map = {};
        mapObj(this.items, item => {
            let o = item._opt('region');
            if (!o) return;

            if (isString(o)) {
                map[o] = item;
                this._doCreateRegion(o, {});
            } else {
                map[o.id] = item;
                this._doCreateRegion(o.id, o);
            }
        });

        mapObj(this._opt('items'), (v, k) => this.regions[v] && map[v] = this._parent.items[k]);
        mapObj(map, (v, k) => this.regions[k].show(v));
    }

    _doUpdateChildren () {
        mapObj(this.regions, region => region._update());
    }

    _doLifecycle (name) {
        map(this._lifecycles[name], fn => fn.call(this));
    }

    _ready () {
        this._doLifecycle(LIFECYCLE_READY);
    }

    _beforeRender () {
        this._doLifecycle(LIFECYCLE_BEFORE_RENDER);
    }

    _afterRender () {
        this._doLifecycle(LIFECYCLE_AFTER_RENDER);
    }

    _beforeClose () {
        this._doLifecycle(LIFECYCLE_BEFORE_CLOSE);
    }

    _afterClose () {
        this._doLifecycle(LIFECYCLE_AFTER_CLOSE);
    }

};
