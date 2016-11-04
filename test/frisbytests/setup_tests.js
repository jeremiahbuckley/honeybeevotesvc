var jasmine = require('jasmine-node');
var frisby = require('frisby');
var tc = require('../config/test_config');
var dbConfig = require('../config/db');
var async = require('async');
// var mongoose = require('mongoose');
// var dblayer = require('../../model');


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
            } else {
                if (reply) {
                    console.log('elections collection dropped');
                } else {
                    console.log('had some trouble dropping elections collection')
                }
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

function addVoters(callback) {
    console.log("add test voters");

    voter = reader_test_db.collection('voters');
    if (undefined == voter) {
        console.error('unable to create basic voters');
        return callback(0);
    } else {
        try {
            voter.insertMany( [
                {
                    name: "Aaron Burr",
                    password: "Invincible1"
                },
                {
                    name: "Charlotte Dorothy",
                    password: "Invincible1"
                }
            ]);
            return callback(0);
        } catch (err) {
            console.error(err);
            return callback(0);
        }
    }

}

function closeDB(callback) {
    console.log("closing db");
    reader_test_db.close(function(error, result) {
        return callback(0);
    });
    return callback(0);
}

async.series([connectDB, dropVoterCollection, dropCandidateCollection, dropElectionCollection, addVoters, closeDB]);
