// create express app
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

publicDir = process.argv[2] || __dirname + '/public';
// read configuration and routes
require('./modules/config')(app);
require('./modules/routes')(app);

var port = app.get('port');
app.use(express.static(publicDir));
// console.log(__dirname);
app.use('/public',express.static(path.join(__dirname, 'public')));

app.use("/public", express.static(__dirname + "public"));

var Promise = require('bluebird');
var request = require('request');



app.listen(port, function() {
	console.log('Started on localhost: ' + port);
});