D.Renderable = class Renderable extends Base {

    _initialize () {
        this._templateEngine = this._def('templateEngine')
            || (this._parent && this._parent._templateEngine) || TemplateEngine._INSTANCE;
    }

    _load () {
        return Promise.all([this._doLoadTemplate(), this._doLoadItems()]);
    }

    _doLoadTemplate () {
        return this._templateEngine._load(this);
    }

    _doLoadRegions () {
        
    }

    _doLoadItems () {
        mapObj(this._def('items'), (value, key) => {
            
        });
    }

    get _element () {
        return this._region && this._region._element;
    }

    _setRegion (region) {
        this._region = region;
        this._doBindEvent();
    }


};
