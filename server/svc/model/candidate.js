var mongoose = require('mongoose');

var vote = require('./vote.js');

function makeSchema() {
	return mongoose.Schema({
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