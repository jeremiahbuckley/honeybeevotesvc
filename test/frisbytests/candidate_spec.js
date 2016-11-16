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
var testStr = "Basic Candidate add Election. ";
var NAME = 'Zane Yalta';
var NAME2 = 'Xander Wiggens';
var candidateUrl;
var electionName = "Test Election";
var eId;

frisby.create(testStr + 'POST create election')
  .post(tc.url + '/elections',
    { 
      name: electionName,
      winThreshhold: 100,
      voteSustainDuration: 5,
      voterDormancyDuration: 8
    },
    { json: true },
    { headers: { 'Content-Type': 'application/json' }})
  .inspectBody()
  .expectStatus(201)
  .expectHeader('Content-Type', 'text/html; charset=utf-8')
  .expectBodyContains('/elections/')
  .after( function (error, response, body) {
    eId = body.substring('/elections/'.length);
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
        candidateUrl = body;

        frisby.create(testStr + 'POST add election to candidate')
          .post(tc.url + body + '/elections',
            { 
              electionId: eId,
              value: 0
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains(body)
          .after( function (error, response, body) {

            frisby.create(testStr + 'GET candidates')
              .get(tc.url + candidateUrl)
              .inspectBody()
              .expectStatus(200)
              .expectHeader('Content-Type', 'application/json; charset=utf-8')
              .expectJSON(
                { 
                  'name': NAME,
                  candidateElections: [
                  {
                    electionId: eId
                  }
                  ]
                })
              .expectJSONLength('candidateElections', 1)
              .afterJSON ( function (json) {
                frisby.create(testStr + 'DELETE candidates')
                  .delete(tc.url + candidateUrl)
                  .inspectBody()
                  .expectStatus(200)
                  .after( function(error, response, body) {
                    frisby.create(testStr + 'DELETE election')
                      .delete(tc.url + /elections/ + eId)
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
})();

(function () {
var testStr = "Basic Candidate add remove Election. ";
var NAME = 'Zane Yalta';
var NAME2 = 'Xander Wiggens';
var candidateUrl;
var electionName = "Test Election";
var eId;

frisby.create(testStr + 'POST create election')
  .post(tc.url + '/elections',
    { 
      name: electionName,
      winThreshhold: 100,
      voteSustainDuration: 5,
      voterDormancyDuration: 8
    },
    { json: true },
    { headers: { 'Content-Type': 'application/json' }})
  .inspectBody()
  .expectStatus(201)
  .expectHeader('Content-Type', 'text/html; charset=utf-8')
  .expectBodyContains('/elections/')
  .after( function (error, response, body) {
    eId = body.substring('/elections/'.length);
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
        candidateUrl = body;

        frisby.create(testStr + 'POST add election to candidate')
          .post(tc.url + body + '/elections',
            { 
              electionId: eId,
              value: 0
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains(body)
          .after( function (error, response, body) {

            frisby.create(testStr + 'GET candidate should have 1 election')
              .get(tc.url + candidateUrl)
              .inspectBody()
              .expectStatus(200)
              .expectHeader('Content-Type', 'application/json; charset=utf-8')
              .expectJSON(
                { 
                  'name': NAME,
                  candidateElections: [
                  {
                    electionId: eId
                  }
                  ]
                })
                .expectJSONLength('candidateElections', 1)
                .afterJSON ( function (json) {
                  frisby.create(testStr + 'POST remove election from candidate')
                    .delete(tc.url + body)
                    .inspectBody()
                    .expectStatus(200)
                    .after( function (error, response, body) {

                      frisby.create(testStr + 'GET candidate should have 0 elections')
                        .get(tc.url + candidateUrl)
                        .inspectBody()
                        .expectStatus(200)
                        .expectHeader('Content-Type', 'application/json; charset=utf-8')
                        .expectJSON(
                          { 
                            'name': NAME
                          })
                        .expectJSONLength('candidateElections', 0)
                        .afterJSON ( function (json) {
                          frisby.create(testStr + 'DELETE candidate')
                            .delete(tc.url + candidateUrl)
                            .inspectBody()
                            .expectStatus(200)
                            .after( function(error, response, body) {
                              frisby.create(testStr + 'DELETE election')
                                .delete(tc.url + /elections/ + eId)
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



(function () {
var testStr = "Get multiple candidates. ";
var cId1 = mongoose.Types.ObjectId();
var cId2 = mongoose.Types.ObjectId();
var cId3 = mongoose.Types.ObjectId();
var electionName = "Test Election";
var eId;
  
frisby.create(testStr + 'POST create election')
  .post(tc.url + '/elections',
    { 
      name: electionName,
      winThreshhold: 100,
      voteSustainDuration: 5,
      voterDormancyDuration: 8
    },
    { json: true },
    { headers: { 'Content-Type': 'application/json' }})
  .inspectBody()
  .expectStatus(201)
  .expectHeader('Content-Type', 'text/html; charset=utf-8')
  .expectBodyContains('/elections/')
  .after( function (error, response, body) {
    eId = body.substring('/elections/'.length);
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

        cId1 = body.substring('/candidates/'.length);
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

            cId2 = body.substring('/candidates/'.length);
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

                cId3 = body.substring('/candidates/'.length);
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
                                  .after( function(error, response, body) {
                                    frisby.create(testStr + 'DELETE election')
                                      .delete(tc.url + /elections/ + eId)
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
      })
      .toss();
  })
  .toss();
})();
