
const bzVote = require('./votelogic.js');
const bzCandidate = require('./candidatelogic.js');

const bizVote = new bzVote();
const bizCandidate = new bzCandidate();
const recurrenceInSeconds = 3;

module.exports = function () {
  const x = {};

  x.startCalcInterval = function () {
    setInterval(this.recalc, recurrenceInSeconds * 1000);
  };

  x.recalc = function () {
    console.warn('starting recalc');
    bizVote.expireVotes();
    bizCandidate.recalcAllCandidates(err => {
      if (err) {
        console.error(err);
      }});
  };

  return x;
};
