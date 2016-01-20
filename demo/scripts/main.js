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
    container: document.getElementById('content'),
    urlRoot: 'api',
    routers: ['']
});

app.start('todos');
