var assert = require('assert');
var bzVote = require('../../biz/votelogic.js');
var dbmodel = require('../../model');
var mongoose = require('mongoose');


var bizVote = bzVote(null);

describe('votelogic', function() {
  describe('setVoteEnddate', function() {
    it('should set an enddate (uses the math startime+value)', function() {
    	var start = new Date();
    	var val = 10;
    	var vote = new mongoose.models.vote( { value: val, startTime: start } );

    	// this assumes the expire function is startTime+value
    	var end = new Date(start.getTime());
    	end.setMinutes(end.getMinutes() + val);
    	bizVote.setVoteEndtime(vote);

    	assert.deepEqual(vote.endTime, end);
    });
  });

  describe('checkAndExpireVote', function() {
    it('should set expired = false for current votes', function() {
    	var start = new Date();
    	var end = new Date(start.getTime());
    	var val = 10;
    	start.setMinutes(start.getMinutes() - 7);
    	end.setMinutes(end.getMinutes() + 3);
    	var vote = new mongoose.models.vote( { value: val, startTime: start, endTime: end } );

    	bizVote.checkAndExpireVote(vote);
    	assert.equal(vote.expired, false);
    });

    it('should set expired = true for old votes', function() {
    	var start = new Date();
    	var end = new Date(start.getTime());
    	var val = 5;
    	start.setMinutes(start.getMinutes() - 7);
    	end.setMinutes(end.getMinutes() -2);
    	var vote = new mongoose.models.vote( { value: val, startTime: start, endTime: end } );

    	bizVote.checkAndExpireVote(vote);
    	assert.equal(vote.expired, true);
    });

    it('should set expired = false for future votes', function() {
    	var start = new Date();
    	var end = new Date(start.getTime());
    	var val = 5;
    	start.setMinutes(start.getMinutes() + 7);
    	end.setMinutes(end.getMinutes() + 12);
    	var vote = new mongoose.models.vote( { value: val, startTime: start, endTime: end } );

    	bizVote.checkAndExpireVote(vote);
    	assert.equal(vote.expired, false);
    });

  });

});

