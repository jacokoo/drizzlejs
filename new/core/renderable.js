D.Renderable = class Renderable extends Base {

    constructor (...args) {
        super(...args);

        this._templateEngine = this._def('templateEngine')
            || (this._parent && this._parent._templateEngine) || TemplateEngine._INSTANCE;
    }

    _doLoadTemplate () {
        return this._templateEngine._load(this);
    }
}
