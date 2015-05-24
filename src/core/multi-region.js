D.MultiRegion = function() {
    D.MultiRegion.__super__.constructor.apply(this, arguments);
    this.items = {};
    this.elements = {};
};

D.extend(D.MultiRegion, D.Region, {
    activate: FN,

    createElement: function() {
        var el = root.document.createElement('div');
        this.el.appendChild(el);
        return el;
    },

    getKey: function(item) {
        var key = null;
        if (item.moduleOptions) key = item.moduleOptions.key;
        if (!key && item.renderOptions) key = item.renderOptions.key;
        if (!key) this.error('Region key is require');

        return key;
    },

    getElement: function(item) {
        var key;
        if (!item) return this.el;
        key = this.getKey(item);

        this.items[key] = item;
        this.elements[key] || (this.elements[key] = this.createElement(key, item));
        return this.elements[key];
    },

    empty: function(item) {
        var el;
        if (item) {
            el = this.getElement(item);
            el.parentNode.removeChild(el);
        } else {
            this.el.innerHTML = '';
        }
    },

    close: function() {
        var items = this.items;
        delete this.current;
        this.elements = {};
        this.items = {};

        return this.Promise.chain(mapObj(items, function(item) {
            return item.close();
        }));
    }
});
