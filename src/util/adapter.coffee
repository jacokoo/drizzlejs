A = D.Adapter =
    Promise: root['Promise']
    ajax: $.ajax
    hasClass: (el, clazz) -> $(el).hasClass(clazz)

    getElementsBySelector: (selector, el = root.document) -> el.querySelectorAll(selector)

    createDefaultHandler: (name) ->
        creator: throw new Error('Component [' + name + '] is not defined')

    delegateDomEvent: (el, name, selector, fn) ->
        $(el).on name, selector, fn

    undelegateDomEvents: (el, namespace) ->
        $(el).off namespace
