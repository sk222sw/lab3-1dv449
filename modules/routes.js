var path = require('path');

var srUrl = "http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false&sort=createddate&indent=true";
var trafficMessagesCache = path.join(__dirname, "/trafficmessages.json");
var messageCollection;

var TrafficMessage = require('./../models/TrafficMessage.js');

module.exports = function(app) {
	app.get('/:var(home|index)?', function(req, res) {
		TrafficMessage.getMessages()
		.then(function (result) {
			console.log("result", result.requestDate);
			res.render('home', {
				messageCollection: result.messages
			});
		});
	});

	app.post("/", function(req, res) {
		// console.log("///////////////")
		// console.log("filter solme shit plz")
		// console.log(req.body)
		// console.log("///////////////")

		TrafficMessage.getMessages(req.body)
		.then(function(result) {
			res.render("home", {
				messageCollection: result.messages
			});
		});
	});

	app.use(function(req, res) {
		res.type('text/plain');
		res.status(404);
		res.send('404 - not found');
	});
};