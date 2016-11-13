var assert = require('assert');
var bzVote = require('../../biz/votelogic.js');
var dbmodel = require('../../model');
var mongoose = require('mongoose');


var bizVote = bzVote(null);

var testElectionName = "test-election-name";
var testVoteValue = 1234.5678;

describe('votelogic', function() {

  
    afterEach(function(done) {
        mongoose.models.candidate.remove ( { "name" :  testElectionName } , function (error, result) {
            mongoose.models.vote.remove ( { "value" :  testVoteValue } , function (error, result) {
                done();
            });
        });
    });

  describe('setVoteEnddate', function() {
    it('should set an endTime and endDormancyTime based on election settings', function() {
    	var start = new Date();
        var voteVal = testVoteValue;
    	var sustainVal = 10;
        var dormancyVal = 15;
    	var vote = new mongoose.models.vote( { value: voteVal, startTime: start } );
        var election = new mongoose.models.election( {name: testElectionName, winThreshhold: 100, voteSustainDuration: sustainVal, voterDormancyDuration: dormancyVal});

    	bizVote.setVoteEndtimes(vote, election);

        var end = new Date(start.getTime());
        end.setMinutes(end.getMinutes() + sustainVal);
        var endDormancy = new Date(start.getTime());
        endDormancy.setMinutes(endDormancy.getMinutes() + dormancyVal);

    	assert.deepEqual(vote.endTime, end);
        assert.deepEqual(vote.endDormancyTime, endDormancy);
    });
  });

  describe('checkAndExpireVote', function() {
    it('should set expired = false and voterIsDormant = true for current votes', function() {
        var testTime = new Date();
    	var start = new Date();
        start.setMinutes(start.getMinutes() - 7);
    	var end = new Date(start.getTime());
        var endDormancy = new Date(start.getTime());
        var sustainVal = 10;
        var dormancyVal = 15;
    	end.setMinutes(end.getMinutes() + sustainVal);
        endDormancy.setMinutes(endDormancy.getMinutes() + dormancyVal);
        var voteVal = testVoteValue;
    	var vote = new mongoose.models.vote( { value: voteVal, startTime: start, endTime: end, endDormancyTime: endDormancy } );
        var election = new mongoose.models.election( {name: testElectionName, winThreshhold: 100, voteSustainDuration: sustainVal, voterDormancyDuration: dormancyVal});

    	bizVote.checkAndExpireVote(vote, testTime);
    	assert.equal(vote.expired, false);
        assert.equal(vote.voterIsDormant, true);
    });

    it('should set expired = true and voterIsDormant = true for slightly aged votes', function() {
        var testTime = new Date();
        var start = new Date();
        start.setMinutes(start.getMinutes() - 11);
        var end = new Date(start.getTime());
        var endDormancy = new Date(start.getTime());
        var sustainVal = 10;
        var dormancyVal = 15;
        end.setMinutes(end.getMinutes() + sustainVal);
        endDormancy.setMinutes(endDormancy.getMinutes() + dormancyVal);
        var voteVal = testVoteValue;
        var vote = new mongoose.models.vote( { value: voteVal, startTime: start, endTime: end, endDormancyTime: endDormancy } );
        var election = new mongoose.models.election( {name: testElectionName, winThreshhold: 100, voteSustainDuration: sustainVal, voterDormancyDuration: dormancyVal});

        bizVote.checkAndExpireVote(vote, testTime);
        assert.equal(vote.expired, true);
        assert.equal(vote.voterIsDormant, true);
    });

    it('should set expired = true and voterIsDormant = false for very old votes', function() {
        var testTime = new Date();
    	var start = new Date();
        start.setMinutes(start.getMinutes() - 17);
    	var end = new Date(start.getTime());
        var endDormancy = new Date(start.getTime());
        var sustainVal = 10;
        var dormancyVal = 15;
    	end.setMinutes(end.getMinutes() + sustainVal);
        endDormancy.setMinutes(endDormancy.getMinutes() + dormancyVal);
        var voteVal = testVoteValue;
        var vote = new mongoose.models.vote( { value: voteVal, startTime: start, endTime: end, endDormancyTime: endDormancy } );
        var election = new mongoose.models.election( {name: testElectionName, winThreshhold: 100, voteSustainDuration: sustainVal, voterDormancyDuration: dormancyVal});

    	bizVote.checkAndExpireVote(vote, testTime);
    	assert.equal(vote.expired, true);
        assert.equal(vote.voterIsDormant, false);
    });

    it('should set expired = true and voterIsDormant = false for future votes', function() {
        var testTime = new Date();
    	var start = new Date();
        start.setMinutes(start.getMinutes() + 7);
    	var end = new Date(start.getTime());
        var endDormancy = new Date(start.getTime());
        var sustainVal = 10;
        var dormancyVal = 15;
    	end.setMinutes(end.getMinutes() + sustainVal);
        endDormancy.setMinutes(endDormancy.getMinutes() + dormancyVal);
        var voteVal = testVoteValue;
        var vote = new mongoose.models.vote( { value: voteVal, startTime: start, endTime: end, endDormancyTime: endDormancy } );
        var election = new mongoose.models.election( {name: testElectionName, winThreshhold: 100, voteSustainDuration: sustainVal, voterDormancyDuration: dormancyVal});

    	bizVote.checkAndExpireVote(vote, testTime);
    	assert.equal(vote.expired, true);
        assert.equal(vote.voterIsDormant, false);
    });

  });

});

