var request = require('request');
var CacheHandler = require('./CacheHandler');
var path = require('path');
var trafficMessagesCache = path.join(__dirname, "/trafficmessages.json");
var maxTimeDifference = 5000;

var srUrl = "http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false&sort=createddate&indent=true";

var TrafficMessage = function() {};

TrafficMessage.prototype.messages = [];

TrafficMessage.prototype.getMessages = function (checkBoxes) {
	return new Promise(function (resolve, reject) {
		CacheHandler.read(trafficMessagesCache)
		.then(function (cachedData) {
			if (TrafficMessage.prototype.timeToMakeNewRequest(cachedData)) {
				console.log("time to make new request");
				return new Promise(function (resolve, reject) {
					TrafficMessage.prototype.makeRequest()
					.then(function (requestData) {
						resolve(requestData);
					});
				})
				.then(function (requestData) {
					console.log("returning requested data");
					return requestData;
				});
			} else {
				console.log("time to read from cache");
				return new Promise(function (resolve, reject) {
					resolve(CacheHandler.read(trafficMessagesCache));
				})
				.then(function (cachedData) {
					console.log("returning cached data");
					cachedData = JSON.parse(cachedData);
					return cachedData;
				});
			}
		})
		.then(function filterMessages(requestData) {
			var filters = [];
			if (checkBoxes) {
				if (checkBoxes.category0) filters.push(0);
				if (checkBoxes.category1) filters.push(1);
				if (checkBoxes.category2) filters.push(2);
				if (checkBoxes.category3) filters.push(3);
				console.log("filters äääär", filters)
				console.log(typeof requestData)
			}
			return requestData;
		})
		.then(function (filteredMessages) {
			console.log("requestDAta time", filteredMessages.requestDate);
			resolve(filteredMessages);
		});
	});
};

TrafficMessage.prototype.makeRequest = function (url) {
	return new Promise(function (resolve, reject) {
		request(srUrl, function (err, res, str) {
			if (err) reject(err);
			
			var json = JSON.parse(str);
			var messages = json.messages;
			
			// category Id => category text
			json.messages.forEach(function(message) {
				message.categoryText = getCategoryTitle(message.category);
			});

			// fix the ugly date format provided by the SR Api
			for (var i = 0; i <= messages.length - 1; i++) {
				var date = parseInt(messages[i].createddate.substring(6, 19), 10);
				var formatedDate = new Date(date);
				messages[i].createddate = formatedDate;
			}



			json.requestDate = new Date().getTime();
			var stringData = JSON.stringify(json);
			CacheHandler.write(trafficMessagesCache, stringData);

			resolve(json);
		});
	});
};

function filterMessages() {

};

function getCategoryTitle(id) {
	var categoryText;
	switch(id) {
		case 0:
			categoryText = "Vägtrafik";
			break;
		case 1:
			categoryText = "Kollektivtrafik";
			break;
		case 2:
			categoryText = "Planerad störning";
			break;
		case 3:
			categoryText = "Övrigt";
			break;
		default:
			categoryText = "Okänd status";
			break;
	}
	return categoryText;
}



TrafficMessage.prototype.timeToMakeNewRequest = function (cachedData) {
	cachedData = JSON.parse(cachedData);
	var cachedTime = cachedData.requestDate;
	var currentServerTime = new Date().getTime();
	return currentServerTime - cachedTime > maxTimeDifference;
};

module.exports = new TrafficMessage();