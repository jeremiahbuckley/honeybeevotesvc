var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var mongoose = require('mongoose');

module.exports = function() {

	router.get('/', function(req, res, next) {
		get(req, res, next, null);
	});

	router.get('/:id', function(req, res, next) {
		get(req, res, next, { _id: req.params.id });
	});

	function get(req, res, next, filter) {
	 	mongoose.models.election.find(filter, function(error, response) {
	 		if (error != null) {
	 			res.status(500).send(error);
	 		} else {
	 			if (response == null || response == undefined || response.length == 0) {
	 				res.status(404).send();
	 			} else {
			 		res.status(200).send(response)
			 	}
		 	}
	 	});
	 }

	router.post('/', function(req, res, next) {
		var election = new mongoose.models.election(req.body);
		election.save(function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
			  res.status(201).send(req.originalUrl + `/${election._id}`);
			}
		});
	});

	router.put('/:id', function(req, res, next) {
		mongoose.models.election.find({ _id: req.params.id}, function(error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					var election = new mongoose.models.election(req.body);
					election.save(function (error, response) {
						if (error != null) {
							res.status(500).send(error);
						} else {
							res.status(201).send(req.originalUrl + '/${election._id}');
						}
					});
				} else {
					mongoose.models.election.update( { _id: req.params.id } , 
						req.body, 
						{ runValidators: true },
						function (error, response) {
						if (error != null) {
							res.status(500).send(error);
						} else {
							res.status(200).send(req.originalUrl);
						}
					});
				}
			}
		});
	});

	router.delete('/:id', function(req, res, next) {
		mongoose.models.election.find({ _id: req.params.id}, function (error, response) {
			if (error != null) {
				res.status(500).send(error)
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else {
					mongoose.models.election.remove({ _id: req.params.id }, function(error) {
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
