var express = require('express');

const user = require('_/user');

var router = express.Router();

router.get('/filter', user.initFilter);
router.get('/filter/:cc/:cat/:rec', user.filter);
router.post('/drawings', user.drawings);
router.post('/flag', user.flag);

module.exports = router;
