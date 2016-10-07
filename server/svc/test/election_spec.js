var jasmine = require('jasmine-node');
var frisby = require('frisby');
var tc = require('./config/test_config');
var dbConfig = require('./config/db');

var ID = 223355;
var NAME = 'Election Main 1';
var NAME2 = 'Election North ';

frisby.create('POST election')
    .post(tc.url + '/elections',
      { 
        'id' : ID, 
        'name': NAME
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(201)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/elections/' + ID)
    .toss();

frisby.create('PUT edit election')
    .put(tc.url + '/elections/' + ID,
      { 
        'id' : ID, 
        'name': NAME2
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
    .inspectBody()
    .expectStatus(200)
    .expectHeader('Content-Type', 'text/html; charset=utf-8')
    .expectBodyContains('/elections/' + ID)
    .toss();

frisby.create('GET elections')
    .get(tc.url + '/elections/' + ID)
    .inspectBody()
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/json; charset=utf-8')
    .expectJSON(
      [{ 
        'id' : ID, 
        'name': NAME2
      }])
    .toss();

frisby.create('DELETE elections')
    .delete(tc.url + '/elections/' + ID)
    .inspectBody()
    .expectStatus(200)
    .toss();

