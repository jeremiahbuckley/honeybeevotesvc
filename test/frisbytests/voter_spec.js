var jasmine = require('jasmine-node');
var frisby = require('frisby');
var tc = require('../config/test_config');
var dbConfig = require('../config/db');

var NAME = 'Aaron Beagel';
var PWD = 'foo';

frisby.create('POST voter')
    .post(tc.url + '/voters',
      { 
        'name': NAME,
        'password': PWD
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/voters/')
    .after ( function (error, response, body) {

      frisby.create('GET voters')
          .get(tc.url + body)
          .inspectBody()
          .expectStatus(200)
          .expectHeader('Content-Type', 'application/json; charset=utf-8')
          .expectJSON(
            [{ 
              'name': NAME,
              'password': PWD
            }])
          .afterJSON( function(json) {

            frisby.create('DELETE voters')
                .delete(tc.url + '/voters/' + json[0]._id)
                .inspectBody()
                .expectStatus(200)
                .toss();
          })
          .toss();
    })
    .toss();


