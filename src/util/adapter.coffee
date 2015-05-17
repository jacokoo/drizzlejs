A = D.Adapter =
    Promise: root['Promise']
    ajax: $.ajax
    hasClass: (el, clazz) -> $(el).hasClass clazz
    addClass: (el, clazz) -> $(el).addClass clazz
    removeClass: (el, clazz) -> $(el).removeClass clazz

    componentHandler: (name) ->
        creator: -> throw new Error('Component [' + name + '] is not defined')

    delegateDomEvent: (el, name, selector, fn) ->
        $(el).on name, selector, fn

    undelegateDomEvents: (el, namespace) ->
        $(el).off namespace

    getFormData: (form) ->
        data = {}
        for item in $(form).serializeArray()
            o = data[item.name]
            if o is undefined
                data[item.name] = item.value
            else
                o = data[item.name] = [data[item.name]] unless D.isArray(o)
                o.push data.value
        data
