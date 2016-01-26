D.Request = {
    get (model, options) {
        return this._ajax('GET', model, model.params, options);
    },

    post (model, options) {
        return this._ajax('POST', model, model.data, options);
    },

    put (model, options) {
        return this._ajax('PUT', model, model.data, options);
    },

    del (model, options) {
        return this._ajax('DELETE', model, model.data, options);
    },

    save (model, options) {
        return model.data && model.data[model._idKey] ? this.put(model, options) : this.post(model, options);
    },

    _url (model) {
        const parts = [],
            prefix = model.module._option('urlPrefix', model) || '',
            urlRoot = model.app._option('urlRoot', model) || '',
            urlSuffix = model.app._option('urlSuffix', model) || '';
        let base = model._url() || '';

        urlRoot && parts.push(urlRoot);
        prefix && parts.push(prefix);
        parts.push(model.module.name);

        while (base.indexOf('../') === 0) {
            parts.pop();
            base = base.slice(3);
        }

        base && parts.push(base);
        model.data && model.data[model._idKey] && parts.push(model.data[model._idKey]);
        urlSuffix && parts.push(parts.pop() + urlSuffix);

        return parts.join('/');
    },

    _ajax (method, model, data, options) {
        const params = assign({ type: method }, options);

        params.data = assign({}, data, params.data);
        params.url = this._url(model);

        return model.Promise.create((resolve, reject) => {
            D.Adapter.ajax(params).then((...args) => {
                model.set(D.Adapter.ajaxResult(args), !params.slient);
                resolve(args);
            }, (...args) => reject(args));
        });
    }
};
