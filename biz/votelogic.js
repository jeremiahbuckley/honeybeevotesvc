const mongoose = require('mongoose');

module.exports = function () {
  const logic = {};

  logic.voteValue = function (vote, asOfTime) {
    if (asOfTime === undefined) {
      asOfTime = new Date();
    }
    const startTime = new Date(vote.startTime);
    const endTime = new Date(vote.endTime);
    const sTdifference = asOfTime.getTime() - startTime.getTime();
    const eTdifference = asOfTime.getTime() - endTime.getTime();
    // console.log('asOfTime: ' + asOfTime.toString());
    // console.log('startTime: ' + startTime.toString());
    // console.log('endTime: ' + endTime.toString());
    // console.log('sTdifference: ' + sTdifference + ', eTdifference: ' + eTdifference);
    if (sTdifference >= 0 && eTdifference < 0) {
      return vote.value;
    }
    return 0;
  };

  logic.expireVotes = function () {
    mongoose.models.candidate.find({$or: [{'candidateElections.votes.expired': false},
                                         {'candidateElections.votes.voterIsDormant': true}]},
      (error, candidates) => {
        if (error) {
          console.log(error.message);
        } else {
          // console.log("Result " + candidates);
          const now = new Date();
          candidates.forEach(candidate => {
            candidate.candidateElections.forEach(candidateElection => {
              candidateElection.votes.forEach(vote => {
                let needSave = false;
                if (!vote.expired || vote.voterIsDormant) {
                  // console.log("Vote to fix: " + vote);
                  if (logic.checkAndExpireVote(vote, now)) {
                    needSave = true;
                  }
                }
                if (needSave) {
                  candidate.save(err => {
                    if (err) {
                      console.log(err.message);
                    }
                  });
                }
              });
            });
          });
        }
      });
  };

  logic.checkAndExpireVote = function (vote, testTime) {
    if (testTime === undefined) {
      testTime = new Date();
    }

    let needSave = false;
    // console.log(vote);
    // console.log(testTime);
    if (vote.endTime.getTime() < testTime.getTime()) {
      // console.log("Expired: " + vote._id);
      vote.expired = true;
      needSave = true;
    } else {
      if (testTime.getTime() < vote.startTime.getTime()) {
        // console.log("Expired: " + vote._id);
        vote.expired = true;
        needSave = true;
      } else {
        // console.log("Not-expired: " + vote._id);
        vote.expired = false;
      }
    }

    if (vote.endDormancyTime === null || vote.endDormancyTime === undefined) {
      if (vote.endTime === null || vote.endTime === undefined) {
        vote.endDormancyTime = new Date(vote.startTime.getTime());
        needSave = true;
      } else {
        vote.endDormancyTime = new Date(vote.endTime.getTime());
        needSave = true;
      }
    }

    if (vote.endDormancyTime.getTime() < testTime.getTime()) {
      // console.log("voter active: " + vote._id);
      vote.voterIsDormant = false;
      needSave = true;
    } else {
      if (testTime.getTime() < vote.startTime.getTime()) {
        // console.log("voter active: " + vote._id);
        vote.voterIsDormant = false;
        needSave = true;
      } else {
        // console.log("voter dormant: " + vote._id);
        vote.voterIsDormant = true;
      }
    }

    return needSave;
  };

  logic.setVoteEndtimes = function (vote, election) {
    vote.endTime = new Date(vote.startTime.getTime());
    vote.endDormancyTime = new Date(vote.startTime.getTime());

    vote.endTime.setMinutes(vote.endTime.getMinutes() + election.voteSustainDuration);
    vote.endDormancyTime.setMinutes(vote.endDormancyTime.getMinutes() + election.voterDormancyDuration);
  };

  logic.setVoteStartTimeIfNull = function (vote) {
    if (!vote.startTime) {
      vote.startTime = new Date();
    }
  };

  logic.setEndtimeAndExpired = function (vote, election) {
    this.setVoteStartTimeIfNull(vote);
    this.setVoteEndtimes(vote, election);
    this.checkAndExpireVote(vote);
  };

  return logic;
};

