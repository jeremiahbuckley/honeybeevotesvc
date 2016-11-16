// var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var async = require('async');
var bzVote = require('./votelogic.js');

var bizVote = new bzVote();

module.exports = function() {

	var logic = {};

	logic.calculateCandidateElectionValues = function(candidate, callback) {
		return logic.calculateCandidateElectionValuesAsOfTime(candidate, new Date(), callback);
	};

	logic.calculateCandidateElectionValuesAsOfTime = function(candidate, datetime, callback) {
		try {
			if (candidate != null) {
				candidate.candidateElections.forEach(function(candidateElection) {
					var value = 0.0;
					candidateElection.votes.forEach( function(vote) {
						const vval = bizVote.voteValue(vote, datetime);
						value = value + vval;
					});
					candidateElection.value = value;
				});
				candidate.save();
			}
		} catch (err) {
			return callback(err);
		}
		return callback();
	};

	logic.recalcAllCandidates = function( callback ) {
		mongoose.models.candidate.find( {}, function (error, candidates) {
			if (error) {
				callback(error);
			} else {
				async.each(candidates, 
					function(candidate, cb) {
						logic.calculateCandidateElectionValues(candidate, 
							function(err, result) {
								if (err != null || err != undefined){
									cb(err);
								} else {
									cb();
								}
							});
					}, 
					callback);
			}
		});

	};

	return logic;
}

