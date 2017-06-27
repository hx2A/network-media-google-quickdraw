var express = require('express');

const user = require('_/user');

var router = express.Router();

router.get('/drawings', user.initFilter);
router.get('/drawings/filter/:cc/:cat/:rec', user.filter);
router.post('/drawings/fetch', user.drawings);
router.post('/drawings/flag', user.flag);

module.exports = router;
