const debug = require('debug')('itp.admin');
const fs = require('fs');
// const bcrypt = require('bcrypt');

const util = require('_/util');
const credentials = JSON.parse(fs.readFileSync('./secrets/credentials.json.nogit'));

function loginForm(req, res) {
  res.render('login', {
    'url': '/drawings/admin/console',
    'message': 'Enter your username and password'
  });
}

function loginValidate(req, res) {
  if (!req.body.username || !req.body.password || !req.body.url) {
    res.render('login', {
      'url': '/drawings/admin/console',
      'message': 'Enter your username and password'
    });
  } else {
    var username = util.sanitize(req.body.username);
    var password = util.sanitize(req.body.password);
    var url = util.sanitize(req.body.url);

    // compute hash no matter what to protect against timing attack
    var hash = ""
    if (credentials.hasOwnProperty(username)) {
      hash = credentials[username];
    }

    if (password == hash) {
      req.session.username = username;

      res.redirect(url);
    } else {
      res.render('login', {
        'url': '/drawings/admin/console',
        'message': 'Credentials rejected. Try again.'
      });
    }
  }
}

function logout(req, res) {
  delete req.session.username;
  res.redirect('/drawings/admin/login');
}

exports.loginForm = loginForm;
exports.loginValidate = loginValidate;
exports.logout = logout;
