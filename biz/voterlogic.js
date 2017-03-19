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
        if (result === null || result === undefined || result.length === 0) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      });
  };

  return logic;
};

