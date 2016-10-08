var mongoose = require('mongoose');

function makeSchema() {
	return mongoose.Schema({
		voter_id: Number,
		value: Number,
		expired: Boolean,
		starttime: Date,
		endtime: Date
	});
}

function makeModel(db, schema) {
	return db.model('vote', schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel
}