var D = require('drizzlejs'),
    $ = require('jquery'),
    vr = require('vdom-virtualize'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    app;

require('drizzlejs/dist/jquery-adapter')(window, $, D);

if ('forEach' in Array.prototype) {
    D.View.prototype.updateDom = function() {
        var el = this.getElement();
        if (!el.innerHTML.replace(/^\s|\s$/g, '').length) {
            el.innerHTML = this.virtualEl.innerHTML;
        } else {
            patch(el, diff(vr(el), vr(this.virtualEl)));
        }
    };
}

window.app = app = new D.Application({
    defaultRegion: document.getElementById('content'),
    urlRoot: 'api'
});

app.startRoute('todos', '/');



/*

virtual dom support via diff-dom

var diffDom = require('diff-dom');
var dd = new diffDom();
D.View.prototype.updateDom = function() {
    dd.apply(this.getEl(), dd.diff(this.getEl(), this.virtualEl));
}
*/
