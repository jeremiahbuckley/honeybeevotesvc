var express = require('express');
var router = express.Router();


// module.exports = function(db) {
// 	router.get('/', function(req, res, next) {
// 		res.send('respond with a get candidate resource');
// 	});

// 	router.post('/', function(req, res, next) {
// 		res.send('respond with a post candidate resource id');
// 	});

// 	router.put('/', function(req, res, next) {
// 		res.send('respond with a put candidate resource id');
// 	});

// 	router.delete('/', function(req, res, next) {
// 		res.send('respond with a delete candidate resource id');
// 	});

// 	router.get('/:id/votes', function(req, res, next) {
// 		res.send(`respond with get votes for candidate id ${req.params.id}`);
// 	});

// 	router.post('/:id/votes', function(req, res, next) {
// 		res.send(`respond with post vote id for candidate id ${req.params.id}`);
// 	});

// 	router.put('/:id/votes', function(req, res, next) {
// 		res.send(`respond with put vote id for candidate id ${req.params.id}`);
// 	});

// 	router.delete('/:id/votes', function(req, res, next) {
// 		res.send(`respond with delete vote id for candidate id ${req.params.id}`);
// 	});

// 	return router;
// }





var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

module.exports = function(dblayer) {



	router.get('/:candidateid/votes', function(req, res, next) {
		get(req, res, next, { id: req.params.candidateid });
	});

	router.get('/:candidateid/votes/:id', function(req, res, next) {
		get(req, res, next, { id: req.params.candidateid, "votes.id" : req.params.id });
	});

	function get(req, res, next, filter) {
		var model = dblayer.sm.model;
	 	model.candidate.find(filter, function(error, response) {
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
		var model = dblayer.sm.model;
		var vote = new model.vote(req.body);
		model.candidate.find( {id: req.params.candidateid }, function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else  {
					model.candidate.update( 
						{ id: req.params.candidateid }, 
						{
							$push: {
								votes : {
									$each: [ req.body ]
								}
							}
						},
						function (error, result) {
							if (error != null) {
								res.status(500).send(error)
							} else {
								res.status(201).send(req.originalUrl + `/${req.body.id}`);
							}
						}
					);
				}
			}
		});
	});

	router.delete('/:candidateid/votes/:id', function(req, res, next) {
		var model = dblayer.sm.model;
		var vote = new model.vote(req.body);
		model.candidate.find( {id: req.params.candidateid }, function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else  {
					model.candidate.update( 
						{ id: req.params.candidateid }, 
						{
							$pull: {
								'votes': { id: req.params.id }
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
		get(req, res, next, {id: req.params.id });
	});

	function get(req, res, next, filter) {
		var model = dblayer.sm.model;
	 	model.candidate.find(filter, function(error, response) {
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
		var candidate = new model.candidate(req.body);
		candidate.save(function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
			  res.status(201).send(req.originalUrl + `/${candidate.id}`);
			}
		});
	});

	router.put('/:id', function(req, res, next) {
		var model = dblayer.sm.model;
		model.candidate.find({id: req.params.id}, function(error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					var candidate = new model.candidate(req.body);
					candidate.save(function (error, response) {
						if (error != null) {
							res.status(500).send(error);
						} else {
							res.status(201).send(req.originalUrl + '/${candidate.id}');
						}
					});
				} else {
					model.candidate.update( {id: req.params.id } , req.body, function (error, response) {
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
		var model = dblayer.sm.model;
		model.candidate.find({id: req.params.id}, function (error, response) {
			if (error != null) {
				res.status(500).send(error)
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else {
					model.candidate.remove({id: req.params.id }, function(error) {
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
