var express = require('express');
var router = express.Router();


router.get('/:id/votes', function(req, res, next) {
	res.send(`respond with votes for candidate id ${req.params.id}`);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a candidate resource');
});

module.exports = router;
