var express = require('express');
var router = express.Router();
var fs = require('fs');
var settings = require('/etc/datasources/apps-api.json');
var leicht = require('/usr/lib/leicht/leicht.js');
var recipient = parseInt(fs.readFileSync(settings.pisunBotRecipient, 'utf8').split('\n')[0]);

router.post('/telegram', function(req, res) {
	console.log(req.body.message);
	if (fs.existsSync('/tmp/pisun.socket')) {
		if (req.body.token == settings.pisunBotToken) {
			leicht.sendMessage(recipient, 0, req.body.message, false, "/tmp/pisun.socket");
			res.send("OK\n");
		} else {
			res.send("Wrong token\n");
		}
	} else {
		res.send("Pisun is dead\n");
	}
});

module.exports = router;
