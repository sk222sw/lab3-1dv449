var mash = require('./mash');
var config = require('./config');
var request = require('request');
var Promise = require('bluebird');
var fs = require('fs');
var print = "sdf";
var lat = "latityde tom";
var lon = "longitude tom";
var accidentCollection;

var foo = function (url) {
	return new Promise(function (resolve, reject) {
		request(url, function (err, res, str) {
			if (err) { reject(err); }
			else {
				var stuff = str;

				var parsed = JSON.parse(stuff);
				// console.log(parsed.messages[0].latitude);
				accidentCollection = parsed.messages;
				print = JSON.stringify(parsed.messages[0]);
				lat = JSON.stringify(parsed.messages[0].latitude);
				lon = JSON.stringify(parsed.messages[0].longitude);
				
				resolve(stuff);
			}
		})
	}) 
}


var googleApiKey = fs.readFileSync("keys", "utf-8", function read(err, data) {
	if (err) { throw err; }
	else { 
		return data;
	}
})

var parsed = JSON.parse(googleApiKey);

foo("http://api.sr.se/api/v2/traffic/messages?format=json")

// regex instead of repeating app.get for /, home and index
module.exports = function(app) {
	app.get('/:var(home|index)?', function(req, res) {
		res.render('home', {
			mash: print,
			lat: lat,
			lon: lon,
			accidentCollection: accidentCollection,
			googleApiKey: JSON.parse(googleApiKey)
		});
	});

	app.get('/test', function(req, res) {
	    res.render('test', {
	    	accidentCollection: accidentCollection
	    })
	})

	app.get('/public/styles/css.css', function(req, res){
	  res.sendFile(__dirname + '/public/styles/css.css');
	});

	app.use(function(req, res) {
		res.type('text/plain');
		res.status(404);
		res.send('404 - not found');
	});
};