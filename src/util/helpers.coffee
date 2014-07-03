D.Helpers =
    layout: (app, Handlebars, options) ->
        if @View.isLayout then options.fn @ else ''

    view: (app, Handlebars, name, options) ->
        return '' if @View.isLayout or @View.name isnt name
        options.fn @
