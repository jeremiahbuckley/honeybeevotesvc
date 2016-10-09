var assert = require('assert');
var bzVote = require('../../biz/votelogic.js');
var dbmodel = require('../../model');

console.log('hi');

var bizVote = bzVote(null);
console.log('hi2');

describe('votelogic', function() {
  describe('setVoteEnddate', function() {
    it('should set an enddate (uses the math startime+value)', function() {
console.log('hi again');
    	console.log('here we go')
    	console.log(dbmodel);
    	var model = dbmodel.sm.model;
    	console.log(dbmodel);
    	console.log(model);
    	var start = new Date();
    	var val = 10;
    	var vote = new model.vote( { value: val, starttime: start } );

    	// this assumes the expire function is starttime+value
    	var end = new Date(start.getTime());
    	end.setMinutes(end.getMinutes() + val);
    	bizVote.setVoteEndtme(vote);

    	assert.deepEqual(vote.endtime, end);
    });
  });

  describe('checkAndExpireVote', function() {
    it('should set expired = false for current votes', function() {
    	var model = dbmodel.sm.model;
    	var start = new Date();
    	var end = new Date(start.getTime());
    	var val = 10;
    	start.setMinutes(start.getMinutes() - 7);
    	end.setMinutes(end.getMinutes() + 3);
    	var vote = new model.vote( { value: val, starttime: start, endtime: end } );

    	bizVote.checkAndExpireVote(vote);
    	assert.equal(vote.expired, false);
    });

    it('should set expired = true for old votes', function() {
    	var model = dbmodel.sm.model;
    	var start = new Date();
    	var end = new Date(start.getTime());
    	var val = 5;
    	start.setMinutes(start.getMinutes() - 7);
    	end.setMinutes(end.getMinutes() -2);
    	var vote = new model.vote( { value: val, starttime: start, endtime: end } );

    	bizVote.checkAndExpireVote(vote);
    	assert.equal(vote.expired, true);
    });

    it('should set expired = false for future votes', function() {
    	var model = dbmodel.sm.model;
    	var start = new Date();
    	var end = new Date(start.getTime());
    	var val = 5;
    	start.setMinutes(start.getMinutes() + 7);
    	end.setMinutes(end.getMinutes() + 12);
    	var vote = new model.vote( { value: val, starttime: start, endtime: end } );

    	bizVote.checkAndExpireVote(vote);
    	assert.equal(vote.expired, false);
    });

  });

});

