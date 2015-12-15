var request = require('request');
var Promise = require('bluebird');
var fs = require('fs');

var messageCollection;

var foo = function (url) {
	return new Promise(function (resolve, reject) {
		request(url, function (err, res, str) {
			if (err) { reject(err); }
			else {
				var string = JSON.parse(str);
				var messages = string.messages;

				for (var i = 0; i <= messages.length - 1; i++) {
					var date = parseInt(messages[i].createddate.substring(6, 19));
					var formatedDate = new Date(date);
					messages[i].createddate = formatedDate;
					console.log(formatedDate);
				}
				
				messageCollection = messages;
				resolve(str);
			}
		});
	}) ;
};


// var googleApiKey = fs.readFileSync("keys", "utf-8", function read(err, data) {
// 	if (err) { throw err; }
// 	else { 
// 		return data;
// 	}
// })

// var parsed = JSON.parse(googleApiKey);

foo("http://api.sr.se/api/v2/traffic/messages?format=json");


module.exports = function(app) {
	app.get('/:var(home|index)?', function(req, res) {
		res.render('home', {
			messageCollection: messageCollection
		});
	});

	app.use(function(req, res) {
		res.type('text/plain');
		res.status(404);
		res.send('404 - not found');
	});
};