var mongoose = require('mongoose');

var vote = require('./vote.js');

function makeSchema() {
	return mongoose.Schema({
		id: Number,
		name: String,
		votes: [vote.makeSchema()]
	});
}

function makeModel(db, schema) {
	return db.model('candidate', schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel
}