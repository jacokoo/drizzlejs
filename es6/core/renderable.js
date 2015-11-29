D.Renderable = class Renderable extends D.Base {
    constructor (name, app, mod, loader, options) {
        this.app = app;
        this.module = mod;
        this._loader = loader;
        this._components = {};

        super(name, options);
        app.delegateEvent(this);
    }

    initialize () {
        this._loadedPromise = app.templateEngine._load(this);
    }

    get _element {
        return this._region ? this._region.getElement(this) : null;
    }

    _wrapDomId (id) {
        return this.id + id;
    }

    $ (id) {
        return this.$$('#' + this._wrapDomId(id))[0];
    }

    $$ (selector) {
        return this._element.querySelectorAll(selector);
    }

    _setRegion (region) {
        this._region = region;
    }

    render (options) {
        this.renderOptions = options;
    }

    beforeRender () {}
    afterRender () {}
    beforeClose () {}
    afterClose () {}
};
