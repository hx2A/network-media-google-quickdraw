var express = require('express');

const user = require('_/user');
const admin = require('_/admin');

var router = express.Router();

router.get('/drawings', user.initFilter);
router.get('/drawings/filter/:cc/:cat/:rec', user.filter);
router.post('/drawings/fetch', user.drawings);
router.post('/drawings/flag', user.flag);

router.get('/drawings/admin/console', admin.adminConsole);
router.post('/drawings/admin/fetch', admin.drawings);
router.post('/drawings/admin/inappropriate', admin.inappropriate);
router.post('/drawings/admin/acceptable', admin.acceptable);

router.get('/drawings/admin/login', admin.loginForm);
router.post('/drawings/admin/login', admin.loginValidate);
router.get('/drawings/admin/logout', admin.logout);

module.exports = router;
