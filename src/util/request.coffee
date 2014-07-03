D.Request =

    url: (model) ->
        urls = [D.Config.urlRoot]
        url.push model.module.options.urlPrefix if model.module.options.urlPrefix
        url.push model.module.name
        base = model.url or ''
        base = base.apply model if D.isFunction base

        while base.indexOf('../') is 0
            paths.pop()
            base = base.slice 3

        urls.push base
        urls.push model.data.id if model.data.id
        D.joinPath urls...

    get: (model, options) -> @ajax type: 'GET', model, model.getParams(), options
    post: (model, options) -> @ajax type: 'POST', model, model.data, options
    put: (model, options) -> @ajax type: 'PUT', model, model.data, options
    del: (model, options) -> @ajax type: 'DELETE', model, model.data, options

    ajax: (params, model, data, options) ->
        url = @url model
        params = D.extend params,
            contentType: 'application/json'
        , options
        data = D.extend data, options.data
        params.url = url
        params.data = data
        D.Deferred.chain $.ajax(params), (resp) -> model.setData resp
