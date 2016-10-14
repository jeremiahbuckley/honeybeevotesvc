var mongoose = require('mongoose');

var name = "election";

function makeSchema() {
	return mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		candidateIds: [Number],
		voterIds: [Number]
	});
}

function makeModel(db, schema) {
	return db.model(name, schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel,
	name: name
}