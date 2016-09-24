var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/board/items/stats', function(req, res) {
	var stats;
	try {
		stats = fs.readFileSync('/tmp/usage.json').toString();
	} catch(err) {
		stats = 'Error';
	}
	res.send(stats);
});

module.exports = router;
