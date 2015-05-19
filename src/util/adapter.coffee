A = D.Adapter =
    Promise: null
    ajax: null
    hasClass: (el, clazz) ->
    addClass: (el, clazz) ->
    removeClass: (el, clazz) ->

    componentHandler: (name) ->
        creator: -> throw new Error('Component [' + name + '] is not defined')

    delegateDomEvent: (el, name, selector, fn) ->

    undelegateDomEvents: (el, namespace) ->

    getFormData: (form) ->
