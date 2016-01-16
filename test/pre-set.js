Handlebars.registerHelper('module', function(options) {
    return (this.Self instanceof Drizzle.Module) ? options.fn(this) : '';
});

Handlebars.registerHelper('view', function(name, options) {
    return (this.Self instanceof Drizzle.Renderable) && this.Self.name === name ? options.fn(this) : '';
});
