// create express app
var express = require('express');
var app = express();

// read configuration and routes
require('./modules/config')(app);
require('./modules/routes')(app);

var port = app.get('port');

app.listen(port, function() {
	console.log('Started on localhost: ' + port);
});