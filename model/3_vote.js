var mongoose = require('mongoose');

var name = "vote";

function makeSchema() {
	var schema = mongoose.Schema({
		voter_id: { 
			type: Number,
			required: true
		},
		value: {
			type: Number,
			required: true
		},
		expired: {
			type: Boolean,
			required: true
		},
		starttime: {
			type: Date,
			required: true
		},
		endtime: {
			type: Date,
			required: true
		}
	});

	return schema;
}

function makeModel(db, schema) {
	return db.model(name, schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel,
	name: name
}