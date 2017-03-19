// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const async = require('async');
const bzVote = require('./votelogic.js');

const bizVote = new bzVote();

module.exports = function () {
  const logic = {};

  logic.calculateCandidateElectionValues = function (candidate, callback) {
    return logic.calculateCandidateElectionValuesAsOfTime(candidate, new Date(), callback);
  };

  logic.calculateCandidateElectionValuesAsOfTime = function (candidate, datetime, callback) {
    try {
      if (candidate) {
        candidate.candidateElections.forEach(candidateElection => {
          let value = 0.0;
          candidateElection.votes.forEach(vote => {
            const vval = bizVote.voteValue(vote, datetime);
            value += vval;
          });
          candidateElection.value = value;
        });
        candidate.save();
      }
    } catch (err) {
      return callback(err);
    }
    return callback();
  };

  logic.recalcAllCandidates = function (callback) {
    mongoose.models.candidate.find({}, (error, candidates) => {
      if (error) {
        callback(error);
      } else {
        async.each(candidates,
          (candidate, cb) => {
            logic.calculateCandidateElectionValues(candidate,
              err => {
                if (err) {
                  cb(err);
                } else {
                  cb();
                }
              });
          },
          callback);
      }
    });
  };

  return logic;
};

