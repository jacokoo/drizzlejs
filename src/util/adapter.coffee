A = D.Adapter =
    Promise: root['Promise']
    ajax: null
    hasClass: (el, clazz) -> $(el).hasClass(clazz)
    getElementsBySelector: (selector, el = root.document) -> el.querySelectorAll(selector)
    delegateDomEvent: (el, name, selector, fn) ->
        $(el).on name, selector, fn
    undelegateDomEvents: (el, namespace) ->
        $(el).off namespace
