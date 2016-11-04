var assert = require('assert');
var bzCandidate = require('../../biz/candidatelogic.js');
var dbmodel = require('../../model');
var mongoose = require('mongoose');


var bizCandidate = new bzCandidate();

var candidate_with_no_votes = "Dee Elliis";
var candidate_with_one_vote = "Fulton Grunge";
var candidate_with_many_votes = "Hudson Ivers"
var VOTED_VOTERID = mongoose.Types.ObjectId();
var VOTED_OLDER_VOTERID = mongoose.Types.ObjectId();
var DID_NOT_VOTE_VOTERID = mongoose.Types.ObjectId();
var currentDateStr = "2016-10-09T20:54:19.797Z";

// these values assume the vote math is votevalue = value as long as the vote hasn't expired
var single_vote_value = 10;
var multi_vote_value = 14;

describe('candidatelogic', function() {

  	describe('calculateCandidateValue', function() {


	before('before tests', function(done) {
		console.log('before');
		var c = new mongoose.models.candidate(  {
	    	"name": "Dee Ellis",
	    	"value": 0,
	    	"votes": []
 		});
		c.save(function(err, result) {
			c = new mongoose.models.candidate(  {
		    	"name": "Fulton Grunge",
		    	"value": 0,
		    	"votes": [
			      {
		        	"starttime": "2016-10-09T20:54:19.797Z",
			        "value": 10,
		    	    "voterId": VOTED_VOTERID,
		        	"endtime": "2016-10-09T21:02:19.797Z",
			        "expired": false
		    	  }
			    ]
	 		});
			c.save(function (err, result) {
				var c = new mongoose.models.candidate(  {
			    	"name": "Hudson Ivers",
			    	"value": 0,
			    	"votes": [
				      {
			        	"starttime": "2016-10-09T20:54:19.797Z",
				        "value": 8,
			    	    "voterId": VOTED_VOTERID,
			        	"endtime": "2016-10-09T21:02:19.797Z",
				        "expired": false
			    	  },
				      {
			        	"starttime": "2016-10-09T20:53:19.797Z",
				        "value": 6,
			    	    "voterId": VOTED_OLDER_VOTERID,
			        	"endtime": "2016-10-09T21:01:19.797Z",
				        "expired": true
			    	  }
				    ]
		 		});
				c.save(done);

			});

		});
	});

	after('after tests', function(done) {
		mongoose.models.candidate.remove ( { "name" :  "Dee Ellis" } , function (error, result) {
			console.log('after')
			done();
		});
	});
	
    	it('candidate with zero votes has value zero', function(done) {
    		bizCandidate.calculateCandidateValueAsOfTime(candidate_with_no_votes, new Date(currentDateStr), 
    			function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, 0);
	    			} catch(err) {
    					done(err);
    				}
    				done();
		    	} else {
		    		console.log(error);
		    		done(error);
		    	}
    		});
	    });

    	it('candidate with one vote has low value', function(done) {
    		bizCandidate.calculateCandidateValueAsOfTime(candidate_with_one_vote, new Date(currentDateStr), 
    			function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, single_vote_value);
	    			} catch(err) {
    					done(err);
    				}
    				done();
		    	} else {
		    		console.log(error);
		    		done(error);
		    	}
    		});
	    });

	    it('candidate with multiple votes has combined value', function(done) {
    		bizCandidate.calculateCandidateValueAsOfTime(candidate_with_many_votes, new Date(currentDateStr), 
    			function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, multi_vote_value);
    				} catch(err) {
    					done(err);
	    			}
    				done();
		    	} else {
		    		console.log(error);
		    		done(error);
		    	}
    		});
	    });

	});
});