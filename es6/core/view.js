D.View = class View extends ActionCreator {
    _initialize () {
        super._initialize();
        this._initializeDataBinding();
    }

    _initializeDataBinding () {
        this._dataBinding = {};
        this.bindings = {};
        mapObj(this._option('bindings'), (desc, name) => {

        });
    }

    _serializeData () {
        let data = super._serializeData();
    }

};
