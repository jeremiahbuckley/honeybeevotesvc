var jasmine = require('jasmine-node');
var frisby = require('frisby');
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
var VoterId = 432;
var Candidatev1VoteId = 56
var Candidatev1VoteValue = 8
var Candidatev1VoteEntryDate = new Date();

// vote CRUD
frisby.create('POST candidate')
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
              'voter_id': VoterId,
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

            frisby.create('GET candidates with votes')
                .get(tc.url + body)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  [ 
                      {
                        'voter_id' : VoterId,
                        'value' : Candidatev1VoteValue,
                        'starttime' : Candidatev1VoteEntryDate.toISOString(),
                        'expired' : false
                      }
                  ])
                .afterJSON (function (json) {
                    frisby.create('DELETE candidates')
                      .delete(tc.url + '/candidates/' + json[0]._id)
                      .inspectBody()
                      /*.expectStatus(200) This could be a 404 */
                      .toss();
                    })
                .toss();
          })
          .toss();
    })
    .toss();


