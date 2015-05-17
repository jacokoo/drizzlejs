var $ = require('jquery');
window.$ = $;
var D = require('drizzlejs');

var app = new D.Application();
app.startRoute('todos', '/');
