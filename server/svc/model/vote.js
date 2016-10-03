var mongoose = require('mongoose');

function makeSchema() {
	return mongoose.Schema({
		id: Number,
		value: Number,
		entrytime: Date
	});
}

function makeModel(db, schema) {
	db.model('vote', schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel
}