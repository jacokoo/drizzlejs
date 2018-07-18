const D = require('drizzlejs')
const H = require('handlebars/runtime')
const getFormData = require('get-form-data').default

H.registerHelper('module', function(options) {
    if (this.Self instanceof D.Module) return options.fn(this)
    return ''
})
H.registerHelper('view', function(name, options) {
    if ((this.Self instanceof D.View) && this.Self.name === name) return options.fn(this)
    return ''
})

D.adapt({
    getFormData (el) {
        return getFormData(el)
    }
})

const app = new D.Application({
    container: document.getElementById('content'),
    urlRoot: 'api',
    routers: [''],
    getResource (path) {
        return require(`./${path}`) // eslint-disable-line global-require, import/no-dynamic-require
    }
})
window.app = app

app.start('todos')
