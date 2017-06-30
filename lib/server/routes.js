var express = require('express');

const user = require('_/user');
const admin = require('_/admin');
const config = require('_/config');

var router = express.Router();

router.get(config.urlBase, user.initFilter);
router.get(`${config.urlBase}/filter/:cc/:cat/:rec`, user.filter);
router.post(`${config.urlBase}/fetch`, user.drawings);
router.post(`${config.urlBase}/flag`, user.flag);

router.get(config.urlAdminConsole, admin.adminConsole);
router.post(`${config.urlAdminBase}/fetch`, admin.drawings);
router.post(`${config.urlAdminBase}/inappropriate`, admin.inappropriate);
router.post(`${config.urlAdminBase}/acceptable`, admin.acceptable);

router.get(config.urlAdminLogin, admin.loginForm);
router.post(config.urlAdminLogin, admin.loginValidate);
router.get(config.urlAdminLogout, admin.logout);

module.exports = router;
