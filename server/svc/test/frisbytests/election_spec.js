var jasmine = require('jasmine-node');
var frisby = require('frisby');
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
                  [{ 
                    'name': NAME2
                  }])
                .afterJSON ( function (json) {
                  frisby.create('DELETE elections')
                      .delete(tc.url + '/elections/' + json[0]._id)
                      .inspectBody()
                      .expectStatus(200)
                      .toss();
                })
                .toss();
         })
          .toss();
    })
    .toss();




