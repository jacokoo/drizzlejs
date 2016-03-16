D.TemplateEngine = function TemplateEngine (options) {
    D.TemplateEngine.__super__.constructor.call(this, 'Template Engine', options, { _templateCache: {} });
};

extend(D.TemplateEngine, D.Base, {
    executeIdReplacement (el, renderable) {
        const used = {};
        map(el.querySelectorAll('[id]'), (item) => {
            const id = item.getAttribute('id');
            if (used[id]) this._error(`Dom ID: ${id} is already used`);
            used[id] = true;
            item.setAttribute('id', renderable._wrapDomId(id));
        });

        const attrs = this._option('attributesReferToId') || ['for', 'data-target', 'data-parent'];

        map(attrs, (attr) => map(el.querySelectorAll(`[${attr}]`), (item) => {
            const value = item.getAttribute(attr),
                withHash = value.charAt(0) === '#',
                wrapped = withHash ? `#${renderable._wrapDomId(value.slice(1))}` : renderable._wrapDomId(value);
            item.setAttribute(attr, wrapped);
        }));
    },

    _load (renderable) {
        const id = renderable.id;
        if (this._templateCache[id]) return this._templateCache[id];
        return this._templateCache[id] = this._loadIt(renderable);
    },

    _loadIt (renderable) {
        if (renderable instanceof Drizzle.Module) {
            return renderable._loader.loadModuleResource(renderable, 'templates');
        }

        return () => renderable.module._template;
    },

    _execute (renderable, data, template /* , update */) {
        const el = renderable._getElement();
        el.innerHTML = template(data);
        this.executeIdReplacement(el, renderable);
    }

});
