var frisby = require('frisby');
var tc = require('./config/test_config');
var dbConfig = require('./config/db');

var mongoClient = mongodb.MongoClient
var reader_test_db = null;

function connectDB(callback) {
    mongoClient.connect(dbConfig.testDBURL, function(err, db) {
        assert.equal(null, err);
        reader_test_db = db;
        console.log("Connected correctly to server");
        callback(0);
    });
}

function dropVoterCollection(callback) {
    console.log("dropVoterCollection");
    voter = reader_test_db.collection('voter');
    if (undefined != voter) {
        voter.drop(function(err, reply) {
            console.log('voter collection dropped');
            callback(0);
        });
    } else {
        callback(0);
    }
}

function dropElectionCollection(callback) {
    console.log("dropElectionCollection");
    election = reader_test_db.collection('election');
    if (undefined != election) {
        election.drop(function(err, reply) {
            console.log('election collection dropped');
            callback(0);
        });
    } else {
        callback(0);
    }
}

function dropCandidateCollection(callback) {
    console.log("dropCandidateCollection");
    candidate = reader_test_db.collection('candidate');
    if (undefined != candidate) {
        candidate.drop(function(err, reply) {
            console.log('candidate collection dropped');
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
