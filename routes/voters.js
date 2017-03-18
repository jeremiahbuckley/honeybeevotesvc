const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = function () {
  router.get('/', (req, res) => {
    mongoose.models.voter.find(null, returnGet(req, res));
  });

  router.get('/:id', (req, res) => {
    mongoose.models.voter.findOne({_id: req.params.id}, returnGet(req, res));
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

  router.post('/', (req, res) => {
    const voter = new mongoose.models.voter(req.body);
    voter.save((error, response) => {
      if (error === null) {
        res.status(201).send(req.originalUrl + '/' + response._id);
      } else {
        res.status(500).send(error);
      }
    });
  });

  router.delete('/:id', (req, res) => {
    mongoose.models.voter.find({_id: req.params.id}, (error, response) => {
      if (error === null) {
        if (response === null || response === undefined || response.length === 0) {
          res.status(404).send();
        } else {
          mongoose.models.voter.remove({_id: req.params.id}, error => {
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

  return router;
};
