var mongoose = require('mongoose');

module.exports = function() {

	var logic = {}

	logic.voteValue = function(vote, now) {
		if (now == undefined) {
			now = new Date();
		}
		var d = new Date(vote.starttime);
		console.log("   " + d.toString());
		console.log("   " + now.toString());
		now.setMinutes(now.getMinutes() + 10);
		var difference = now.getTime() - d.getTime();
		if (difference > 0) {
			//console.log(Math.round(difference/60000));
			//return vote.value * Math.round(difference / 60000); // 60000ms == 60s == 1m
			return vote.value;
		} else {
			return 0;
		}
	}

	logic.expireVotes = function() {
		var sd = new Date();
		var ed = new Date();
		sd.setMinutes(sd.getMinutes() - 10);
		ed.setMinutes(ed.getMinutes() + 10);
		mongoose.models.vote.find( {
			enddate: {
				$gte: sd,
				$lte: ed
			}
		}, function (error, result) {
			var now = new Date();
			result.forEach( function (current, index, array) {
				checkAndExpireVote(current, now);
			})
		})
	}

	logic.checkAndExpireVote = function(vote, expireTime) {
		if (expireTime == undefined) {
			expireTime = new Date();
		}
		vote.expired = false;

		if (vote.endtime.getTime() < expireTime.getTime()) {
			vote.expired = true;
		}
	}

	logic.setVoteEndtime = function(vote) {
		vote.endtime = new Date(vote.starttime.getTime());
		vote.endtime.setMinutes(vote.endtime.getMinutes() + vote.value);
	}

	logic.setEndtimeAndExpired = function(vote) {
		this.setVoteEndtime(vote);
		this.checkAndExpireVote(vote);
	}

	return logic;
}

