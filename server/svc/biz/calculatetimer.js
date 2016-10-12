
var bzVote = require('./votelogic.js');
var bzCandidate = require('./candidatelogic.js');

var bizVote = new bzVote();
var bizCandidate = new bzCandidate();
var recurrenceInSeconds = 3;

module.exports = function() {

	var x = {};

	x.startCalcInterval = function() {
		setInterval(this.recalc, recurrenceInSeconds * 1000)
	};

	x.recalc = function() {
		console.warn("starting recalc");
		bizVote.expireVotes();
		bizCandidate.recalcAllCandidates(function(err) { if (err) { console.error(err)}});
	}

	return x;
}