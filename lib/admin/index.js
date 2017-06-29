const login = require('./login.js');
const admin = require('./admin.js');
const inappropriate = require('./inappropriate.js');

module.exports = Object.assign({}, login, admin, inappropriate);
