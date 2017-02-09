D.Renderable = class Renderable extends Base {

    _initialize () {
        this._updatables = [];

        this._templateEngine = this._def('templateEngine')
            || (this._parent && this._parent._templateEngine) || TemplateEngine._INSTANCE;

        this._store = this._parent && this._parent._store;
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
        this._doBindEvent();
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

        this._def('beforeRender');
        this._beforeRender();

        this._renderTemplate(this._serializeData(), isUpdate);
        this._renderChildren(isUpdate);

        this._afterRender();
        this._def('afterRender');
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

        mapObj(this.items, item => {
            let o = item._opt('region');
            if (!o) return;

            const region = isString(o) ? this._doCreateRegion(o, {}) : this._doCreateRegion(o.id, o);
            region.show(item);
        });
    }

    _doUpdateChildren () {
        
    }
};
