var mongoose = require('mongoose');

var name = "voter";

function makeSchema() {
	return mongoose.Schema({
		name: {
			type: String,
			required: true
		}, 
		password: {
			type: String,
			required: true
		}
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