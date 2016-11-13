var express = require('express');
var router = express.Router();
var async = require('async');
var bzVote = require('../biz/votelogic.js');
var bzVoter = require('../biz/voterlogic.js');
var mongoose = require('mongoose');


module.exports = function() {

	var bizVote = bzVote();
	var bizVoter = bzVoter();

	router.post('/list', function(req, res) {
		async.map(req.body, 
			function (id, cb) {
				mongoose.models.candidate.findOne({ _id: id }, function (error, response) {
					if (error != null) {
						cb(error);
					} else {
						cb(null, response);
					}
				});
			}, 
			function (error, results) {
				if (error != null) {
					res.status(500).send(error);
				} else {
					if (results == null || results == undefined || results.length == 0) {
						res.status(404).send();
					} else {
						const cleanResults = [];
						results.forEach(function(result) {
							if (result) {
								cleanResults.push(result);
							}
						});
						if (results.length == 0) {
							res.status(404).send();
						} else {
							res.status(200).send(cleanResults);
						}
					}
				}
			});
	});

	router.get('/:candidateid/votes', function(req, res) {
		getVotes(req, res, null, { _id: req.params.candidateid });
	});

	router.get('/:candidateid/votes/:id', function(req, res) {
		getVotes(req, res, null, { _id: req.params.candidateid, votes: { $elemMatch: { _id : req.params.id }}});
	});

	function getVotes(req, res, next, filter) {
		mongoose.models.candidate.find(filter, function(error, candidates) {
			if (error != null) {
				res.status(500).send(error);
			} else {
                if (candidates == null || candidates == undefined || candidates.length == 0) {
                    res.status(404).send();
                } else {
                    res.status(200).send(candidates[0].votes)
				}
			}
		});
	}

	router.post('/:candidateid/votes', function(req, res) {
		var vote = new mongoose.models.vote(req.body);
		bizVoter.voterCanVote(vote.voterId, function(error, result) {
			if (!result) {
				res.status(500).send('Voter cannot vote until previous vote expires');
			} else {

				bizVote.setEndtimeAndExpired(vote);
				mongoose.models.candidate.findOne( { _id: req.params.candidateid }, function (error, response) {
					if (error != null) {
						res.status(500).send(error);
					} else {
						if (response == null || response == undefined || response.length == 0) {
							res.status(404).send();
						} else  {
							mongoose.models.candidate.update( 
								{ _id: response._id }, 
								{
									$push: {
										votes : {
											$each: [ vote ]
										}
									}
								},
								{ runValidators: true },
								function (error) {
									if (error != null) {
										res.status(500).send(error)
									} else {
										mongoose.models.candidate.findOne( { _id: req.params.candidateid }, 
											function (error, response) { 
												res.status(201).send(req.originalUrl + "/" + response.votes[0]._id );
											});
									}
								}
							);
						}
					}
				});

			}

		});
	});

	router.delete('/:candidateid/votes/:id', function(req, res) {
		mongoose.models.candidate.findOne( { _id: req.params.candidateid }, function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else  {
					mongoose.models.candidate.update( 
						{ _id: response._id }, 
						{
							$pull: {
								'votes': { _id: req.params.id }
							}
						}, 
						{ runValidators: true },
						function (error) {
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

	router.get('/', function(req, res) {
		mongoose.models.candidate.find(null, returnGet(req, res))
	});

	router.get('/:id', function(req, res) {
		mongoose.models.candidate.findOne({ _id: req.params.id }, returnGet(req, res));
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
		var candidate = new mongoose.models.candidate(req.body);
		candidate.save(function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				var responseUrl = req.originalUrl + "/" + response._id;

				if (req.body.electionId && req.body.electionId.length > 0) {
					mongoose.models.election.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.electionId),
					    {$push: {"candidateIds": response._id}},
					    {safe: true, upsert: true},
					    function(error, model) {
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

	router.put('/:id', function(req, res) {
		mongoose.models.candidate.findOne({ _id: req.params.id}, function(error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					var candidate = new mongoose.models.candidate(req.body);
					candidate.save(function (error, response) {
						if (error != null) {
							res.status(500).send(error);
						} else {
							res.status(201).send(req.originalUrl + "/" + response._id);
						}
					});
				} else {
					mongoose.models.candidate.update( { _id: response._id } , 
						req.body, 
						{ runValidators: true }, 
						function (error) {
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

	router.delete('/:id', function(req, res) {
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
							mongoose.models.election.update({candidateIds: req.params.id}, 
								{ $pullAll: {candidateIds: [req.params.id] }}, function(error) {
									if (error != null) {
										res.status(500).send(error);
									} else {
										res.status(200).send();
									}
								});
						}
					});
				}
			}
		})
	});




	return router;
}
