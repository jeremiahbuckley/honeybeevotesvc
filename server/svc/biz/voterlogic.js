var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

module.exports = function() {
	var logic = {};

	logic.voterCanVote = function(voterid, callback) {
		mongoose.models.candidate.find( { votes: { $elemMatch: {voter_id: voterid, expired: false }} }, 
			function (error, result) {
				if (error != null || error != undefined) {
					callback(error, null);
				}
				if (result == null || result == undefined || result.length == 0) {
					callback(null, true);
				} else {
					console.log(result);
					callback(null, false);
				}
			});
	}

	return logic;
}

