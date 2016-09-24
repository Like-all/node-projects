var express = require('express');
var router = express.Router();
var fs = require('fs');
var mc = require('mc');
var format = require('string-template');
var http = require('http');
var env = require('/usr/lib/apps-environment/javascript/getenvironment.js').getEnv();
var hostname = '';

if(env == 'development') {
	hostname = 'dev.it-the-drote.tk';
} else {
	hostname = 'it-the-drote.tk';
}

function makeHtmlContent(name, jscontent) {
	var template = fs.readFileSync('./public/js-templates/duolingo-api.js').toString();
	var langs = '';
	var data = JSON.parse(jscontent);
	for(var i = 0; i < data.length; i++) {
		langs += '<div class="duolingo"><img src="http://api.' + 
		hostname + '/static/img/countryballs/' +
		data[i].language +
		'.png"></img><div class="duolingo-counter">' +
		data[i].level + '</div>';
	}
	innerHtml = {
		htmlcontent: '<div class="duolingo"><a href="https://duolingo.com/' + name +
		'"><h3>Duolingo</h3></a></div>' +
		langs
	};
	return(format(template, innerHtml));
}

router.get('/duolingo/badges/:login', function(req,resp){
	var memcache = new mc.Client();
	memcache.connect(function() {
		console.log("Connected to memcached");
		userInfo = '';

		memcache.get("duolingo-info-" + req.params.login, function(err, memcacheResponse) {
			if(err && err.type == 'NOT_FOUND') {
				http.get('http://www.duolingo.com/users/' + req.params.login, function(res) {
					res.setEncoding('utf8');
					res.on('data', function(chunk) {
						userInfo += chunk;
					});
					var jsonData = '{}';
					res.on('end', function() {
						try {
							if(JSON.stringify(JSON.parse(userInfo).languages)) {
								jsonData = JSON.stringify(JSON.parse(userInfo).languages);
								console.log('Duolingo JSON data:' + jsonData);
								memcache.set("duolingo-info-" + req.params.login, jsonData, {flags: 0, exptime: 10800}, function(err, status) {
									console.log('Duolingo Memcache: ' + status);
									console.log('Duolingo Memcache error: ' + err);
								});
							} else {
								console.log('Can\'t parse userinfo:' + userInfo);
							}
						} catch (e) {
							console.log('Something went wrong: ' + e + '\nGot userinfo: ' + userInfo);
						}
						resp.setHeader("Content-Type", "application/javascript");
						resp.send(makeHtmlContent(req.params.login, jsonData));
					});
				});
			} else {
				resp.setHeader("Content-Type", "application/javascript");
				resp.send(makeHtmlContent(req.params.login, memcacheResponse['duolingo-info-' + req.params.login]));
			}
		});
	});
});

module.exports = router;
