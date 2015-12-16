var CacheHandler = require('./CacheHandler.js');

var TrafficMessage = function() {};

TrafficMessage.prototype.messages = [];

TrafficMessage.prototype.get = function () {

	this.messages.push("hej");
	console.log(this.messages);



};

module.exports = new TrafficMessage();