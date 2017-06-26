var express = require('express');

const user = require('_/user');

var router = express.Router();

router.get('/sketches', user.initFilter);
router.get('/sketches/filter/:cc/:cat/:rec', user.filter);
router.post('/sketches/drawings', user.drawings);
router.post('/sketches/flag', user.flag);

module.exports = router;
