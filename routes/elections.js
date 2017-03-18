const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = function () {
  router.get('/', (req, res) => {
    mongoose.models.election.find(null, returnGet(req, res));
  });

  router.get('/:id', (req, res) => {
    mongoose.models.election.findOne({_id: req.params.id}, returnGet(req, res));
  });

  function returnGet(req, res) {
    return function (error, response) {
      if (error === null) {
        if (response === null || response === undefined || response.length === 0) {
          res.status(404).send();
        } else {
          res.status(200).send(response);
        }
      } else {
        res.status(500).send(error);
      }
    };
  }

  router.post('/:id/candidateid/', (req, res) => {
    pushPullElectionParticipantIds(req, res, req.params.id, req.body.candidateId, true, true);
  });

  router.post('/:id/voterid/', (req, res) => {
    pushPullElectionParticipantIds(req, res, req.params.id, req.body.voterId, true, false);
  });

  router.post('/', (req, res) => {
    const election = new mongoose.models.election(req.body);
    election.save((error, response) => {
      if (error === null) {
        res.status(201).send(req.originalUrl + '/' + response._id);
      } else {
        res.status(500).send(error);
      }
    });
  });

  router.put('/:id', (req, res) => {
    mongoose.models.election.findOne({_id: req.params.id}, (error, response) => {
      if (error === null) {
        if (response === null || response === undefined || response.length === 0) {
          const election = new mongoose.models.election(req.body);
          election.save((error, response) => {
            if (error === null) {
              res.status(201).send(req.originalUrl + '/' + response._id);
            } else {
              res.status(500).send(error);
            }
          });
        } else {
          mongoose.models.election.update({_id: response._id},
            req.body,
            {runValidators: true},
            error => {
              if (error === null) {
                res.status(200).send(req.originalUrl);
              } else {
                res.status(500).send(error);
              }
            });
        }
      } else {
        res.status(500).send(error);
      }
    });
  });

  router.delete('/:id/candidateid/:candidateId', (req, res) => {
    pushPullElectionParticipantIds(req, res, req.params.id, req.params.candidateId, false, true);
  });

  router.delete('/:id/voterid/:voterId', (req, res) => {
    pushPullElectionParticipantIds(req, res, req.params.id, req.params.voterId, false, false);
  });

  router.delete('/:id', (req, res) => {
    mongoose.models.election.find({_id: req.params.id}, (error, response) => {
      if (error === null) {
        if (response === null || response === undefined || response.length === 0) {
          res.status(404).send();
        } else {
          mongoose.models.election.remove({_id: req.params.id}, error => {
            if (error === null) {
              res.status(200).send();
            } else {
              res.status(500).send(error);
            }
          });
        }
      } else {
        res.status(500).send(error);
      }
    });
  });

  function pushPullElectionParticipantIds(req, res, electionId, participantId, isPush, isCandidateId) {
    const update = {};
    let verb = '';
    let participantType = '';
    if (isPush) {
      verb = '$push';
    } else {
      verb = '$pull';
    }
    update[verb] = {};
    if (isCandidateId) {
      participantType = 'candidateIds';
    } else {
      participantType = 'voterIds';
    }
    update[verb][participantType] = mongoose.Types.ObjectId(participantId);

    mongoose.models.election.findOne({_id: electionId}, (error, response) => {
      if (error === null) {
        if (response === null || response === undefined || response.length === 0) {
          res.status(500).send('Election ' + electionId + ' does not exist.');
        } else {
          mongoose.models.election.update({_id: response._id},
            update,
            {runValidators: true},
            error => {
              if (error === null) {
                res.status(200).send(req.originalUrl);
              } else {
                res.status(500).send(error);
              }
            });
        }
      } else {
        res.status(500).send(error);
      }
    });
  }

  return router;
};
