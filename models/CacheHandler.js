var fs = require('fs');

var CacheHandler = function () {};

CacheHandler.prototype.read = function (filePath) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filePath, "utf-8", function (err, data) {
			if (err) return console.error(err);
			// console.log(new Date(), " : read from cache at ", filePath);
			resolve(data);
		});
	});
};

CacheHandler.prototype.write = function (filePath, data) {
	fs.writeFile(filePath, data, function (err) {
		if (err) console.log(err);
		// console.log(new Date(), " : wrote to cache at ", filePath);
	});
};


module.exports = new CacheHandler();

