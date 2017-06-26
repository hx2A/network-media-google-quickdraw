const debug = require('debug')('user');

const util = require('_/util');
const reference = require('_/reference');

function initFilter(req, res) {
  res.render('form', {
    countryCode: 'all',
    category: 'all',
    recognized: 'all',
    state: 'init',
    util: util,
    ref: reference
  });
}

function filter(req, res) {
  debug('Return sketches', req.params.cc, req.params.cat);

  var query = {};
  var cc = util.sanitize(req.params.cc).toLowerCase();
  var cat = util.sanitize(req.params.cat).toLowerCase();
  var rec = util.sanitize(req.params.rec).toLowerCase();

  if (cc != 'all') {
    query.c = cc;
  }
  if (cat != 'all') {
    query.w = cat;
  }
  if (rec == 'recognized') {
    query.r = true;
  }
  if (rec == 'unrecognized') {
    query.r = false;
  }

  res.render('form', {
    countryCode: cc,
    category: cat,
    recognized: rec,
    state: 'query',
    util: util,
    ref: reference
  });
}

exports.initFilter = initFilter;
exports.filter = filter;