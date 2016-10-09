var mongoose = require('mongoose');

function makeSchema() {
	return mongoose.Schema({
		name: {
			type: String,
			required: true
		}
	});
}

function makeModel(db, schema) {
	return db.model('election', schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel
}