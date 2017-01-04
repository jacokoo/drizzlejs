const FormView = require('./form-view');
const PageModule = require('./page-module');

module.exports = (b) => {
    b.use(PageModule);

    // set options for page-module
    b.set('key', 'value')
        .set('other', 'value');

    // define items in module
    b.items((v, m) => {
        // create a view with name `name` and render to region `hello`
        // and can be accessed by `this.items.viewId`
        v('viewId').name('name').region('hello');

        // create a module with name `some/module` and can be accessed by `this.items.id`
        m('id').name('some/module')
            // map model from current module to `some/module`
            .model('from', 'to')
            // create a view with name `viewName` and render to `targetRegion`
            .view('id').name('viewName').region('targetRegion')
            // set the state of `some/module`
            .state('name', 'value')
            // render to region `region-name`
            .region('region-name');
    });

    b.computed({
        foo (data) {
            return data.state.foo;
        }
    });

    b.bind('model1', 'model2', 'model3');

    b.event((id, ids) => {
        id('id').on({ click (e) {
        } });

        id('id2').on('click', e => {
        });

        ids('idPrefix').on('change', e => {
        });

        id('id').action('actionName', 'click');
    });
};
