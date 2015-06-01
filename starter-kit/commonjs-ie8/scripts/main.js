var drizzle, jQuery, app;

drizzle = require('drizzlejs');
jQuery = require('jquery');

require('drizzlejs/dist/jquery-adapter')(window, jQuery, drizzle);

app = new drizzle.Application({
    defaultRegion: document.getElementById('content')
});

app.show('start');
