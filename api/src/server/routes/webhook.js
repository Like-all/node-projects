var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var settings = require('/etc/datasources/apps-api.json');

function puts(error, stdout, stderr) {
	console.log(stdout);
}

router.post('/webhook/mdblog', function(req, res) {
	try {
		if (fs.statSync('/home/apps/it-the-drote/markdown-content/')) {
			if (req.query.token == settings.webhookToken) {
				process.chdir('/home/apps/it-the-drote/markdown-content/');
				exec('git pull origin master', puts);
				process.chdir('/opt/apps-api/');
				res.send("OK\n");
			} else {
				res.status(401).send("Wrong token\n");
			}
		}
	} catch(err) {
		if(err.message.startsWith('ENOENT')) {
			try {
				process.chdir('/home/apps/it-the-drote/');
				exec('git clone https://github.com/Like-all/markdown-articles markdown-content', puts);
				process.chdir('/opt/apps-api/');
				res.send("OK\n");
			} catch(e) {
				console.log("Unable to clone repository:" + e.message);
				res.status(500).send("Unable to clone repository: " + e.message + "\n");
			}
		}
	}
});
router.post('/webhook/build-deb', function(req, res){
	var buildscript = spawn('/opt/apps-api/bin/build-deb', [req.body.repository.name], {detached: true});
	buildscript.unref();
	res.send("OK\n");
});

module.exports = router;
