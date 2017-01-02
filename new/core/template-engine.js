D.TemplateEngine = class TemplateEngine {

    static FILE = 'templates';
    static CACHE = {};
    static ID_ATTRIBUTES = ['for'];

    load (renderable) {
        const cache = TemplateEngine.CACHE;
        const id = renderable.id;

        if (cache[renderable]) return Promise.resolve();

        let template = renderable._get('template');
        if (template) {
            cache[id] = template;
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.doLoad(renderable).then(t => {
                cache[id] = t;
                resolve();
            }, reject);
        });
    }

    doLoad (renderable) {
        return renderable._loader.load(`${renderable.name}/${TemplateEngine.FILE}`);
    }

    execute (renderable, data, isUpdate) {
        const el = renderable._getElement();
        el.innerHTML = TemplateEngine.CACHE[renderable.id](data);
        this.executeIdReplacement(renderable);
    }

    executeIdReplacement (renderable) {
        const el = renderable._getElement();
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

    getById (renderable, id) {
        return renderable._getElement().getElementById(id);
    }

    getByIdPrefix (renderable, prefix) {
        return this.getBySelecotr(renderable, `[id^=${prefix}]`);
    }

    getBySelecotr (renderable, selector) {
        return renderable._getElement().querySelectorAll(selector);
    }

    delegateEvent (renderable, name, selector, fn) {
    }

    undelegeteEvent (renderable, name, selector) {
    }

};
