var request = require('request');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

var trafficMessagesCache = path.join(__dirname, "/trafficmessages.json");

var messageCollection;

var foo = function (url) {
	return new Promise(function (resolve, reject) {
		request(url, function (err, res, str) {
			if (err) { reject(err); }
			else {
				var string = JSON.parse(str);
				var messages = string.messages;
				messages.requestDate = new Date().getTime();

				// fix the ugly date format provided by the SR Api
				for (var i = 0; i <= messages.length - 1; i++) {
					var date = parseInt(messages[i].createddate.substring(6, 19), 10);
					var formatedDate = new Date(date);
					messages[i].createddate = formatedDate;
				}

				var isCacheOld = checkCachedTime();
				console.log("efer")
				console.log(isCacheOld)
				if (isCacheOld) {
					console.log("jaaa, cache is old");
				}


				// writeToCache(JSON.stringify(messages.requestDate));

				messageCollection = messages;
				resolve(str);
			}
		});
	})
	.then(function (argument) {
		console.log("argu", argument);
	})
};

var getTrafficMessages = function () {
	checkCachedTime()
	.then(function (boo) {
		console.log(boo);
	})

}

var writeToCache = function (json) {
	fs.writeFile(trafficMessagesCache, json, function (err) {
		if (err) { throw err; }
		console.log("wrote ", json);
	});
};

var checkCachedTime = function () {
	return new Promise(function (resolve, reject) {
		fs.readFile(trafficMessagesCache, function (err, data) {
			if (err) {
				return console.error(err);
			}
			var intData = parseInt(data.toString(), 10);
			var now = new Date().getTime();
			var difference = 5000;

			if (now - intData > difference) {
				console.log("sparar data i tjuvgömman");
				return false;
			} else {
				console.log("tjuvgömman är stängd");
				return true;
			}
		});
	})
};



foo("http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false&sort=createddate&indent=true");


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