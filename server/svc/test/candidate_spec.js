var jasmine = require('jasmine-node');
var frisby = require('frisby');
var tc = require('./config/test_config');
var dbConfig = require('./config/db');

var ID = 10118;
var NAME = 'Zane Yalta';
var NAME2 = 'Xander Wiggens';

// basic candidate CRUD
frisby.create('POST candidate')
    .post(tc.url + '/candidates',
      { 
        'id' : ID, 
        'name': NAME
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/' + ID)
    .after( function(error, response, body) {

      frisby.create('PUT edit candidate')
          .put(tc.url + '/candidates/' + ID,
            { 
              'id' : ID, 
              'name': NAME2
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(200)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/' + ID)
          .after( function (error, response, body) {

            frisby.create('GET candidates')
                .get(tc.url + '/candidates/' + ID)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  [{ 
                    'id' : ID, 
                    'name': NAME2
                  }])
                .after ( function (error, response, body) {

                  frisby.create('DELETE candidates')
                      .delete(tc.url + '/candidates/' + ID)
                      .inspectBody()
                      .expectStatus(200)
                      .toss();
                })
                .toss();
          })
          .toss();
    })
    .toss();



var IDv1 = 774455;
var NAMEv1 = 'Victor Urban'
var Candidatev1VoteId = 56
var Candidatev1VoteValue = 8
var Candidatev1VoteEntryDate = '1/1/2013'
var Candidatev1VoteEntryDateStr = '2013-01-01T05:00:00.000Z'

// vote CRUD
frisby.create('POST candidate')
    .post(tc.url + '/candidates',
      { 
        'id' : IDv1, 
        'name': NAMEv1
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/candidates/' + IDv1)
    .after( function (error, response, body) {

      frisby.create('POST candidate vote')
          .post(tc.url + '/candidates/' + IDv1 + '/votes',
            { 
              'id' : Candidatev1VoteId, 
              'value': Candidatev1VoteValue,
              'entrytime': Candidatev1VoteEntryDate
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }})
          .inspectBody()
          .expectStatus(201)
          .expectHeader('Content-Type', 'text/html; charset=utf-8')
          .expectBodyContains('/candidates/' + IDv1)
          .after (function(error, response, body) {

            frisby.create('GET candidates with votes')
                .get(tc.url + '/candidates/' + IDv1)
                .inspectBody()
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json; charset=utf-8')
                .expectJSON(
                  [{ 
                    'id' : IDv1, 
                    'name' : NAMEv1,
                  //   'votes' : []
                  // }])
                    'votes' : [ 
                      {
                        'id' : Candidatev1VoteId,
                        'value' : Candidatev1VoteValue,
                        'entrytime' : Candidatev1VoteEntryDateStr
                      }
                    ]
                  }])
                .toss();

        })
        .toss();
    })
    .toss();


// frisby.create('DELETE candidates')
//     .delete(tc.url + '/candidates/' + IDv1)
//     .inspectBody()
//     .expectStatus(200)
//     .toss();
