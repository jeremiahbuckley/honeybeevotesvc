var mongoose = require('mongoose');

function makeSchema() {
	return mongoose.Schema({
		id: Number,
		name: String
	});
}

function makeModel(db, schema) {
	var m = db.model('voter', schema);
	console.log(JSON.stringify(m));
	var test = new m();
	console.log(JSON.stringify(test));
	return m;
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel
}