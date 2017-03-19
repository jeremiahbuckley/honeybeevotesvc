const mongoose = require('mongoose');

module.exports = function () {
  const logic = {};

  logic.voterCanVote = function (voterid, callback) {
    if (typeof voterid === 'string') {
      const v = voterid;
      voterid = mongoose.Type.ObjectId(v);
    }
    mongoose.models.candidate.findOne({'candidateElections.votes': {$elemMatch: {voterId: voterid, voterIsDormant: true}}},
      (error, result) => {
        if (error) {
          callback(error, null);
        }
        if (result) { // if voter already voted...
          callback(null, false);
        } else {
          callback(null, true);
        }
      });
  };

  return logic;
};

