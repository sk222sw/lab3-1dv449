// create express app
var express = require('express');
var app = express();

// read configuration and routes
require('./modules/config')(app);
require('./modules/routes')(app);

var port = app.get('port');

var Promise = require('bluebird');
var request = require('request');

Promise(function(resolve, reject) {
	request('http://api.sr.se/api/v2/traffic/messages', function(err, res, html) {
		if (err) { reject(err); }
		else { resolve(html); }
	});
})
// .then(function(result) {
//     console.log(result);
// })


app.listen(port, function() {
	console.log('Started on localhost: ' + port);
});