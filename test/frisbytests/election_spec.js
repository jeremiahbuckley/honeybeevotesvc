var jasmine = require('jasmine-node');
var frisby = require('frisby');
var mongoose = require('mongoose');
var tc = require('../config/test_config');
var dbConfig = require('../config/db');

var NAME = 'Election Main 1';
var NAME2 = 'Election North ';

frisby.create('POST election')
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

      frisby.create('PUT edit election')
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

            frisby.create('GET elections')
                .get(tc.url + body)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  { 
                    'name': NAME2
                  })
                .afterJSON ( function (json) {
                  frisby.create('DELETE elections')
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

var electionIdUrl2;
var electionId2;
var candidateId = mongoose.Types.ObjectId();
frisby.create('POST election')
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

      electionIdUrl2 = body;
      electionId2 = body.substring('/elections/'.length);

      frisby.create('POST add candidates to election')
          .post(tc.url + "/elections/candidateid/",
            {
              'id': electionId2,
              'candidateid' : candidateId.toString()
            }, 
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(200)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/elections/')
          .after( function(error, response, body) {

            frisby.create('GET elections with candidates')
                .get(tc.url + electionIdUrl2)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  { 
                    'name': NAME,
                    'candidateIds': [ candidateId.toString() ]
                  })
                .afterJSON ( function (json) {
                  frisby.create('DELETE elections with candidates')
                      .delete(tc.url + electionIdUrl2)
                      .inspectBody()
                      .expectStatus(200)
                      .toss();
                })
                .toss();
         })
          .toss();
    })
    .toss();

var electionIdUrl;
var voterId = mongoose.Types.ObjectId();
var electionId3;
frisby.create('POST election')
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
      electionId3 = body.substring('/elections/'.length);

      frisby.create('POST add voters to election')
          .post(tc.url + "/elections/voterid/",
            {
              'id': electionId3,
              'voterid' : voterId.toString()
            }, 
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(200)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/elections/')
          .after( function(error, response, body) {

            frisby.create('GET elections with voters')
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
                  frisby.create('DELETE elections with voters')
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



