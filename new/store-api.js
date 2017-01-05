// store api must support these things
// 1. define models
// 2. define action handlers

const OtherModel = require('./other-model');

module.exports = b => {
    b.model(m => {
        m('modelName').data([]).url('url').mixin({
            getRoot () {
                return this.data[0];
            }
        });

        m('name').use(OtherModel).set({
            root: 'items'
        });
    });

    b.action(a => {
        a('actionName').then(function(payloed) {
            // handle action
        }).then(function(returnedFromPrevious) {
            // handle the second step
        }).dispatch('anotherActionName');

        // set payload to params and send GET request
        a('actionName').get('modelName');
    });
};
