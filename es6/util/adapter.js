const __events = {};
const __createHandler = function(region, name, selector) {
    return (e) => {
        const target = e.target;
        let matched = false;
        map(region.getElement().querySelectorAll(selector), (el) => {
            if (el === target || el.contains(target)) {
                matched = el;
            }
        });

        matched && region.trigger(name, e);
    };
};
const __captures = ['blur', 'focus', 'scroll', 'resize'];

D.Adapter = {
    Promise,

    ajax (params) { throw new Error('Ajax is not implemented', params); },

    ajaxResult (args) { return args[0]; },

    getEventTarget (e) { return e.currentTarget || e.target; },

    getFormData (el) { throw new Error('getFormData is not implemented', el); },

    delegateDomEvent (region, renderable, name, selector, fn) {
        const event = `${name}-${region.id}`, id = `${region.id}-${renderable.id}`;
        renderable.listenTo(region, event, fn);
        (__events[id] || (__events[id] = {}));
        const handler = __events[id][name] = __createHandler(region, event, selector);
        this.addEventListener(region.getElement(), name, handler, __captures.indexOf(name) !== -1);
    },

    undelegateDomEvents (region, renderable) {
        const id = `${region.id}-${renderable.id}`;
        renderable.stopListening(region);
        mapObj(__events[id], (handler, name) => {
            this.removeEventListener(region.getElement(), name, handler);
        });
        delete __events[id];
    },

    addEventListener (el, name, handler, useCapture) {
        el.addEventListener(name, handler, useCapture);
    },

    removeEventListener (el, name, handler) {
        el.removeEventListener(el, name, handler);
    },

    hasClass (el, clazz) { return el.classList.contains(clazz); },

    addClass (el, clazz) { el.classList.add(clazz); },

    removeClass (el, clazz) { el.classList.remove(clazz); }
};
