var request = require('request');
var CacheHandler = require('./CacheHandler');
var path = require('path');
var moment = require('moment');
var trafficMessagesCache = path.join(__dirname, "/trafficmessages.json");
var maxTimeDifference = 5000;

var srUrl = "http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false";

var TrafficMessage = function() {};

TrafficMessage.prototype.messages = [];

	// return new Promise(function (resolve, reject) {
	// 	CacheHandler.read(trafficMessagesCache)
	// 	.then(function (cachedData) {
	// 		if (TrafficMessage.prototype.timeToMakeNewRequest(cachedData)) {
	// 			return new Promise(function (resolve, reject) {
	// 				TrafficMessage.prototype.makeRequest()
	// 				.then(function (requestData) {
	// 					resolve(requestData);
	// 				});
	// 			})
	// 			.then(function (requestData) {
	// 				return requestData;
	// 			});
	// 		} else {
	// 			return new Promise(function (resolve, reject) {
	// 				resolve(CacheHandler.read(trafficMessagesCache));
	// 			})
	// 			.then(function (cachedData) {
	// 				cachedData = JSON.parse(cachedData);
	// 				return cachedData;
	// 			});
	// 		}
	// 	})

TrafficMessage.prototype.getMessages = function (checkBoxes) {
	return new Promise(function (resolve, reject) {
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

function getTimeFormatted(date) {
	// console.log(date)
	var time = date.substring(6, 19)
	var timeZone = date.substring(19, 24);
	var timeUnix = time + " " + timeZone;
	// console.log(timeUnix)
	// console.log(time)
	var mom = moment.unix(time);
	// console.log(mom)

	var timeString = moment(mom).format("D MMMM HH:mm");
	var t = timeString.split(" ");
	t[1] = translateMonthName(t[1]);
	var timeString = t[0] + " " + t[1] + " " + t[2];
	return timeString;
};

function translateMonthName(month) {
	switch(month.toLowerCase()) {
		case "january":
			return "januari";
		case "februari":
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
			return month;
	}
};

function getUnixTimeStamp(date) {
	return date.substring(6, 19);
}

function getDate2(date) {
	var milliseconds = parseInt(date.substring(6, 19),10)
	return new Date(milliseconds);
};

TrafficMessage.prototype.makeRequest = function (url) {
	return new Promise(function (resolve, reject) {
		request(srUrl, function (err, res, str) {
			if (err) reject(err);
			
			var json = JSON.parse(str);
			var messages = json.messages;
			
			// category Id => category text

			messages.forEach(function(message) {
				message.createddate = getDate2(message.createddate);
			})

			// // sort messages by date/time
			messages.sort(function(a,b) {
				return a.createddate - b.createddate;
			});

			messages.reverse();
			json.messages.forEach(function(message) {
				message.categoryText = getCategoryTitle(message.category);
			});

			// json.messages = messages;
			// for (var i = 0; i < messages.length; i++) {
			// 	console.log(getTimeFormatted(messages[i].createddate));
			// }
			
			// // fix the ugly date format provided by the SR Api
			// // new Date(parseInt(messages[0].createddate.substring(6, 19), 10))
			// for (var i = 0; i < messages.length; i++) {
			// 	messages[i].createddate = getTimeFormatted(messages[i].createddate);
			// 	// console.log(getTimeFormatted(messages[i].createddate));
			// }


			// json.requestDate = new Date().getTime();
			// var stringData = JSON.stringify(json);
			// CacheHandler.write(trafficMessagesCache, stringData);

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