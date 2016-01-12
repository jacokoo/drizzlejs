D.Module = class Module extends D.RenderableContainer {
    _initialize () {
        this.app._modules[`${this.name}--${this.id}`] = this;
        return super._initialize();
    }

    get store () {
        return this._store;
    }

    _initializeStore () {
        this._store = this.app._createStore(this, this._option('store'));
    }

    _afterClose () {
        delete this.app._modules[`${this.name}--${this.id}`];
        this._store._destory();
        return super._afterClose();
    }

    _beforeRender () {
        return this.chain(super._beforeRender(), () => this._store._loadEagerModels());
    }

    _afterRender () {
        return this.chain(super._afterRender(), () => this._store._loadLazyModels());
    }
};
