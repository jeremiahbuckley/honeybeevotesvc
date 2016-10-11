var mongoose = require('mongoose');

var name = "candidate";

function makeSchema() {
	return mongoose.Schema({
		name: { 
			type: String,
			required: true
		},
		value: {
			type: Number, 
			required: true
		},
		votes: [mongoose.model('vote').schema]
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