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
    const voter = new mongoose.models.voter(req.body);
    voter.save((error, response) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(201).send(req.originalUrl + '/' + response._id);
      }
    });
  });

  router.delete('/:id', (req, res) => {
    mongoose.models.voter.find({_id: req.params.id}, (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else if (response) {
        mongoose.models.voter.remove({_id: req.params.id}, error => {
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

  return router;
};
