var mongoose = require('mongoose');

function makeSchema() {
	return mongoose.Schema({
		id: Number,
		name: String
	});
}

function makeModel(db, schema) {
	db.model('election', schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel
}