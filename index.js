// create express app
var express = require('express');
var app = express();
var fs = require('fs');

// read configuration and routes
require('./modules/config')(app);
require('./modules/routes')(app);

var port = app.get('port');

var Promise = require('bluebird');
var request = require('request');



app.listen(port, function() {
	console.log('Started on localhost: ' + port);
});