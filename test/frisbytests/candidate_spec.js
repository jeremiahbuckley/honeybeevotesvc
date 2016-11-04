var jasmine = require('jasmine-node');
var frisby = require('frisby');
var mongoose = require('mongoose');
var tc = require('../config/test_config');
var dbConfig = require('../config/db');

var NAME = 'Zane Yalta';
var NAME2 = 'Xander Wiggens';

// basic candidate CRUD
frisby.create('POST candidate')
    .post(tc.url + '/candidates',
      { 
        'name': NAME,
        'value': 0
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/')
    .after( function(error, response, body) {

      frisby.create('PUT edit candidate')
          .put(tc.url + body,
            { 
              'name': NAME2
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(200)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains(body)
          .after( function (error, response, body) {

            frisby.create('GET candidates')
                .get(tc.url + body)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  [{ 
                    'name': NAME2
                  }])
                .afterJSON ( function (json) {

                  frisby.create('DELETE candidates')
                      .delete(tc.url + '/candidates/' + json[0]._id)
                      .inspectBody()
                      .expectStatus(200)
                      .toss();
                })
                .toss();
          })
          .toss();
    })
    .toss();



var NAMEv1 = 'Victor Urban'
var VoterId = mongoose.Types.ObjectId();
var Candidatev1VoteId = 56
var Candidatev1VoteValue = 8
var Candidatev1VoteEntryDate = new Date();
<<<<<<< Updated upstream

// vote CRUD
frisby.create('POST candidate')
=======
var candidate_url;
  
frisby.create('POST create candidate to test vote')
>>>>>>> Stashed changes
    .post(tc.url + '/candidates',
      { 
        'name': NAMEv1,
        'value': 0
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/')
    .after( function (error, response, body) {

      frisby.create('POST candidate vote')
          .post(tc.url + body + '/votes',
            { 
              'voterId': VoterId,
              'value': Candidatev1VoteValue,
              'starttime': Candidatev1VoteEntryDate
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/')
          .after (function(error, response, body) {

            frisby.create('GET candidate with votes')
                .get(tc.url + body)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  [ 
                      {
                        'voterId' : VoterId.toString(),
                        'value' : Candidatev1VoteValue,
                        'starttime' : Candidatev1VoteEntryDate.toISOString(),
                        'expired' : false
                      }
                  ])
                .afterJSON (function (json) {
<<<<<<< Updated upstream
                    frisby.create('DELETE candidates')
                      .delete(tc.url + '/candidates/' + json[0]._id)
=======
                    frisby.create('DELETE candidate with votes')
                      .delete(tc.url + candidate_url)
>>>>>>> Stashed changes
                      .inspectBody()
                      /*.expectStatus(200) This could be a 404 */
                      .toss();
                    })
                .toss();
          })
          .toss();
    })
    .toss();





var NAMET3 = 'Sanjay Tucci'
var VoterIdT3V1 = mongoose.Types.ObjectId();
var VoterIdT3V2 = mongoose.Types.ObjectId();
var CandidateT3V1VoteValue = 5
var CandidateT3V1VoteEntryDate = new Date();
var CandidateT3V2VoteValue = 2
var CandidateT3V2VoteEntryDate = new Date();
var candidate_urlT3;


frisby.create('POST candidate to test multiple voters')
    .post(tc.url + '/candidates',
      { 
        'name': NAMET3,
        'value': 0
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/')
    .after( function (error, response, body) {

        candidate_urlT3 = body;

        frisby.create('POST candidate to test multiple voters. Vote 1')
          .post(tc.url + candidate_urlT3 + '/votes',
            { 
              'voterId': VoterIdT3V1,
              'value': CandidateT3V1VoteValue,
              'starttime': CandidateT3V1VoteEntryDate
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/')
          .after (function(error, response, body) {

            frisby.create('POST candidate to test multiple voters. Vote 2')
              .post(tc.url + candidate_urlT3 + '/votes',
                { 
                  'voterId': VoterIdT3V2,
                  'value': CandidateT3V2VoteValue,
                  'starttime': CandidateT3V2VoteEntryDate
                },
                { json: true },
                { headers: { 'Content-Type': 'application/json' }})
              .inspectBody()
              .expectStatus(201)
              .expectHeader('Content-Type', 'text/html; charset=utf-8')
              .expectBodyContains('/candidates/')
              .after (function(error, response, body) {

                frisby.create('GET candidates with multiple voters. 2 votes')
                  .get(tc.url + body)
                  .inspectBody()
                  .expectStatus(200)
                  .expectHeader('Content-Type', 'application/json; charset=utf-8')
                  .expectJSON(
                    [ 
                        {
                          'voterId' : VoterIdT3V1.toString(),
                          'value' : CandidateT3V1VoteValue,
                          'starttime' : CandidateT3V1VoteEntryDate.toISOString(),
                          'expired' : false
                        },
                        {
                          'voterId' : VoterIdT3V2.toString(),
                          'value' : CandidateT3V2VoteValue,
                          'starttime' : CandidateT3V2VoteEntryDate.toISOString(),
                          'expired' : false
                        }
                    ])
                  .afterJSON (function (json) {
                      frisby.create('DELETE candidate with multiple voters')
                        .delete(tc.url + candidate_urlT3)
                        .inspectBody()
                        .expectStatus(200)
                        .toss();
                  })
                  .toss();
              })
              .toss();
          })
          .toss();
    })
    .toss();



var NAMET4 = 'Raul Quentin'
var VoterIdT4 = mongoose.Types.ObjectId();
var CandidateT4V1VoteValue = 7
var CandidateT4V1VoteEntryDate = new Date();
var CandidateT4V2VoteValue = 5
var CandidateT4V2VoteEntryDate = new Date();
var candidate_urlT4;
  
frisby.create('POST create candidate to test no overvote')
    .post(tc.url + '/candidates',
      { 
        'name': NAMET4,
        'value': 0
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/')
    .after( function (error, response, body) {

        candidate_urlT4 = body;

        frisby.create('POST candidate to test no overvote. Vote 1')
          .post(tc.url + candidate_urlT4 + '/votes',
            { 
              'voterId': VoterIdT4,
              'value': CandidateT4V1VoteValue,
              'starttime': CandidateT4V1VoteEntryDate
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/')
          .after (function(error, response, body) {

            frisby.create('POST candidate to test no overvote. Vote 2')
              .post(tc.url + candidate_urlT4 + '/votes',
                { 
                  'voterId': VoterIdT4,
                  'value': CandidateT4V2VoteValue,
                  'starttime': CandidateT4V2VoteEntryDate
                },
                { json: true },
                { headers: { 'Content-Type': 'application/json' }})
              .inspectBody()
              .expectStatus(500)
              .expectHeader('Content-Type', 'text/html; charset=utf-8')
              .expectBodyContains('Voter cannot vote until previous vote expires')
              .after (function(error, response, body) {

                frisby.create('GET candidate to test no overvote. Only 1 vote.')
                    .get(tc.url + candidate_urlT4 + '/votes/')
                    .inspectBody()
                    .expectStatus(200)
                    .expectHeader('Content-Type', 'application/json; charset=utf-8')
                    .expectJSON(
                      [ 
                          {
                            'voterId' : VoterIdT4.toString(),
                            'value' : CandidateT4V1VoteValue,
                            'starttime' : CandidateT4V1VoteEntryDate.toISOString(),
                            'expired' : false
                          }
                      ])
                    .afterJSON (function (json) {
                        frisby.create('DELETE candidate to test no overvote.')
                          .delete(tc.url + candidate_urlT4)
                          .inspectBody()
                          .expectStatus(200)
                          .toss();
                        })
                    .toss();
              })
              .toss();
        })
        .toss();
    })
    .toss();
