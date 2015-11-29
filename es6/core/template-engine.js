D.TemplateEngine = class TemplateEngine extends D.Base {
    constructor (options) {
        super('Template Engine', options, {_templateCache: {}});
    }

    _load (renderable) {
        let id = renderable.id;
        if (this._templateCache[id]) return this._templateCache[id];
        return this._templateCache[id] = this._option('load', renderable);
    }

    _execute (renderable, data, template) {
        return this._option('execute', renderable, data, renderable._element, template);
    }
};
