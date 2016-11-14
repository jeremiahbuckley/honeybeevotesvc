var assert = require('assert');
var bzCandidate = require('../../biz/candidatelogic.js');
var dbmodel = require('../../model');
var mongoose = require('mongoose');


var bizCandidate = new bzCandidate();

var candidate_with_no_votes = "Dee Elliis";
var candidate_with_one_vote = "Fulton Grunge";
var candidate_with_many_votes = "Hudson Ivers"
var candidate_with_expiring_vote = "Jasjit Kleegle";
var testElection = "testElection";
var VOTED_VOTERID = mongoose.Types.ObjectId();
var VOTED_OLDER_VOTERID = mongoose.Types.ObjectId();
var DID_NOT_VOTE_VOTERID = mongoose.Types.ObjectId();
var currentDate = new Date();
var currentDateStr = currentDate.toString();

// these values assume the vote math is votevalue = value as long as the vote hasn't expired
var single_vote_value = 10;
var multi_vote_value = 14;
var expiring_vote_value = 0.1;

describe('candidatelogic', function() {

  	describe('calculateCandidateValue', function() {


	before('before tests', function(done) {
		var electionId;
		var e = new mongoose.models.election( {
			name: testElection,
			winThreshhold: 100,
			voteSustainDuration: 5,
			voterDormancyDuration: 8
		});
		e.save(function (err, result) {
			electionId = result._id;
			var c = new mongoose.models.candidate(  {
		    	"name": candidate_with_no_votes,
		    	"value": 0,
		    	"votes": []
	 		});
			c.save(function(err, result) {
				c = new mongoose.models.candidate(  {
			    	"name": candidate_with_one_vote,
			    	"value": 0,
			    	"votes": [
				      {
			        	"startTime": currentDate.toString(),
				        "value": 10,
			    	    "voterId": VOTED_VOTERID,
			    	    "electionId": electionId,
			        	"endTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() + 10).toString(),
			        	"endDormancyTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() + 10).toString(),
				        "expired": false,
				        "voterIsDormant": false
			    	  }
				    ]
		 		});
				c.save(function (err, result) {
					var c = new mongoose.models.candidate(  {
				    	"name": candidate_with_many_votes,
				    	"value": 0,
				    	"votes": [
					      {
				        	"startTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() - 1).toString(),
					        "value": 8,
				    	    "voterId": VOTED_VOTERID,
				    	    "electionId": electionId,
				        	"endTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() + (8 - 1)).toString(),
				        	"endDormancyTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() + (8 - 1)).toString(),
					        "expired": false,
					        "voterIsDormant": false
				    	  },
					      {
				        	"startTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() - 2).toString(),
					        "value": 6,
				    	    "voterId": VOTED_OLDER_VOTERID,
				    	    "electionId": electionId,
				        	"endTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() + (6 - 2)).toString(),
				        	"endDormancyTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() + (6 - 2)).toString(),
					        "expired": true,
					        "voterIsDormant": true
				    	  }
					    ]
			 		});
					c.save(function(err, result) {
						var c = new mongoose.models.candidate( {
					    	"name": candidate_with_expiring_vote,
					    	"value": 0,
					    	"votes": [
						      {
					        	"startTime": currentDate.toString(),
						        "value": .1,
					    	    "voterId": VOTED_VOTERID,
					    	    "electionId": electionId,
					        	"endTime": new Date(currentDate.toString()).setSeconds(new Date(currentDate.toString()).getSeconds() + (0.1 * 60)).toString(),
					        	"endDormancyTime": new Date(currentDate.toString()).setSeconds(new Date(currentDate.toString()).getSeconds() + (0.1 * 60)).toString(),
						        "expired": false,
						        "voterIsDormant": true
					    	  }
						    ]
						});
						c.save(done);
					});
				});
			});
		});
	});

	after('after tests', function(done) {
		mongoose.models.candidate.remove ( { 
				"name" : { $in: [candidate_with_no_votes, candidate_with_one_vote, candidate_with_many_votes, candidate_with_expiring_vote ] }} , 
			function (error, result) {
				mongoose.models.election.remove ({name: testElection}, function(error, result) {
					done();
				})
		});
	});
	
    	it('candidate with zero votes has value zero', function(done) {
    		bizCandidate.calculateCandidateValueAsOfTime(candidate_with_no_votes, new Date(currentDateStr), 
    			function(error, result) {
    			if (error) {
		    		console.log(error);
		    		return done(error);
		    	} else {
    				try {
	    				assert.equal(result, 0);
	    			} catch(err) {
    					return done(err);
    				}
    				return done();
		    	}
    		});
	    });

    	it('candidate with one vote has low value', function(done) {
    		bizCandidate.calculateCandidateValueAsOfTime(candidate_with_one_vote, new Date(currentDateStr), 
    			function(error, result) {
    			if (error) {
		    		console.log(error);
		    		return done(error);
		    	} else {
    				try {
	    				assert.equal(result, single_vote_value);
	    			} catch(err) {
    					return done(err);
    				}
    				return done();
		    	}
    		});
	    });

	    it('candidate with multiple votes has combined value', function(done) {
    		bizCandidate.calculateCandidateValueAsOfTime(candidate_with_many_votes, new Date(currentDateStr), 
    			function(error, result) {
    			if (error) {
		    		console.log(error);
		    		return done(error);
		    	} else {
    				try {
	    				assert.equal(result, multi_vote_value);
    				} catch(err) {
    					return done(err);
	    			}
    				return done();
		    	}
    		});
	    });

    	it('candidate vote value changes as vote expires', function(done) {
    		bizCandidate.calculateCandidateValueAsOfTime(candidate_with_expiring_vote, new Date(currentDateStr), 
    			function(error, result) {
    			if (error) {
		    		console.log(error);
		    		return done(error);
		    	} else {
    				try {
	    				assert.equal(result, expiring_vote_value);

	    				// if the test above passes...
	    				// do the calc again, a 3 seconds in the future
	    				var newCalcTime = new Date(currentDateStr);
	    				newCalcTime.setSeconds(newCalcTime.getSeconds() + (0.05 * 60));
	    				bizCandidate.calculateCandidateValueAsOfTime(candidate_with_expiring_vote, newCalcTime, 
	    					function(error, result) {
	    						if (error) {
	    							console.log(error);
	    							return done(error);
	    						} else {
	    							try {
	    								assert.equal(result, expiring_vote_value);

					    				// if the test above passes...
					    				// do the calc AGAIN, a +3 (net +6) seconds in the future, should have expired
					    				var newCalcTime = new Date(currentDateStr);
					    				newCalcTime.setSeconds(newCalcTime.getSeconds() + (0.1 * 60));
					    				bizCandidate.calculateCandidateValueAsOfTime(candidate_with_expiring_vote, newCalcTime, 
					    					function(error, result) {
					    						if (error) {
					    							console.log(error);
					    							return done(error);
					    						} else {
					    							try {
					    								assert.equal(result, 0);
					    								return done();
					    							} catch(err) {
					    								return done(err);
					    							}
					    						}
					    					});
	    							} catch(err) {
	    								return done(err);
	    							}
	    						}
	    					});
	    			} catch(err) {
    					return done(err);
    				}
		    	}
    		});
	    });

	});
});