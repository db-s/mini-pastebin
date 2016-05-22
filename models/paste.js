// Paste model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Paste = new Schema({
	text: {
		type: String,
		required: [true, 'Where is your text?']
	},
	created_at: {
		type: Date,
		required: true
	},
	update_at: {
		type: Date,
		required: true
	}
});

module.exports = mongoose.model('Paste', Paste);