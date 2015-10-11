Request = D.Request = {
    url: function(model) {
        var options = model.app.options,
            base = model.url(),
            urlRoot = options.urlRoot || '',
            urls = [], matches, protocol = '';

        matches = urlRoot.match(/^(https?:\/\/)(.*)$/);
        if (matches) {
            protocol = matches[1];
            urlRoot = matches[2];
        }
        urls.push(urlRoot);

        if (model.module.options.urlPrefix) {
            urls.push(model.module.options.urlPrefix);
        }

        urls.push(model.module.name);

        while (base.indexOf('../') === 0) {
            urls.pop();
            base = base.slice(3);
        }
        if (base) urls.push(base);

        if (model.data && model.data[model.idKey]) urls.push(model.data[model.idKey]);

        if (options.urlSuffix) {
            urls.push(urls.pop() + options.urlSuffix);
        }

        return protocol + compose.apply(null, urls);
    },

    get: function(model, options) {
        return this.ajax({type: 'GET'}, model, model.getParams(), options);
    },

    post: function(model, options) {
        return this.ajax({type: 'POST'}, model, model.data, options);
    },

    put: function(model, options) {
        return this.ajax({type: 'PUT'}, model, model.data, options);
    },

    del: function(model, options) {
        return this.ajax({type: 'DELETE'}, model, model.data, options);
    },

    save: function(model, options) {
        return model.data[model.idKey] ? this.put(model, options) : this.post(model, options);
    },

    ajax: function(params, model, data, options) {
        options || (options = {});
        assign(params, options);
        assign(data, options.data);

        params.url = this.url(model);
        params.data = data;

        return new Adapter.Promise(function(resolve, reject) {
            Adapter.ajax(params).then(function() {
                var args = slice.call(arguments), resp = args[0];
                model.set(resp, !options.silent);
                resolve(args);
            }, function() {
                reject(slice.call(arguments));
            });
        });
    }
};
