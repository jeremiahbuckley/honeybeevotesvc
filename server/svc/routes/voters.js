var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var url = 'mongodb://localhost:27017/honeybeevote';

/* GET users listing. */
router.get('/', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected successfully to server");

	  db.close();
	});	
  res.send('respond with a get voter resource');
});

router.post('/', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected successfully to server");

        voter = reader_test_db.collection('voter');
        if (undefined != voter) {
        	voter.insert(req.body);
         }
	  db.close();
	});	
  res.send('respond with a post voter resource id');
});

router.delete('/', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected successfully to server");

        voter = reader_test_db.collection('voter');
        if (undefined != voter) {
        	voter.insert(req.body);
         }
	  db.close();
	});	
  res.send('respond with a delete voter resource id');
});

module.exports = router;
