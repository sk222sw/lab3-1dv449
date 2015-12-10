var request = require('request');
var parseString = require('xml2js').parseString;
var Promise = require('bluebird');
var inspect = require('eyes').inspector({maxLength: false});
var cheerio = require('cheerio');



var Mash = function() {};


Mash.prototype.get = function (url) {
    var ret = "";
	return new Promise(function (resolve, reject) {
	    var hej = "";
		request(url, function (err, res, str) {
			if (err) { reject(err); }
			else {
				var stuff = str;
				var parsed = JSON.parse(stuff);
                // console.log(parsed.messages[0]);

				
				print = JSON.stringify(parsed.messages[0]);
                ret = parsed;
			}
		})
				// resolve(ret);
				return ret;
	});
}

Mash.prototype.map = function() {
	
};


module.exports = new Mash();
