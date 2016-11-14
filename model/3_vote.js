var mongoose = require('mongoose');

var name = "vote";

function makeSchema() {
	var schema = mongoose.Schema({
		voterId: { 
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		electionId: {
			type: mongoose.Schema.Types.ObjectId,
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
		voterIsDormant: {
			type: Boolean,
			required: true
		},
		startTime: {
			type: Date,
			required: true
		},
		endTime: {
			type: Date,
			required: true
		},
		endDormancyTime: {
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