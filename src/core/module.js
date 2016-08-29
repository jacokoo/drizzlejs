D.Module = function Module () {
    D.Module.__super__.constructor.apply(this, arguments);
};

D.extend(D.Module, D.RenderableContainer, {
    _initialize () {
        this.app._modules[`${this.name}--${this.id}`] = this;
        this._initializeStore();
        return D.Module.__super__._initialize.call(this);
    },

    dispatch (name, payload) {
        return this.store.dispatch(name, payload);
    },

    _initializeStore () {
        this.store = this.app._createStore(this, this._option('store'));
    },

    _afterClose () {
        delete this.app._modules[`${this.name}--${this.id}`];
        this.store._destory();
        return D.Module.__super__._afterClose.call(this);
    },

    _beforeRender () {
        return this.chain(D.Module.__super__._beforeRender.call(this), () => this.store._loadEagerModels());
    },

    _afterRender () {
        return this.chain(D.Module.__super__._afterRender.call(this), () => this.store._loadLazyModels());
    }
});
