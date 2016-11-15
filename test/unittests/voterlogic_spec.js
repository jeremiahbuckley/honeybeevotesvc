var assert = require('assert');
var bzVoter = require('../../biz/voterlogic.js');
var dbmodel = require('../../model');
var mongoose = require('mongoose');
var mocha = require('mocha');


var bizVoter = new bzVoter();

var VOTED_VOTERID = mongoose.Types.ObjectId();
var VOTED_EXPIRED_VOTERID = mongoose.Types.ObjectId();
var DID_NOT_VOTE_VOTERID = mongoose.Types.ObjectId();
var currentDate = new Date();
var currentDateStr = currentDate.toString();

describe('voterlogic', function() {

  	describe('voterCanVote', function() {

		beforeEach(function(done) {
			var electionId;
			var e = new mongoose.models.election( {
				"name": "testElection",
				winThreshhold: 100,
				voteSustainDuration: 5,
				voterDormancyDuration: 8
			});
			e.save(function (err, result) {
				electionId = result._id;
				var c = new mongoose.models.candidate(  {
			    	"name": "Dee Ellis",
			    	"candidateElections": [
			    		{
			    			electionId: electionId,
			    			value: 0,
					    	"votes": [
						      {
					        	"startTime": currentDate.toString(),
						        "value": 8,
					    	    "voterId": VOTED_VOTERID,
					        	"endTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() + 8).toString(),
					        	"endDormancyTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() + 8).toString(),
						        "expired": false,
						        "voterIsDormant": true
					    	  },
						      {
					        	"startTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() - 30).toString(),
						        "value": 8,
					    	    "voterId": VOTED_EXPIRED_VOTERID,
					        	"endTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() - 22).toString(),
					        	"endDormancyTime": new Date(currentDate.toString()).setMinutes(new Date(currentDate.toString()).getMinutes() -22).toString(),
						        "expired": true,
						        "voterIsDormant": false
					    	  }
						    ]
			    		}
			    	]
		 		});
				c.save(done);
			});
		});

		afterEach(function(done) {
			mongoose.models.candidate.remove ( { "name" :  "Dee Ellis" } , function (error, result) {
				mongoose.models.election.remove ({"name": "testElection"}, function(error, result) {
					done();
				})
			});
		});
	
    	it('cannot vote if a vote is not expired', function(done) {
    		bizVoter.voterCanVote(VOTED_VOTERID, function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, false);
	    			} catch(err) {
    					return done(err);
    				}
    				return done();
		    	}
    		});
	    });

    	it('can vote if there is no vote', function(done) {
    		bizVoter.voterCanVote(DID_NOT_VOTE_VOTERID, function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, true);
	    			} catch(err) {
    					return done(err);
    				}
    				return done();
	    		}
    		});
	    });

	    it('can vote if a vote is expired', function(done) {
    		bizVoter.voterCanVote(VOTED_EXPIRED_VOTERID, function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, true);
    				} catch(err) {
    					return done(err);
	    			}
    				return done();
	    		}
    		});
	    });

	});
});