var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var bzVote = require('../biz/votelogic.js');
var mongoose = require('mongoose');


module.exports = function() {

	var bizVote = bzVote();

	router.get('/:candidateid/votes', function(req, res, next) {
		getVote(req, res, next, { _id: req.params.candidateid });
	});

	router.get('/:candidateid/votes/:id', function(req, res, next) {
		getVote(req, res, next, { _id: req.params.candidateid, votes: { $elemMatch: { _id : req.params.id }}});
	});

	function getVote(req, res, next, filter) {
	 	mongoose.models.candidate.find(filter, function(error, response) {
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

	router.post('/:candidateid/votes', function(req, res, next) {
		var vote = new mongoose.models.vote(req.body);
		console.log(mongoose);
		bizVote.setEndtimeAndExpired(vote);
		mongoose.models.candidate.find( { _id: req.params.candidateid }, function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else  {
					mongoose.models.candidate.update( 
						{ _id: req.params.candidateid }, 
						{
							$push: {
								votes : {
									$each: [ vote ]
								}
							}
						},
						function (error, result) {
							if (error != null) {
								res.status(500).send(error)
							} else {
								mongoose.models.candidate.find( { _id: req.params.candidateid }, 
									function (error, response) { 
										res.status(201).send(req.originalUrl + `/${response[0].votes[0]._id}`);
									});
							}
						}
					);
				}
			}
		});
	});

	router.delete('/:candidateid/votes/:id', function(req, res, next) {
		var vote = new mongoose.models.vote(req.body);
		mongoose.models.candidate.find( { _id: req.params.candidateid }, function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else  {
					mongoose.models.candidate.update( 
						{ _id: req.params.candidateid }, 
						{
							$pull: {
								'votes': { _id: req.params.id }
							}
						},
						function (error, result) {
							if (error != null) {
								res.status(500).send(error)
							} else {
								res.status(200).send();
							}
						}
					);
				}
			}
		});
	});



	router.get('/', function(req, res, next) {
		get(req, res, next, null);
	});

	router.get('/:id', function(req, res, next) {
		get(req, res, next, { _id: req.params.id });
	});

	function get(req, res, next, filter) {
	 	mongoose.models.candidate.find(filter, function(error, response) {
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
		var candidate = new mongoose.models.candidate(req.body);
		candidate.save(function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
			  res.status(201).send(req.originalUrl + `/${candidate._id}`);
			}
		});
	});

	router.put('/:id', function(req, res, next) {
		mongoose.models.candidate.find({ _id: req.params.id}, function(error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					var candidate = new mongoose.models.candidate(req.body);
					candidate.save(function (error, response) {
						if (error != null) {
							res.status(500).send(error);
						} else {
							res.status(201).send(req.originalUrl + '/${candidate._id}');
						}
					});
				} else {
					mongoose.models.candidate.update( { _id: req.params.id } , req.body, function (error, response) {
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
		mongoose.models.candidate.find({_id: req.params.id}, function (error, response) {
			if (error != null) {
				res.status(500).send(error)
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else {
					mongoose.models.candidate.remove({_id: req.params.id }, function(error) {
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
