var jasmine = require('jasmine-node');
var frisby = require('frisby');
var tc = require('../config/test_config');
var dbConfig = require('../config/db');
var async = require('async');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var reader_test_db = null;

function connectDB(callback) {
    MongoClient.connect(dbConfig.testDBURL, function(err, db) {
        assert.equal(null, err);
        reader_test_db = db;
        console.log("Connected correctly to server: " + dbConfig.testDBURL);
        callback(0);
    });
}

function dropVoterCollection(callback) {
    console.log("dropVoterCollection");
    voter = reader_test_db.collection('voters');
    if (undefined != voter) {
        voter.drop(function(err, reply) {
            if (err) {
                console.log(err);
            }
            console.log('voters collection dropped');
            callback(0);
        });
    } else {
        callback(0);
    }
}

function dropElectionCollection(callback) {
    console.log("dropElectionCollection");
    election = reader_test_db.collection('elections');
    if (undefined != election) {
        election.drop(function(err, reply) {
            if (err) {
                console.log(err);
            }
            if (reply) {
                console.log('elections collection dropped');
            } else {
                console.log('had some trouble dropping elections collection')
            }
            var ne = reader_test_db.collection('elections');
            if (ne != undefined) {
                console.log('elections is still here!');
            }
            callback(0);
        });
    } else {
        callback(0);
    }
}

function dropCandidateCollection(callback) {
    console.log("dropCandidateCollection");
    candidate = reader_test_db.collection('candidates');
    if (undefined != candidate) {
        candidate.drop(function(err, reply) {
            if (err) {
                console.log(err);
            }
            console.log('candidates collection dropped');
            callback(0);
        });
    } else {
        callback(0);
    }
}

function closeDB(callback) {
    reader_test_db.close();
}

async.series([connectDB, dropVoterCollection, dropCandidateCollection, dropElectionCollection, closeDB]);
