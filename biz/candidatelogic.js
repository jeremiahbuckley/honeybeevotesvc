// var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var async = require('async');
var bzVote = require('./votelogic.js');

var bizVote = new bzVote();

module.exports = function() {

	var logic = {};

	logic.calculateCandidateValue = function(candidatename, callback) {
		return logic.calculateCandidateValueAsOfTime(candidatename, new Date(), callback);
	};

	logic.calculateCandidateValueAsOfTime = function(candidatename, datetime, callback) {
		mongoose.models.candidate.findOne( { name: candidatename}, function (error, candidate) {
			if (error) {
				return callback(error);
			} else {
				// console.log(candidate);
				// console.log("datetime: " + datetime);
				var value = 0.0;
				try {
					if (candidate != null) {
						candidate.votes.forEach( function(current) {
							var vval = bizVote.voteValue(current, datetime);
							value = value + vval;
						});
					}
				} catch(err) {
					return callback(err);
				}
				return callback(null, value);
			}
		} );
	};

	logic.recalcAllCandidates = function( callback ) {
		mongoose.models.candidate.find( {}, function (error, candidates) {
			if (error) {
				callback(error);
			} else {
				async.each(candidates, 
					function(item, cb) {
						logic.calculateCandidateValue(item.name, 
							function(err, candidateValue) {
								if (err != null || err != undefined){
									cb(err);
								} else {
									mongoose.models.candidate.findOneAndUpdate( { name: item.name }, 
										{ value: candidateValue }, 
										{},
										function (error) {
											if (error) {
												cb(error);
											} else {
												cb();
											}
										});
								}
							});
					}, 
					callback);
			}
		});

	};

	return logic;
}

