D.Adapter = {
    Promise,

    ajax (params) {
        const xhr = new XMLHttpRequest();
        xhr.open(params.type, params.url, true);
        const promise = new Promise((resolve, reject) => {
            xhr.onload = function() {
                if (this.status >= 200 && this.status < 4000) {
                    resolve(JSON.parse(this.response));
                    return;
                }
                reject(xhr);
            };

            xhr.onerror = function() {
                reject(xhr);
            };
        });
        xhr.send(params.data);
        return promise;
    },

    ajaxResult (args) { return args[0]; },

    getEventTarget (e) { return e.target; },

    getFormData (el) { throw new Error('getFormData is not implemented', el); },

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
