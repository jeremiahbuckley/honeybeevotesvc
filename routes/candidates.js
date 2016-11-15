var express = require('express');
var router = express.Router();
var async = require('async');
var bzVote = require('../biz/votelogic.js');
var bzVoter = require('../biz/voterlogic.js');
var mongoose = require('mongoose');


module.exports = function() {

	var bizVote = bzVote();
	var bizVoter = bzVoter();

	// candidate-list
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

	// candidate - elections - votes
	router.get('/:candidateid/elections/:electionid/votes', function(req, res) {
		getVotes(req, res, null, { _id: req.params.candidateid, "candidateElections.electionId" : req.params.electionid }, req.params.electionid);
	});

	router.get('/:candidateid/elections/:electionid/votes/:id', function(req, res) {
		getVotes(req, res, null, { _id: req.params.candidateid, 
			candidateElections: { $elemMatch: { electionId : req.params.electionid, 
				votes: { $elemMatch: { _id: req.params.id }} }}}, req.params.electionid, req.params.id);
	});

	function getVotes(req, res, next, filter, electionId, voteId) {
		mongoose.models.candidate.findOne(filter, function(error, candidate) {
			if (error != null) {
				res.status(500).send(error);
			} else {
                if (candidate == null || candidate == undefined) {
                    res.status(404).send();
                } else {
                	var votes = [];
                	candidate.candidateElections.forEach(function(election) {
                		if (election.electionId == electionId) {
                			if (voteId == null || voteId == undefined) {
	                			votes = election.votes;
                			} else {
                				votes = [];
                				election.votes.forEach(function(vt) {
                					if(vt._id == voteId) {
                						votes.push(vt);
                					}
                				})
                			}
                		}
                	})
                    res.status(200).send(votes);
				}
			}
		});
	}

	router.post('/:candidateid/elections/:electionid/votes', function(req, res) {
		var vote = new mongoose.models.vote(req.body);
		bizVoter.voterCanVote(vote.voterId, function(error, result) {
			if (!result) {
				res.status(500).send('Voter cannot vote until previous vote expires');
			} else {

				mongoose.models.election.findOne( { _id: req.params.electionid }, function(error, election) {
					if (error) {
						res.status(500).send(error);
					} else {
						if (election == null || election == undefined) {
							res.status(500).send('Cannot find election for vote.');
						} else {
							bizVote.setEndtimeAndExpired(vote, election);
							mongoose.models.candidate.findOne( { _id: req.params.candidateid, "candidateElections.electionId" : req.params.electionid }, 
								function (error, response) {
								if (error != null) {
									res.status(500).send(error);
								} else {
									if (response == null || response == undefined || response.length == 0) {
										res.status(404).send();
									} else  {
										mongoose.models.candidate.update( 
											{ _id: req.params.candidateid, 
											  "candidateElections.electionId" : req.params.electionid }, 
											{
												$push: {
													"candidateElections.$.votes" : {
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
															res.status(201).send(req.originalUrl + "/" + vote._id );
														});
												}
											}
										);
									}
								}
							});
						}
					}
				});
			}

		});
	});

	router.delete('/:candidateid/elections/:electionid/votes/:id', function(req, res) {
		mongoose.models.candidate.findOne( { _id: req.params.candidateid, "candidateElections.electionId" : req.params.electionid }, 
			function (error, response) {
			if (error != null) {
				res.status(500).send(error);
			} else {
				if (response == null || response == undefined || response.length == 0) {
					res.status(404).send();
				} else  {
					mongoose.models.candidate.update( 
						{ _id: req.params.candidateid, "candidateElections.electionId" : req.params.electionid }, 
						{
							$pull: {
								"candidateElections.$.votes": { _id: req.params.id }
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

	// candidate - elections
	router.get('/:candidateid/elections', function(req, res) {
		getElections(req, res, null, { _id: req.params.candidateid });
	});

	router.get('/:candidateid/elections/:id', function(req, res) {
		getElections(req, res, null, { _id: req.params.candidateid, "candidateElections.electionId" : req.params.id });
	});

	function getElections(req, res, next, filter) {
		mongoose.models.candidate.findOne(filter, function(error, candidate) {
			if (error != null) {
				res.status(500).send(error);
			} else {
                if (candidate == null || candidate == undefined) {
                    res.status(404).send();
                } else {
                    res.status(200).send(candidate.candidateElections);
				}
			}
		});
	}

	router.post('/:candidateid/elections', function(req, res) {
		var candidateElection = new mongoose.models.candidateElection(req.body);
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
								candidateElections : {
									$each: [ candidateElection ]
								}
							}
						},
						{ runValidators: true },
						function (error) {
							if (error != null) {
								res.status(500).send(error)
							} else {
								mongoose.models.candidate.findOne( { _id: req.params.candidateid }, 
									function (error, candidate) { 
										res.status(201).send(req.originalUrl + "/" + req.body.electionId );
									});
							}
						}
					);
				}
			}
		});

	});

	router.delete('/:candidateid/elections/:id', function(req, res) {
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
								'candidateElections': { electionId: req.params.id }
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

	// candidate
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
