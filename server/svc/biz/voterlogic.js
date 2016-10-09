var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');


module.exports = function() {

	function voterCanVote(voterid) {
		mongoose.models.candidates.find( { "voter.voter_id" :  voterid }, 
			function (error, result) {
				if (result == null || result == undefined) {
					return true;
				} else {
					return false;
				}
			});
	}
}

