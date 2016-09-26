var mongoose = require('mongoose');

var electionSchema = mongoose.Schema({
	id: Number,
	name: String
});

var election = mongoose.model('election', electionSchema);

module.exports = {
	election: election,
	electionSchema: electionSchema
}