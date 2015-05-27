Adapter = D.Adapter = {
    Promise: root.Promise,
    ajax: null,
    hasClass: function(el, name) { return el.classList.contains(name); },
    addClass: function(el, name) { return el.classList.add(name); },
    removeClass: function(el, name) { return el.classList.remove(name); },

    componentHandler: function(name) {
        return {
            creator: function() {
                throw new Error('Component [' + name + '] is not defined');
            }
        };
    },

    delegateDomEvent: FN,

    undelegateDomEvents: FN,

    getFormData: FN
};
