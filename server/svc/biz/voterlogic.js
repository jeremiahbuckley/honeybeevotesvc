var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

module.exports = function() {
	var logic = {};

	logic.voterCanVote = function(voterid, callback) {
		console.log('hi ' + voterid);
		mongoose.models.candidate.find( { votes: { $elemMatch: {voter_id: voterid, expired: false }} }, 
			function (error, result) {
		console.log('hi2 ' + voterid);
				if (error != null || error != undefined) {
		console.log('hi3');
					console.log(error);
					callback(error, null);
				}
				if (result == null || result == undefined || result.length == 0) {
					console.log('no result');
					callback(null, true);
				} else {
					console.log('found something');
					console.log(result);
					callback(null, false);
				}
		console.log('hi4');
			});
	}

	return logic;
}

