var D = require('drizzlejs');
var A = require('drizzlejs/dist/jquery-adapter');

/*

virtual dom support via diff-dom

var diffDom = require('diff-dom');
var dd = new diffDom();
D.View.prototype.updateDom = function() {
    dd.apply(this.getEl(), dd.diff(this.getEl(), this.virtualEl));
}
*/


var vr = require('vdom-virtualize'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch');

if ('forEach' in Array.prototype) {
    D.View.prototype.updateDom = function() {
        var el = this.getEl();
        if (!el.innerHTML.replace(/^\s|\s$/g, '').length) {
            this.getEl().innerHTML = this.virtualEl.innerHTML;
        } else {
            patch(el, diff(vr(el), vr(this.virtualEl)));
        }
    };
}

new D.Application({
    defaultRegion: document.getElementById('content')
}).startRoute('todos', '/');
