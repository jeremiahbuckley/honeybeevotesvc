var mongoose = require('mongoose');

var vote = require('./vote.js');

var candidateSchema = mongoose.Schema({
	id: Number,
	name: String,
	votes: [vote.voteSchema]
});

var candidate = mongoose.model('candidate', candidateSchema);

module.exports = {
	candidateSchema: candidateSchema,
	candidate: candidate
}