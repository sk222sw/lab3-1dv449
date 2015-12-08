var request = require('request');
var parseString = require('xml2js').parseString;
var Promise = require('bluebird');
var inspect = require('eyes').inspector({maxLength: false});
var cheerio = require('cheerio');

var mash = function (url) {
    var xml = "";
    var json = "";
    var hej = new Promise(function (resolve, reject) {
        return request(url, function(err, res, xml) {
            if (err) { reject(err); }
            else {
                // console.log(xml);
                resolve (xml);
            }
        });
    })
    .then(function parseThatXml(xml) {
        return parseString(xml, function(err, result) {
            json = JSON.stringify(result);
            // inspect(result);
            console.log(result);
            // return json;
        });
    })
    .then(function (j) {
        // console.log(json);    
    })
    

}

exports.mash = mash;
