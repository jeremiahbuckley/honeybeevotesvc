var assert = require('assert');
var bzVoter = require('../../biz/voterlogic.js');
var dbmodel = require('../../model');
var mongoose = require('mongoose');
var mocha = require('mocha');


var bizVoter = new bzVoter();

var VOTED_VOTERID = mongoose.Types.ObjectId();
var VOTED_EXPIRED_VOTERID = mongoose.Types.ObjectId();
var DID_NOT_VOTE_VOTERID = mongoose.Types.ObjectId();

describe('voterlogic', function() {

  	describe('voterCanVote', function() {


	beforeEach(function(done) {
		console.log('before');
		var c = new mongoose.models.candidate(  {
	    	"name": "Dee Ellis",
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
	        	"starttime": "2016-10-09T10:54:19.797Z",
		        "value": 8,
	    	    "voterId": VOTED_EXPIRED_VOTERID,
	        	"endtime": "2016-10-09T11:02:19.797Z",
		        "expired": true
	    	  }
		    ]
 		});
		c.save(done);
	});

	afterEach(function(done) {
		mongoose.models.candidate.remove ( { "name" :  "Dee Ellis" } , function (error, result) {
			console.log('after')
			done();
		});
	});
	
    	it('cannot vote if a vote is not expired', function(done) {
    		bizVoter.voterCanVote(VOTED_VOTERID, function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, false);
	    			} catch(err) {
    					done(err);
    				}
    				done();
		    	}
    		});
	    });

    	it('can vote if there is no vote', function(done) {
    		bizVoter.voterCanVote(DID_NOT_VOTE_VOTERID, function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, true);
	    			} catch(err) {
    					done(err);
    				}
    				done();
	    		}
    		});
	    });

	    it('can vote if a vote is expired', function(done) {
    		bizVoter.voterCanVote(VOTED_EXPIRED_VOTERID, function(error, result) {
    			if (error == undefined || error == null) {
    				try {
	    				assert.equal(result, true);
    				} catch(err) {
    					done(err);
	    			}
    				done();
	    		}
    		});
	    });

	});
});