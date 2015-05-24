D.Helpers = {
    layout: function(app, H, options) {
        return this.View.isLayout ? options.fn(this) : '';
    },

    view: function(app, H, name, options) {
        return !this.isLayout && this.View.name === name ? options.fn(this) : '';
    }
};
