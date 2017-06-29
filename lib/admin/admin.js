const debug = require('debug')('itp.admin');

const config = require('_/config');
const util = require('_/util');
const reference = require('_/reference');
const db = require('_/db');

function adminConsole(req, res) {
  if (!req.session.username) {
    debug('Redirect to login page');

    res.redirect(config.urlAdminLogin);
  } else {
    debug('Return admin console');

    res.render('adminConsole', {
      util: util,
      ref: reference
    });
  }
}

function drawings(req, res) {
  if (!req.session.username) {
    debug('Requested flagged drawings but user not logged in');

    res.send([]);
  } else {
    var show = util.sanitize(req.body.show).toLowerCase();

    debug('show', show);

    var query = {};
    query.f = {
      $eq: true
    };
    if (show == 'inappropriate') {
      query.i = {
        $eq: true
      };
    } else {
      query.i = {
        $ne: true
      };
    }

    db.drawingCollection.find(query).limit(200, function(err, data) {
      // lookup the formal country name from each iso code
      data.forEach(function(d) {
        d.cn = reference.isoCodes[d.c];
      })
      res.send({
        data: data,
        links: {},
        user: false
      });
    });
  }
}

exports.adminConsole = adminConsole;
exports.drawings = drawings;
