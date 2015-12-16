var path = require('path');

var srUrl = "http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false&sort=createddate&indent=true";
var trafficMessagesCache = path.join(__dirname, "/trafficmessages.json");
var messageCollection;

var TrafficMessage = require('./../models/TrafficMessage.js');
// TrafficMessage.getMessages()
// .then(function (data) {
// 	console.log("in routes", data.requestDate);
// })


// console.err("CACHE FUNKAR INTE RIKTIGT ÄN! ÄNDRA
//  SÅ DET SOM SPARAS TILL CACHE ÄR ETT JSON-OBJEKT EN NIVÅ HÖGRE SÅ DET ÄR TYP
//   { REQUESTDATE: 23974, MESSAGES: { MESAGE1, MEESA2G}}");




// var checkCachedTime = function () {
// 	return new Promise(function (resolve, reject) {
// 		var result;
// 		var cachedTime = 0;
// 		var intData = 0;
// 		fs.readFile(trafficMessagesCache, "utf-8", function (err, data) {
			
// 			if (err) { return console.error(err); }

// 			else {
// 				data = JSON.parse(data);
// 				if (data === "") {
// 					resolve(true);
// 				} else {

// 					if (data.requestDate != "undefined" && data.requestDate != null) {
// 						cachedTime = 0;
// 						cachedTime = data.requestDate;
// 					} else {
// 						console.log("lenght", data.length)
// 						console.log("cahced", cachedTime);
// 						console.log("shora")
// 					}
// 					intData = parseInt(cachedTime.toString(), 10);
// 					console.log(intData);
// 					var now = new Date().getTime();
// 					var difference = 5000;

// 					if (now - intData > difference) {
// 						result = true;
// 						resolve(result);
// 					} else {
// 						result = false;
// 						resolve(result);
// 					}
// 				}
// 			}
// 		});
// 	});
// };

// var getTrafficMessages = function () {
// 	checkCachedTime()
// 	.then(function (timeToCache) {
// 		if (timeToCache) {
// 			console.log("time to cache")
// 			return new Promise(function (resolve, reject) {
// 				request(srUrl, function (err, res, str) {
// 					if (err) { reject(err); }
// 					else {
// 						var string = JSON.parse(str);
// 						var messages = string.messages;
// 						messages.requestDate = new Date().getTime();
// 						console.log(messages.requestDate);

// 						// fix the ugly date format provided by the SR Api
// 						for (var i = 0; i <= messages.length - 1; i++) {
// 							var date = parseInt(messages[i].createddate.substring(6, 19), 10);
// 							var formatedDate = new Date(date);
// 							messages[i].createddate = formatedDate;
// 						}

// 						writeToCache(JSON.stringify(messages));

// 						messageCollection = messages;
// 						resolve(str);
// 					}
// 				});
// 			});
// 		} else {
// 			console.log("tjuvgömman är stängd");

// 		}
// 	});
// };

// getTrafficMessages();

// var writeToCache = function (json) {
// 	fs.writeFile(trafficMessagesCache, json, function (err) {
// 		if (err) { throw err; }
// 		console.log("wrote data to ", trafficMessagesCache);
// 	});
// };

module.exports = function(app) {
	app.get('/:var(home|index)?', function(req, res) {
		TrafficMessage.getMessages()
		.then(function (result) {
			console.log("result", result.requestDate);
			res.render('home', {
				messageCollection: result.messages
			});
		})
	});

	app.use(function(req, res) {
		res.type('text/plain');
		res.status(404);
		res.send('404 - not found');
	});
};