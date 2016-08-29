D.Adapter = {
    Promise,

    ajax (params) {
        const xhr = new XMLHttpRequest();
        let data = '';
        if (params.data) data = mapObj(params.data, (v, k) => `${k}=${encodeURIComponent(v)}`).join('&');
        xhr.open(params.type, (data && params.type === 'GET') ? params.url + '?' + data : params.url, true);
        const promise = new Promise((resolve, reject) => {
            xhr.onload = function() {
                if (this.status >= 200 && this.status < 400) {
                    resolve(JSON.parse(this.response));
                    return;
                }
                reject(xhr);
            };

            xhr.onerror = () => {
                reject(xhr);
            };
        });
        if (data) xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        params.beforeRequest && params.beforeRequest(xhr);
        xhr.send(data);
        return promise;
    },

    exportError () {},

    ajaxResult (args) { return args[0]; },

    getFormData (el) { throw new Error('getFormData is not implemented', el); },

    eventPrevented (e) { return e.defaultPrevented; },

    addEventListener (el, name, handler, useCapture) {
        el.addEventListener(name, handler, useCapture);
    },

    removeEventListener (el, name, handler) {
        el.removeEventListener(name, handler);
    },

    hasClass (el, clazz) { return el.classList.contains(clazz); },

    addClass (el, clazz) { el.classList.add(clazz); },

    removeClass (el, clazz) { el.classList.remove(clazz); }
};
