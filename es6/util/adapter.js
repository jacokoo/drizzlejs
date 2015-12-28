const events = {};
const createHandler = function(region, name, selector) {
    return (e) => {
        let target = e.target, matched = false;
        map(region.getElement().querySelectorAll(selector), (el) => {
            if (el === target || el.contains(target)) {
                matched = el;
            }
        });

        matched && region.trigger(name, e);
    };
};

D.Adapter = {
    Promise: Promise,

    ajax (params) { throw new Error('Ajax is not implemented'); },

    ajaxResult (args) { return args[0]; },

    getEventTarget (event) { return e.currentTarget || e.target; },

    getFormData (el) {

    },

    delegateDomEvent (region, renderable, name, selector, fn) {
        let event = `${name}-${region.id}`, id = `${region.id}-${renderable.id}`;
        renderable.listenTo(region, event, fn);
        (events[id] || (events[id] = {}));
        let handler = events[id][name] = createHandler(region, event, selector);
        region.getElement().addEventListener(name, handler, false);
    },

    undelegateDomEvents (region, renderable) {
        let id = `${region.id}-${renderable.id}`;
        renderable.stopListening(region);
        mapObj(events[id], (handler, name) => {
            region.getElement.removeEventListener(name, handler);
        });
        delete events[id];
    },

    hasClass (el, clazz) { return el.classList.contains(clazz); },

    addClass (el, clazz) { el.classList.add(clazz); },

    removeClass (el, clazz) { el.classList.remove(clazz); }
};
