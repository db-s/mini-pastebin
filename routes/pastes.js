// Pastes route methods

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Paste = require('../models/paste.js');
var moment = require('moment');
var nl2br = require('nl2br');
var sanitize = require('sanitize-html');

router.get('/', function(req, res, next) {
	var is_admin = (req.query.isAdmin === 'true');
	var flash_msgs = res.locals.flash;

	Paste.
		find().
		sort('-update_at').
		exec(function(err, pastes, count) {
			if (err) return next(err);

			res.render('pastes', {
				pastes: (is_admin === true) ? pastes : null,
				flash_msgs: flash_msgs || '',
				moment: moment,
				nl2br: nl2br
			});
		});
});

router.post('/', function(req, res, next) {
	var paste_text = sanitize(req.body.paste_text, {
		allowedTags: sanitize.defaults.allowedTags.concat(['img'])
	});

	// Save paste
	new Paste({
		text: paste_text,
		created_at: Date.now(),
		update_at: Date.now()
	}).save(function(err, paste, count) {
		if (err) {
			req.flash("messages", {
				"error": "Text is invalid or empty"
			});
		} else {
			req.flash("messages", {
				"success": "Text has been saved!"
			});
		}

		// If save successfull, redirect to paste index page
		res.redirect('/');
	});
});

module.exports = router;
