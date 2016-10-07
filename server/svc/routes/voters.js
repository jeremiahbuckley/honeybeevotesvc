var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

module.exports = function(dblayer) {

	router.get('/', function(req, res, next) {
		get(req, res, next, null);
	});

	router.get('/:id', function(req, res, next) {
		get(req, res, next, { _id: req.params.id });
	});

	function get(req, res, next, filter) {
		var model = dblayer.sm.model;
	 	model.voter.find(filter, function(error, response) {
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
		var model = dblayer.sm.model;
		var voter = new model.voter(req.body);
		voter.save(function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
			  res.status(201).send(req.originalUrl + `/${voter._id}`);
			}
		});
	});

	router.delete('/:id', function(req, res, next) {
		var model = dblayer.sm.model;
		model.voter.find({ _id: req.params.id}, function (error, response) {
			if (error != null) {
				res.status(500).send(error)
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else {
					model.voter.remove({ _id: req.params.id }, function(error) {
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
