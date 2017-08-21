D.View = function View () {
    D.View.__super__.constructor.apply(this, arguments);
};

extend(D.View, D.ActionCreator, {
    _initialize () {
        this.bindings = {};
        return this.chain(D.View.__super__._initialize.call(this), this._initializeDataBinding);
    },

    _initializeDataBinding () {
        this._dataBinding = {};
        mapObj(this._option('bindings'), (value, key) => {
            const model = this.bindings[key] = this.module.store.models[key];
            if (!model) this._error('No model:', key);

            if (!value) return;
            this._dataBinding[key] = { model, value, fn: () => {
                if (value === true && this._region) this.render(this.renderOptions);
                if (D.isString(value)) this._option(value);
            } };
        });
    },

    _bindData () {
        mapObj(this._dataBinding, (value) => this.listenTo(value.model, 'changed', value.fn));
    },

    _unbindData () {
        this.stopListening();
    },

    _setRegion (...args) {
        D.View.__super__._setRegion.apply(this, args);
        this._bindData();
    },

    _close (...args) {
        return this.chain(D.View.__super__._close.apply(this, args), this._unbindData, this);
    },

    _serializeData () {
        const data = D.View.__super__._serializeData.call(this);
        mapObj(this.bindings, (value, key) => data[key] = value.get(true));
        mapObj(this._option('dataForTemplate'), (value, key) => data[key] = value.call(this, data));
        return data;
    }

});
