var assert = require('assert');
var bzVoter = require('../../biz/voterlogic.js');
var dbmodel = require('../../model');
var mongoose = require('mongoose');


var bizVoter = bzVoter(null);


describe('voterlogic', function() {
  describe('daddy stinks', function() {
    it('daddy doth stinketh', function() {
    	assert.equal(0, 1);
    });
  });
});