D.Module = class Module extends D.RenderableContainer {

    _initialize () {
        super._initialize();
        this.app._modules[`${this.name}--${this.id}`] = this;
    }

    _afterClose () {
        delete this.app._modules[`${this.name}--${this.id}`]
        return super._afterClose();
    }

    _initializeStore () {

    }
};
