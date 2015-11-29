var D = require('drizzlejs'),
    H = require('handlebars/runtime'),
    getFormData = require('get-form-data'), app;

H.registerHelper('module', function(options) {
    return (this.Self instanceof D.Module) ? options.fn(this) : '';
});

H.registerHelper('view', function(name, options) {
    return (this.Self instanceof D.View) && this.Self.name === name ? options.fn(this) : '';
});

D.adapt({
    getFormData: function(el) {
        return getFormData(el);
    }
});

window.app = app = new D.Application({
    defaultRegion: document.getElementById('content'),
    urlRoot: 'api',
    routers: [''],
    templateEngine: new D.TemplateEngine({
        loadModule: function(mod) {
            return mod._loader.loadModuleResource(mod, 'templates');
        },

        loadView: function(view) {
            return function() { return view.module._template; };
        },

        executeModule: function(mod, data, el, template) {
            el.innerHTML = template(data);
            this.executeIdReplacement(el, mod);
        },

        executeView: function(view, data, el, template) {
            el.innerHTML = template(data);
            this.executeIdReplacement(el, view);
        }
    })
});

app.start('todos');

/*

virtual dom support via diff-dom

var diffDom = require('diff-dom');
var dd = new diffDom();
D.View.prototype.updateDom = function() {
    dd.apply(this.getEl(), dd.diff(this.getEl(), this.virtualEl));
}
*/
