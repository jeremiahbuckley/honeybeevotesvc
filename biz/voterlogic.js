var mongoose = require('mongoose');

module.exports = function() {
	var logic = {};

	logic.voterCanVote = function(voterid, callback) {
		if (typeof voterid == "string") {
			var v = voterid;
			voterid = mongoose.Type.ObjectId(v);
		}
		mongoose.models.candidate.findOne( { votes: { $elemMatch: {voterId: voterid, voterIsDormant: true }} }, 
			function (error, result) {
				if (error != null || error != undefined) {
					callback(error, null);
				}
				if (result == null || result == undefined || result.length == 0) {
					callback(null, true);
				} else {
					callback(null, false);
				}
			});
	}

	return logic;
}

