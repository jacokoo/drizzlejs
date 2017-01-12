// module builder api must support these things
// 1. override default module class
// 2. define regions
// 3. define views and module references
// 4. bind model change to rerender
// 5. computed value to be used in template
// 6. handle dom event
// 7. handle action create and dispatch
// 8. hook lifecycle
// 9. trigger event that parent module can handle it like #6
// 10. can extend current module's api

const OtherModule = require('./other-module');
const OtherRegion = require('./other-region');

module.exports = b => {
    // #1
    b.use(OtherModule);
    b.set({
        key: 'value',
        other () {
            return true;
        }
    });

    // #2 && #3
    b.items((v, m) => {
        v('viewId').name('hello').region('domId').name('regionName');
        v('viewId2').name('foo').region('domId2').use(OtherRegion).set({
            bind: 'users',
            key: 'user',
            view: 'viewName',
            module: 'moduleName'
        }).name('regionName2');

        m('moduleId').name('module/name')
            .model('from', 'to')
            .ref('viewId').region('targetRegion')
            .state('name', 'value')
            .region('domId3');
    });

    // #4
    b.bind('model1', 'model2', 'model3');

    // #5
    b.computed({
        foo (data) {
            return data.state.foo + 1;
        }
    });

    // #6
    b.event(when => {
        when('click').id('domId').then(e => {
            // `this` can't refer to current module
            // handle click
        });

        when('click').ids('domIdPrefix').then(function(e) {
            // `this` can refer to current module
            // handle click
        });
    });

    // #7
    b.action(dispatch => {
        dispatch('name').when('click').ids('domIdPrefix');
        dispatch('actionName').when('click').id('domId').check((data, dispatchIt) => {
            // check data;
            // if data is correct
            dispatchIt(data).then(d => {
                // after dispatch
            });
        });
    });

    // #8
    b.life((render, close) => {
        render.before(function() {
            // do things before render;
        });

        close.after(function() {
            // do things after close;
        });
    });

    // #10
    b.mixin({
        api () {
            // say hello
        }
    });
};

// #1
exports.type = OtherModule;
exports.key = 'value';
exports.other = function() {
    return true;
};

// #2 && #3
exports.items = {
    viewId: {
        name: 'hello', // optional, the value is set to viewId if ignored
        region: {
            id: 'domId' // the value `domId` also is regionId
        }
    },

    viewId2: {
        name: 'foot',
        region: {
            id: 'domId2',
            type: OtherRegion,  // override default Region
            bind: 'users',      // options for OtherRegion
            key: 'user',
            view: 'viewName',
            module: 'moduleName'
        }
    },

    moduleId: {  // moduleId is used to refer the module instance
        isModule: true,  // indicat this is refer to a module
        name: 'module/name',  // the module name
        models: {
            to: 'from'  // replace `module/name` models use models from current module
        },
        views: {
            viewId: 'targetRegion'  // set view to region placed in `module/name`
        },
        state: {
            name: 'value'  // set `module/name` state
        },
        region: 'domId3'
    }
};

// regions that parent module can put view into it
exports.regions = {
    domId: {
        type: OtherRegion,
        some: 'thing'
    }
};

// #4
exports.bindings = ['model1', 'model2', 'model3'];

// #5
exports.computed = {
    foo (data) {
        return data.state.foo + 1;
    }
};

// #6
exports.events = {
    'click domId' (e) {
        // handle click event
    },
    'click domIdPrefix*' (e) {
        // handle click
    }
};

// #7
exports.actions = {
    'click domIdPrefix*': {
        name: 'actionName',
        check (data, dispatchIt) {
            // check data
            // if data is correct
            dispatchIt(data).then(d => {
                // after dispatch
            });
        }
    },

    'click domId': 'actionName'
};

// #8
exports.life = {
    beforeRender () {
        // do things before render
    },

    afterClose () {
        // do things after close
    }
};

// #10
exports.mixin = {
    api () {
        // say hello
    }
};
