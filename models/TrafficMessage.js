var request = require('request');
var CacheHandler = require('./CacheHandler');
var path = require('path');
var moment = require('moment');
var trafficMessagesCache = path.join(__dirname, "/trafficmessages.json");
var maxTimeDifference = 60000; // 1 minute

var srUrl = "http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false";

var TrafficMessage = function() {};

TrafficMessage.prototype.messages = [];


TrafficMessage.prototype.getMessages = function (checkBoxes) {
	return new Promise(function (resolve, reject) {
		CacheHandler.read(trafficMessagesCache)
		.then(function(cachedData) {
			if (TrafficMessage.prototype.timeToMakeNewRequest(cachedData)) {
				console.log("Time to make new request");
				return new Promise(function(resolve, reject) {
					TrafficMessage.prototype.makeRequest()
					.then(function(requestData) {
						resolve(requestData);
					});
				})
			} else {
				console.log("Read from cache");
				return new Promise(function(resolve, reject) {
					resolve(CacheHandler.read(trafficMessagesCache));
				});

			}
		})
		TrafficMessage.prototype.makeRequest()
		.then(function filterMessages(requestData) {
			var filters = [];
			var filteredMessages = [];

			if (checkBoxes) {
				if (checkBoxes.category0) filters.push(0);
				if (checkBoxes.category1) filters.push(1);
				if (checkBoxes.category2) filters.push(2);
				if (checkBoxes.category3) filters.push(3);

				var messages = requestData.messages;
					messages.forEach(function(message) {
					if (filters.indexOf(message.category) > -1) {
						filteredMessages.push(message);
					};
				})
				requestData.messages = filteredMessages;
			}
			return requestData;
		})
		.then(function (filteredMessages) {
			resolve(filteredMessages);
		});
	});
};



function translateMonthName(month) {
	switch(month.toLowerCase()) {
		case "january":
			return "januari";
		case "february":
			return "februari";
		case "march":
			return "mars";
		case "april":
			return "april";
		case "may":
			return "maj";
		case "june":
			return "juni";
		case "july":
			return "juli";
		case "august":
			return "augusti";
		case "september":
			return "september";
		case "october":
			return "oktober";
		case "november":
			return "november";
		case "december":
			return "december";
		default: 
			return "nåt gick fel";
	}
};

function formatDate(date) {
	var milliseconds = parseInt(date.substring(6, 19),10)
	return new Date(milliseconds);
};

TrafficMessage.prototype.makeRequest = function (url) {
	return new Promise(function (resolve, reject) {
		request(srUrl, function (err, res, str) {
			if (err) reject(err);
			
			var json = JSON.parse(str);
			var messages = json.messages;
			
			messages.forEach(function(message) {
				message.createddate = formatDate(message.createddate);
			})

			// // sort messages by date/time
			messages.sort(function(a,b) {
				return a.createddate - b.createddate;
			});
			messages.reverse();

			// create nicer looking date string
			messages.forEach(function(m) {
				var date = moment(m.createddate).format("D MMMM HH:mm");
				var t = date.split(" ");
				t[1] = translateMonthName(t[1]);
				var timeString = t[0] + " " + t[1] + " " + t[2];
				m.createddate = timeString;
			})

			// category Id => category text
			json.messages.forEach(function(message) {
				message.categoryText = getCategoryTitle(message.category);
			});

			json.requestDate = new Date().getTime();
			var stringData = JSON.stringify(json);
			CacheHandler.write(trafficMessagesCache, stringData);

			resolve(json);
		});
	});
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