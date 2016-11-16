var jasmine = require('jasmine-node');
var frisby = require('frisby');
var mongoose = require('mongoose');
var tc = require('../config/test_config');
var dbConfig = require('../config/db');

(function() {
var testStr = "Election basic CRUD. ";
var NAME = 'Election Main 1';
var NAME2 = 'Election North ';

frisby.create(testStr + 'POST election')
    .post(tc.url + '/elections',
      { 
        'name': NAME
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/elections/')
    .after( function( error, response, body ) {

      frisby.create(testStr + 'PUT edit election')
          .put(tc.url + body,
            { 
              'name': NAME2
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(200)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/elections/')
          .after( function(error, response, body) {

            frisby.create(testStr + 'GET elections')
                .get(tc.url + body)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  { 
                    'name': NAME2
                  })
                .afterJSON ( function (json) {
                  frisby.create(testStr + 'DELETE elections')
                      .delete(tc.url + '/elections/' + json._id)
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

(function() {
var testStr = "Election add Candidate. ";
var NAME = 'Election Main 1';
var electionIdUrl;
var electionId;
var candidateId = mongoose.Types.ObjectId();
frisby.create(testStr + 'POST election')
    .post(tc.url + '/elections',
      { 
        'name': NAME
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/elections/')
    .after( function( error, response, body ) {

      electionIdUrl = body;
      electionId = body.substring('/elections/'.length);

      frisby.create(testStr + 'POST add candidates to election')
          .post(tc.url + "/elections/" + electionId + "/candidateid/",
            {
              'candidateId' : candidateId.toString()
            }, 
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(200)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/elections/')
          .after( function(error, response, body) {

            frisby.create(testStr + 'GET elections with candidates')
                .get(tc.url + electionIdUrl)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  { 
                    'name': NAME,
                    'candidateIds': [ candidateId.toString() ]
                  })
                .afterJSON ( function (json) {
                  frisby.create(testStr + 'DELETE elections with candidates')
                      .delete(tc.url + electionIdUrl)
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

(function() {
var testStr = "Election add Voter. ";
var NAME = 'Election Main 1';
var electionIdUrl;
var voterId = mongoose.Types.ObjectId();
var electionId;
frisby.create(testStr + 'POST election')
    .post(tc.url + '/elections',
      { 
        'name': NAME
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/elections/')
    .after( function( error, response, body ) {

      electionIdUrl = body;
      electionId = body.substring('/elections/'.length);

      frisby.create(testStr + 'POST add voters to election')
          .post(tc.url + "/elections/" + electionId + "/voterid/",
            {
              'voterId' : voterId.toString()
            }, 
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(200)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/elections/')
          .after( function(error, response, body) {

            frisby.create(testStr + 'GET elections with voters')
                .get(tc.url + electionIdUrl)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  { 
                    'name': NAME,
                    'voterIds': [ voterId.toString() ]
                  })
                .afterJSON ( function (json) {
                  frisby.create(testStr + 'DELETE elections with voters')
                      .delete(tc.url + electionIdUrl)
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
