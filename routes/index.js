var express = require('express');
var router = express.Router();
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Express',
  	content: 'Good morning'
  });
});

router.get('/stats', function(req, res, next) {
	res.render('index', {
		title: 'Application Stats',
		app_uptime: process.uptime(),
		os_info: os
	});
});

module.exports = router;
