const express = require('express');
const router = express.Router();
const async = require('async');
const bzVote = require('../biz/votelogic.js');
const bzVoter = require('../biz/voterlogic.js');
const mongoose = require('mongoose');

module.exports = function () {
  const bizVote = bzVote();
  const bizVoter = bzVoter();

  // candidate-list
  router.post('/list', (req, res) => {
    async.map(req.body,
      (id, cb) => {
        mongoose.models.candidate.findOne({_id: id}, (error, response) => {
          if (error) {
            cb(error);
          } else {
            cb(null, response);
          }
        });
      },
      (error, results) => {
        if (error) {
          res.status(500).send(error);
        } else if (results) {
          const cleanResults = [];
          results.forEach(result => {
            if (result) {
              cleanResults.push(result);
            }
          });
          if (results) {
            res.status(200).send(cleanResults);
          } else {
            res.status(404).send();
          }
        } else {
          res.status(404).send();
        }
      });
  });

  // candidate - elections - votes
  router.get('/:candidateId/elections/:electionId/votes', (req, res) => {
    getVotes(req, res, null, {_id: req.params.candidateId, 'candidateElections.electionId': req.params.electionId}, req.params.electionId);
  });

  router.get('/:candidateId/elections/:electionId/votes/:id', (req, res) => {
    getVotes(req, res, null, {_id: req.params.candidateId,
      candidateElections: {$elemMatch: {electionId: req.params.electionId,
        votes: {$elemMatch: {_id: req.params.id}}}}}, req.params.electionId, req.params.id);
  });

  function getVotes(req, res, next, filter, electionId, voteId) {
    mongoose.models.candidate.findOne(filter, (error, candidate) => {
      if (error) {
        res.status(500).send(error);
      } else if (candidate) {
        let votes = [];
        candidate.candidateElections.forEach(election => {
          if (election.electionId.equals(electionId)) {
            if (voteId) {
              votes = [];
              election.votes.forEach(vt => {
                if (vt._id.equals(voteId)) {
                  votes.push(vt);
                }
              });
            } else {
              votes = election.votes;
            }
          }
        });
        res.status(200).send(votes);
      } else {
        res.status(404).send();
      }
    });
  }

  router.post('/:candidateId/elections/:electionId/votes', (req, res) => {
    const vote = new mongoose.models.vote(req.body);
    bizVoter.voterCanVote(vote.voterId, (error, result) => {
      if (result) {
        mongoose.models.election.findOne({_id: req.params.electionId}, (error, election) => {
          if (error) {
            res.status(500).send(error);
          } else if (election) {
            bizVote.setEndtimeAndExpired(vote, election);
            mongoose.models.candidate.findOne({_id: req.params.candidateId, 'candidateElections.electionId': req.params.electionId},
              (error, response) => {
                if (error) {
                  res.status(500).send(error);
                } else if (response) {
                  mongoose.models.candidate.update(
                    {_id: req.params.candidateId,
                      'candidateElections.electionId': req.params.electionId},
                    {
                      $push: {
                        'candidateElections.$.votes': {
                          $each: [vote]
                        }
                      }
                    },
                    {runValidators: true},
                    error => {
                      if (error) {
                        res.status(500).send(error);
                      } else {
                        mongoose.models.candidate.findOne({_id: req.params.candidateId},
                          () => {
                            res.status(201).send(req.originalUrl + '/' + vote._id);
                          });
                      }
                    }
                  );
                } else {
                  res.status(404).send();
                }
              });
          } else {
            res.status(500).send('Cannot find election for vote.');
          }
        });
      } else {
        res.status(500).send('Voter cannot vote until previous vote expires');
      }
    });
  });

  router.delete('/:candidateId/elections/:electionId/votes/:id', (req, res) => {
    mongoose.models.candidate.findOne({_id: req.params.candidateId, 'candidateElections.electionId': req.params.electionId},
      (error, response) => {
        if (error) {
          res.status(500).send(error);
        } else if (response) {
          mongoose.models.candidate.update(
            {_id: req.params.candidateId, 'candidateElections.electionId': req.params.electionId},
            {
              $pull: {
                'candidateElections.$.votes': {_id: req.params.id}
              }
            },
            {runValidators: true},
            error => {
              if (error) {
                res.status(500).send(error);
              } else {
                res.status(200).send();
              }
            });
        } else {
          res.status(404).send();
        }
      });
  });

  // candidate - elections
  router.get('/:candidateId/elections', (req, res) => {
    getElections(req, res, null, {_id: req.params.candidateId});
  });

  router.get('/:candidateId/elections/:id', (req, res) => {
    getElections(req, res, null, {_id: req.params.candidateId, 'candidateElections.electionId': req.params.id});
  });

  function getElections(req, res, next, filter) {
    mongoose.models.candidate.findOne(filter, (error, candidate) => {
      if (error) {
        res.status(500).send(error);
      } else if (candidate) {
        res.status(200).send(candidate.candidateElections);
      } else {
        res.status(404).send();
      }
    });
  }

  router.post('/:candidateId/elections', (req, res) => {
    const candidateElection = new mongoose.models.candidateElection({electionId: req.body.electionId, value: 0});
    mongoose.models.candidate.findOne({_id: req.params.candidateId}, (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else if (response) {
        mongoose.models.candidate.update(
          {_id: req.params.candidateId},
          {
            $push: {
              candidateElections: {
                $each: [candidateElection]
              }
            }
          },
          {runValidators: true},
          error => {
            if (error) {
              res.status(500).send(error);
            } else {
              mongoose.models.candidate.findOne({_id: req.params.candidateI},
                () => {
                  res.status(201).send(req.originalUrl + '/' + req.body.electionId);
                });
            }
          }
        );
      } else {
        res.status(404).send();
      }
    });
  });

  router.delete('/:candidateId/elections/:id', (req, res) => {
    mongoose.models.candidate.findOne({_id: req.params.candidateId}, (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else if (response) {
        mongoose.models.candidate.update(
          {_id: response._id},
          {
            $pull: {
              candidateElections: {electionId: req.params.id}
            }
          },
          {runValidators: true},
          error => {
            if (error) {
              res.status(500).send(error);
            } else {
              res.status(200).send();
            }
          }
        );
      } else {
        res.status(404).send();
      }
    });
  });

  // candidate
  router.get('/', (req, res) => {
    mongoose.models.candidate.find(null, returnGet(req, res));
  });

  router.get('/:id', (req, res) => {
    mongoose.models.candidate.findOne({_id: req.params.id}, returnGet(req, res));
  });

  function returnGet(req, res) {
    return (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else if (response) {
        res.status(200).send(response);
      } else {
        res.status(404).send();
      }
    };
  }

  router.post('/', (req, res) => {
    const candidate = new mongoose.models.candidate(req.body);
    candidate.save((error, response) => {
      if (error) {
        res.status(500).send(error);
      } else {
        const responseUrl = req.originalUrl + '/' + response._id;

        if (req.body.electionId && req.body.electionId.length > 0) {
          mongoose.models.election.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.electionId),
              {$push: {candidateIds: response._id}},
              {safe: true, upsert: true},
              error => {
                if (error) {
                  res.status(500).send(error);
                } else {
                  res.status(201).send(responseUrl);
                }
              });
        } else {
          res.status(201).send(responseUrl);
        }
      }
    });
  });

  router.put('/:id', (req, res) => {
    mongoose.models.candidate.findOne({_id: req.params.id}, (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else if (response) {
        mongoose.models.candidate.update({_id: response._id},
          req.body,
          {runValidators: true},
          error => {
            if (error) {
              res.status(500).send(error);
            } else {
              res.status(200).send(req.originalUrl);
            }
          });
      } else {
        const candidate = new mongoose.models.candidate(req.body);
        candidate.save((error, response) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.status(201).send(req.originalUrl + '/' + response._id);
          }
        });
      }
    });
  });

  router.delete('/:id', (req, res) => {
    mongoose.models.candidate.find({_id: req.params.id}, (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else if (response) {
        mongoose.models.candidate.remove({_id: req.params.id}, error => {
          if (error) {
            res.status(500).send(error);
          } else {
            mongoose.models.election.update({candidateIds: req.params.id},
              {$pullAll: {candidateIds: [req.params.id]}}, error => {
                if (error) {
                  res.status(500).send(error);
                } else {
                  res.status(200).send();
                }
              });
          }
        });
      } else {
        res.status(404).send();
      }
    });
  });

  return router;
};
