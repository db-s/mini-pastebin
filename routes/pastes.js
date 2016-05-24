// Pastes route methods

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Paste = require('../models/paste.js');
var moment = require('moment');
var nl2br = require('nl2br');
var sanitize = require('sanitize-html');
var mysql = require('mysql');
var conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root123',
	database: 'mini-pastebin'
});

router.get('/', function(req, res, next) {
	var is_admin = (req.query.isAdmin === 'true');
	var flash_msgs = res.locals.flash;

	var sterm = req.query.s || '';
	var qry_fetch = "SELECT * FROM pastes";

	if (sterm) qry_fetch += " WHERE text = '" + decodeURIComponent(sterm) + "'";

	console.log(qry_fetch);

	conn.query(qry_fetch, function(err, results) {
		console.log(results);

		res.render('pastes', {
			pastes: (is_admin === true) ? results : null,
			flash_msgs: flash_msgs || '',
			moment: moment,
			nl2br: nl2br
		});
	});
});

router.post('/', function(req, res, next) {
	var paste_text = req.body.paste_text;
	var cur_time = moment().format('YYYY-MM-DD H:mm:ss');
	var qry_save = "INSERT INTO pastes (text, created_at, updated_at) VALUES ('" + paste_text + "', '" + cur_time + "', '" + cur_time + "')";

	console.log(qry_save);

	// Save paste
	conn.query(qry_save, function(err, result) {
		if (err) throw err;

		console.log(result.insertId);

		res.redirect('/');
	});
});

module.exports = router;
