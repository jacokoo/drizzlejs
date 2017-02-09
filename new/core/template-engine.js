D.TemplateEngine = class TemplateEngine {

    static INSTANCE = new TemplateEngine();
    static FILE = 'templates';
    static CACHE = {};
    static ID_ATTRIBUTES = ['for'];

    _load (renderable) {
        const cache = TemplateEngine.CACHE;
        const id = renderable.id;

        if (cache[id]) return Promise.resolve();

        let template = renderable._get('template');
        if (template) {
            cache[id] = template;
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this._doLoad(renderable).then(t => {
                cache[id] = t;
                resolve();
            }, reject);
        });
    }

    _doLoad (renderable) {
        return renderable._loader._load(`${renderable.name}/${TemplateEngine.FILE}`);
    }

    _execute (renderable, data, isUpdate) {
        const el = renderable._element;
        el.innerHTML = TemplateEngine.CACHE[renderable.id](data);
        this._executeIdReplacement(renderable);
    }

    _executeIdReplacement (renderable) {
        const el = renderable._element;
        const id = renderable.id;
        const used = {};

        map(el.querySelectorAll('[id]'), item => {
            const i = item.getAttribute('id');
            if (used[i]) throw new Error(`${renderable.fullname()}: ID [${i}] is already used`);
            used[i] = true;
            item.setAttribute('id', `${id}${i}`);
        });

        map(TemplateEngine.ID_ATTRIBUTES, attr => map(el.querySelectorAll(`[${attr}]`), item => {
            const value = item.getAttribute(attr);
            const withHash = value.charAt(0) === '#';
            item.setAttribute(withHash ? `#${id}${value.slice(1)}` : `${id}${value}`);
        }));
    }

    _getById (renderable, id) {
        return renderable._element.getElementById(id);
    }

    _getByIdPrefix (renderable, prefix) {
        return this._getBySelecotr(renderable, `[id^=${prefix}]`);
    }

    _getBySelecotr (renderable, selector) {
        return renderable._element.querySelectorAll(selector);
    }

    _delegateEvent (renderable, name, selector, fn) {
    }

    _undelegeteEvent (renderable, name, selector) {
    }

};
