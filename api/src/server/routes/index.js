var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/ping', function(request, response) {
	response.send('OK');
});

module.exports = router;
