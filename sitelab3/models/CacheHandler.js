var fs = require('fs');
var path = require('path');

var CacheHandler = function () {};

CacheHandler.prototype.read = function (filePath) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filePath, "utf-8", function (err, data) {
			if (err) return console.error(err);
			// data = JSON.parse(data);
			resolve(data);
		});
	});
};

CacheHandler.prototype.write = function (filePath, data) {
	fs.writeFile(filePath, data, function (err) {
		if (err) console.log(err);
		console.log("wrote to cache");
	});
};


var writeToCache = function (json) {
	fs.writeFile(trafficMessagesCache, json, function (err) {
		if (err) { throw err; }
		console.log("wrote data to ", trafficMessagesCache);
	});
};


module.exports = new CacheHandler();

