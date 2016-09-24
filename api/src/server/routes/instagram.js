var express = require('express');
var router = express.Router();
var fs = require('fs');
var mc = require('mc');
var format = require('string-template');
var https = require('https');

function makeHtmlContent(name, jscontent) {
	var template = fs.readFileSync('./public/js-templates/instagram-api.js').toString();
	var picture = JSON.parse(jscontent).display_src;
	innerHtml = {
		htmlcontent: '<div class="instagram"><a href="https://www.instagram.com/' + name +
		'"><h3>Instagram</h3></a></div><div class="instagram"><img class="instagram-pic" src="' +
		picture + '"></img></div>'
	};
	return(format(template, innerHtml));
}

router.get('/instagram/lastphoto/:login', function(request, response) {
	var memcache = new mc.Client();
	memcache.connect(function() {
		memcache.get("instagram-info-" + request.params.login,
			function(err, memcacheResponse) {
				if(err && err.type == 'NOT_FOUND') {
					https.get('https://www.instagram.com/' + request.params.login + '/',
						function(res) {
							var html = '';
							res.on('data', function(chunk){
								html += chunk;
							});
							var jsonData = '{}';
							res.on('end', function() {
								var re = /<script type="text\/javascript">window\._sharedData.*<\/script>/;
								var rawData = html.match(re);
								re = /\{.*\}/;
								try {
									if(JSON.stringify(JSON.parse(rawData[0].match(re)).entry_data.ProfilePage[0].user.media.nodes[0])) {
										jsonData = JSON.stringify(JSON.parse(rawData[0].match(re)).entry_data.ProfilePage[0].user.media.nodes[0]);
										memcache.set("instagram-info-" + request.params.login,
											jsonData,
											{flags: 0, exptime: 300},
											function(err, status) {
												console.log("Instagram memcache status: " + status);
												console.log("Instagram memcache error: " + JSON.stringify(err));
											});
									}
								} catch(e) {
									console.log('Something went wrong: ' + e + '\nGot data: ' + rawData);
								}
								response.setHeader("Content-Type", "application/javascript");
								response.send(makeHtmlContent(request.params.login,
									jsonData));
							});
						});
				} else {
					response.setHeader("Content-Type", "application/javascript");
					response.send(makeHtmlContent(request.params.login,
						memcacheResponse['instagram-info-' + request.params.login]));
				}
			});
	});
});

module.exports = router;
