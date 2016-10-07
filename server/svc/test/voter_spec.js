var jasmine = require('jasmine-node');
var frisby = require('frisby');
var tc = require('./config/test_config');
var dbConfig = require('./config/db');

var ID = 1007;
var NAME = 'Aaron Beagel';
var NAME2 = 'Chris Durden';

frisby.create('POST voter')
    .post(tc.url + '/voters',
      { 
        'id' : ID, 
        'name': NAME
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/voters/' + ID)
    .toss();

// frisby.create('PUT edit voter')
//     .put(tc.url + '/voters/' + ID,
//       { 
//         'id' : ID, 
//         'name': NAME2
//       },
//       { json: true },
//       { headers: { 'Content-Type': 'application/json' }})
//     .inspectBody()
//     .expectStatus(201)
//     .expectHeader('Content-Type', 'text/html; charset=utf-8')
//     .expectBodyContains('/voters/' + ID)
//     .toss();

frisby.create('GET voters')
    .get(tc.url + '/voters/' + ID)
    .inspectBody()
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/json; charset=utf-8')
    .expectJSON(
      [{ 
        'id' : ID, 
        'name': NAME
      }])
    .toss();

frisby.create('DELETE voters')
    .delete(tc.url + '/voters/' + ID)
    .inspectBody()
    .expectStatus(200)
    .toss();
