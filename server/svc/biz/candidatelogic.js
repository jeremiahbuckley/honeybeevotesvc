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
		mongoose.models.candidate.findOne( { name: candidatename}, function (error, result) {
			if (error != null || error != undefined) {
				callback(error);
			} else {
				var value = 0.0;
				try {
					if (result != null) {
						result.votes.forEach( function(current) {
							console.log(current.starttime.toString());
							console.log(datetime.toString());
							var vval = bizVote.voteValue(current, datetime);
							value = value + vval;
						});
					}
				} catch(err) {
					callback(err);
				}
				callback(null, value);
			}
		} );
	};

	logic.recalcAllCandidates = function( callback ) {
		mongoose.models.candidate.find( {}, function (error, result) {
			if (error != null || error != undefined) {
				callback(error);
			} else {
				async.each(result, 
					function(item, cb) {
						logic.calculateCandidateValue(item.name, 
							function(err, result) {
								if (err != null || err != undefined){
									cb(err);
								} else {
									mongoose.models.candidate.findOneAndUpdate( { name: item.name }, 
										{ value: result }, 
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

