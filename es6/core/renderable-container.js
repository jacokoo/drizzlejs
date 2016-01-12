D.RenderableContainer = class RenderableContainer extends D.Renderable {

    get items () {
        return this._items || {};
    }

    get regions () {
        return this._regions || {};
    }

    _initialize () {
        const promise = super._initialize();

        this._items = {};
        return this.chain(promise, this._initializeItems);
    }

    _afterRender () {
        return this.chain(this._initializeRegions, this._renderItems);
    }

    _afterClose () {
        return this._closeRegions();
    }

    _initializeItems () {
        this.chain(mapObj(this._option('items'), (options = {}, name) => {
            let opt = D.isFunction(options) ? options.call(this) : options;
            if (D.isString(opt)) opt = { region: opt };

            return this.app[options.isModule ? '_createModule' : '_createView'](name, parent).then((item) => {
                item.moduleOptions = options;
                this._items[name] = item;
                return item;
            });
        }));
    }

    _initializeRegions () {
        this._regions = {};
        return this.chain(this.closeRegions, map(this.$$('[data-region]'), (el) => {
            const region = this._createRegion(el);
            this._regions[region.name] = region;
        }));
    }

    _renderItems () {
        return this.chain(mapObj(this.items, (item) => {
            const { region } = item.moduleOptions;
            if (!region) return;
            if (!this.regions[region]) this.error(`Region: ${region} is not defined`);
            this.regions[region].show(item);
        }), this);
    }

    _createRegion (el) {
        const name = el.getAttribute('data-region');
        return this.app._createRegion(el, name, this);
    }

    _closeRegions () {
        const regions = this._regions;
        if (!regions) return;
        delete this._regions;
        return this.chain(mapObj(regions, (region) => region.close()));
    }
};
