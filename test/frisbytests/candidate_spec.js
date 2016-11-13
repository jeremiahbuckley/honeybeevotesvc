var jasmine = require('jasmine-node');
var frisby = require('frisby');
var mongoose = require('mongoose');
var tc = require('../config/test_config');
var dbConfig = require('../config/db');


(function () {
var testStr = "Basic Candidate CRUD. ";
var NAME = 'Zane Yalta';
var NAME2 = 'Xander Wiggens';

frisby.create(testStr + 'POST candidate')
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

      frisby.create(testStr + 'PUT edit candidate')
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

            frisby.create(testStr + 'GET candidates')
                .get(tc.url + body)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  { 
                    'name': NAME2
                  })
                .afterJSON ( function (json) {

                  frisby.create(testStr + 'DELETE candidates')
                      .delete(tc.url + '/candidates/' + json._id)
                      .inspectBody()
                      .expectStatus(200)
                      .toss();
                })
                .toss();
          })
          .toss();
    })
    .toss();
})();


(function () {
var testStr = "Candidate with basic vote. ";

var CName = 'Victor Urban'
var VoterId = mongoose.Types.ObjectId();
var Candidatev1VoteId = mongoose.Types.ObjectId();
var Candidatev1VoteValue = 8
var Candidatev1VoteEntryDate = new Date();
var candidateUrl;
  
frisby.create(testStr + 'POST create candidate')
    .post(tc.url + '/candidates',
      { 
        'name': CName,
        'value': 0
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/')
    .after( function (error, response, body) {

        candidateUrl = body;

        frisby.create(testStr + 'POST vote')
          .post(tc.url + body + '/votes',
            { 
              'voterId': VoterId,
              'value': Candidatev1VoteValue,
              'startTime': Candidatev1VoteEntryDate
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/')
          .after (function(error, response, body) {

            frisby.create(testStr + 'GET candidate votes')
                .get(tc.url + body)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  [ 
                      {
                        'voterId' : VoterId.toString(),
                        'value' : Candidatev1VoteValue,
                        'startTime' : Candidatev1VoteEntryDate.toISOString(),
                        'expired' : false
                      }
                  ])
                .afterJSON (function (json) {
                    frisby.create(testStr + 'DELETE candidate')
                      .delete(tc.url + candidateUrl)
                      .inspectBody()
                      .expectStatus(200)
                      .toss();
                    })
                .toss();
          })
          .toss();
    })
    .toss();
})();

(function () {
var testStr = "Candidate with multiple votes. ";
var CName = 'Sanjay Tucci'
var VId1 = mongoose.Types.ObjectId();
var VId2 = mongoose.Types.ObjectId();
var CV1Value = 5
var CV1EntryDate = new Date();
var CV2Value = 2
var CV2EntryDate = new Date();
var candidateUrl;

frisby.create(testStr + 'POST candidate')
    .post(tc.url + '/candidates',
      { 
        'name': CName,
        'value': 0
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/')
    .after( function (error, response, body) {

        candidateUrl = body;

        frisby.create(testStr + 'POST Vote 1')
          .post(tc.url + candidateUrl + '/votes',
            { 
              'voterId': VId1,
              'value': CV1Value,
              'startTime': CV1EntryDate
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/')
          .after (function(error, response, body) {

            frisby.create(testStr + 'POST Vote 2')
              .post(tc.url + candidateUrl + '/votes',
                { 
                  'voterId': VId2,
                  'value': CV2Value,
                  'startTime': CV2EntryDate
                },
                { json: true },
                { headers: { 'Content-Type': 'application/json' }})
              .inspectBody()
              .expectStatus(201)
              .expectHeader('Content-Type', 'text/html; charset=utf-8')
              .expectBodyContains('/candidates/')
              .after (function(error, response, body) {

                frisby.create(testStr + 'GET candidates with multiple voters. 2 votes')
                  .get(tc.url + body)
                  .inspectBody()
                  .expectStatus(200)
                  .expectHeader('Content-Type', 'application/json; charset=utf-8')
                  .expectJSON(
                    [ 
                        {
                          'voterId' : VId1.toString(),
                          'value' : CV1Value,
                          'startTime' : CV1EntryDate.toISOString(),
                          'expired' : false
                        },
                        {
                          'voterId' : VId2.toString(),
                          'value' : CV2Value,
                          'startTime' : CV2EntryDate.toISOString(),
                          'expired' : false
                        }
                    ])
                  .afterJSON (function (json) {
                      frisby.create(testStr + 'DELETE candidate')
                        .delete(tc.url + candidateUrl)
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
})();

(function () {
var testStr = "Candidate Test Overvote. ";
var CName = 'Raul Quentin'
var VoterId = mongoose.Types.ObjectId();
var CV1Value = 7
var CV1EntryDate = new Date();
var CV2Value = 5
var CV2EntryDate = new Date();
var candidateUrl;
  
frisby.create(testStr + 'POST create candidate')
    .post(tc.url + '/candidates',
      { 
        'name': CName,
        'value': 0
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/')
    .after( function (error, response, body) {

        candidateUrl = body;

        frisby.create(testStr + 'POST Vote 1')
          .post(tc.url + candidateUrl + '/votes',
            { 
              'voterId': VoterId,
              'value': CV1Value,
              'startTime': CV1EntryDate
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/')
          .after (function(error, response, body) {

            frisby.create(testStr + 'POST Vote 2')
              .post(tc.url + candidateUrl + '/votes',
                { 
                  'voterId': VoterId,
                  'value': CV2Value,
                  'startTime': CV2EntryDate
                },
                { json: true },
                { headers: { 'Content-Type': 'application/json' }})
              .inspectBody()
              .expectStatus(500)
              .expectHeader('Content-Type', 'text/html; charset=utf-8')
              .expectBodyContains('Voter cannot vote until previous vote expires')
              .after (function(error, response, body) {

                frisby.create(testStr + 'GET candidate. Only 1 vote.')
                    .get(tc.url + candidateUrl + '/votes/')
                    .inspectBody()
                    .expectStatus(200)
                    .expectHeader('Content-Type', 'application/json; charset=utf-8')
                    .expectJSON(
                      [ 
                          {
                            'voterId' : VoterId.toString(),
                            'value' : CV1Value,
                            'startTime' : CV1EntryDate.toISOString(),
                            'expired' : false
                          }
                      ])
                    .afterJSON (function (json) {
                        frisby.create(testStr + 'DELETE candidate.')
                          .delete(tc.url + candidateUrl)
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
})();

(function () {
var testStr = "Get multiple candidates. ";
var cId1 = mongoose.Types.ObjectId();
var cId2 = mongoose.Types.ObjectId();
var cId3 = mongoose.Types.ObjectId();

  
frisby.create(testStr + 'POST candidate 1')
    .post(tc.url + '/candidates',
      { 
        'name': 'c1',
        'value': 0
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/')
    .after( function (error, response, body) {

      cId1 = body.substring('/elections/'.length + 1);
      frisby.create(testStr + 'POST candidate 2')
          .post(tc.url + '/candidates',
            { 
              'name': 'c2',
              'value': 0
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/')
          .after( function (error, response, body) {

            cId2 = body.substring('/elections/'.length + 1);
            frisby.create(testStr + 'POST candidate 3')
                .post(tc.url + '/candidates',
                  { 
                    'name': 'c3',
                    'value': 0
                  },
                  { json: true },
                  { headers: { 'Content-Type': 'application/json' }})
                .inspectBody()
                .expectStatus(201)
                .expectHeader('Content-Type', 'text/html; charset=utf-8')
                .expectBodyContains('/candidates/')
                .after( function (error, response, body) {

                  cId3 = body.substring('/elections/'.length + 1);
                  frisby.create(testStr + 'POST find 3 candidates')
                      .post(tc.url + '/candidates/list',
                        [ cId1, cId2, cId3],
                        { json: true },
                        { headers: { 'Content-Type': 'application/json' }})
                      .inspectBody()
                      .expectStatus(200)
                      .expectHeader('Content-Type', 'application/json; charset=utf-8')
                      .expectJSON(
                        [{
                          _id: cId1

                        },{
                          _id: cId2

                        },{
                          _id: cId3
                        }
                        ])
                      .after( function (error, response, body) {

                        frisby.create(testStr + 'DELETE candidate 2.')
                          .delete(tc.url + '/candidates/' + cId2)
                          .inspectBody()
                          .expectStatus(200)
                          .after( function (error, response, body) {

                            frisby.create(testStr + 'POST try for 3, return 2 candidates')
                                .post(tc.url + '/candidates/list',
                                  [ cId1, cId2, cId3],
                                  { json: true },
                                  { headers: { 'Content-Type': 'application/json' }})
                                .inspectBody()
                                .expectStatus(200)
                                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                                .expectJSON(
                                  [{
                                    _id: cId1

                                  },{
                                    _id: cId3
                                  }
                                  ])
                                .after( function (error, response, body) {
                                  frisby.create(testStr + 'DELETE candidate 3.')
                                    .delete(tc.url + '/candidates/' + cId3)
                                    .inspectBody()
                                    .expectStatus(200)
                                    .after( function (error, response, body) {

                                      frisby.create(testStr + 'DELETE candidate 1.')
                                        .delete(tc.url + '/candidates/' + cId1)
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
                  })
                  .toss();
            })
            .toss();
      })
      .toss();
})();
