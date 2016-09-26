var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
	id: Number,
	value: Number,
	entrytime: Date
});

var vote = mongoose.model('vote', voteSchema);

module.exports = {
	voteSchema: voteSchema,
	vote: vote
}