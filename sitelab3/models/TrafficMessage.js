var request = require('request');
var CacheHandler = require('./CacheHandler');
var path = require('path');
var trafficMessagesCache = path.join(__dirname, "/trafficmessages.json");
var maxTimeDifference = 1000 * 60;

var srUrl = "http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false&sort=createddate&indent=true";

var TrafficMessage = function() {};

TrafficMessage.prototype.messages = [];

TrafficMessage.prototype.getMessages = function (path) {
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
		.then(function (requestData) {
			console.log("requestDAta time", requestData.requestDate);
			resolve(requestData);
		});
	});
};

TrafficMessage.prototype.makeRequest = function (url) {
	return new Promise(function (resolve, reject) {
		request(srUrl, function (err, res, str) {
			if (err) reject(err);
			
			var json = JSON.parse(str);
			json.requestDate = new Date().getTime();
			var stringData = JSON.stringify(json);
			CacheHandler.write(trafficMessagesCache, stringData);

			resolve(json);
		});
	});
};

TrafficMessage.prototype.timeToMakeNewRequest = function (cachedData) {
	cachedData = JSON.parse(cachedData);
	var cachedTime = cachedData.requestDate;
	var currentServerTime = new Date().getTime();
	return currentServerTime - cachedTime > maxTimeDifference;
};

TrafficMessage.prototype.write = function (data) {

}

module.exports = new TrafficMessage();