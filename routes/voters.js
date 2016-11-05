var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

module.exports = function() {

	router.get('/', function(req, res) {
		mongoose.models.voter.find(null, returnGet(req, res))
	});

	router.get('/:id', function(req, res) {
		mongoose.models.voter.findOne({ _id: req.params.id }, returnGet(req, res));
	});

	function returnGet (req, res) {
		return function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else {
					res.status(200).send(response)
				}
			}
		} 
	}

	router.post('/', function(req, res) {
		var voter = new mongoose.models.voter(req.body);
		voter.save(function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				res.status(201).send(req.originalUrl + "/" + response._id);
			}
		});
	});

	router.delete('/:id', function(req, res) {
		mongoose.models.voter.find({ _id: req.params.id}, function (error, response) {
			if (error != null) {
				res.status(500).send(error)
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else {
					mongoose.models.voter.remove({ _id: req.params.id }, function(error) {
						if (error != null) {
							res.status(500).send(error);
						} else {
							res.status(200).send();
						}
					});
				}
			}
		})
	});

	return router;
}
