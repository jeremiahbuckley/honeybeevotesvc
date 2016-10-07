var mongoose = require('mongoose');

function makeSchema() {
	return mongoose.Schema({
		name: String
	});
}

function makeModel(db, schema) {
	return db.model('voter', schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel
}