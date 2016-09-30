var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	res.send('respond with a get candidate resource');
});

router.post('/', function(req, res, next) {
	res.send('respond with a post candidate resource id');
});

router.put('/', function(req, res, next) {
	res.send('respond with a put candidate resource id');
});

router.delete('/', function(req, res, next) {
	res.send('respond with a delete candidate resource id');
});

router.get('/:id/votes', function(req, res, next) {
	res.send(`respond with get votes for candidate id ${req.params.id}`);
});

router.post('/:id/votes', function(req, res, next) {
	res.send(`respond with post vote id for candidate id ${req.params.id}`);
});

router.put('/:id/votes', function(req, res, next) {
	res.send(`respond with put vote id for candidate id ${req.params.id}`);
});

router.delete('/:id/votes', function(req, res, next) {
	res.send(`respond with delete vote id for candidate id ${req.params.id}`);
});

module.exports = router;
