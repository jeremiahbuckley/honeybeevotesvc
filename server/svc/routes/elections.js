var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a get election resource');
});

router.post('/', function(req, res, next) {
  res.send('respond with a post election resource id');
});

router.put('/', function(req, res, next) {
  res.send('respond with a put election resource id');
});

router.delete('/', function(req, res, next) {
  res.send('respond with a delete election resource id');
});

module.exports = router;
