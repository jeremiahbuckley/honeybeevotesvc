var mongoose = require('mongoose');

var voterSchema = mongoose.Schema({
	id: Number,
	name: String
});

var voter = mongoose.model('voter', voterSchema);

module.exports = {
	voterSchema: voterSchema,
	voter: voter
}