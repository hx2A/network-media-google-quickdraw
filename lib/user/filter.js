const debug = require('debug')('itp.user');

const util = require('_/util');
const reference = require('_/reference');

function initFilter(req, res) {
  res.render('form', {
    countryCode: 'all',
    category: 'all',
    recognized: 'all',
    state: 'init',
    title: 'Drawings by Country',
    util: util,
    ref: reference
  });
}

function filter(req, res) {
  debug('Return sketches', req.params.cc, req.params.cat);

  var cc = util.sanitize(req.params.cc).toLowerCase();
  var cat = util.sanitize(req.params.cat).toLowerCase();
  var rec = util.sanitize(req.params.rec).toLowerCase();

  if (cc == 'random') {
    cc = util.randomChoice(reference.countries);
  }
  if (cat == 'random') {
    cat = util.randomChoice(reference.categories);
  }

  var title = "";
  if (cc == 'all' && cat == 'all') {
    title = `${util.toTitleCase(rec)} drawings in any category from any country`;
  } else if (cc == 'all') {
    title = `${util.toTitleCase(rec)} ${util.toTitleCase(cat)} drawings from any country`;
  } else if (cat == 'all') {
    title = `${util.toTitleCase(rec)} drawings in any category from ${reference.isoCodes[cc]}`;
  } else {
    title = `${util.toTitleCase(rec)} ${util.toTitleCase(cat)} drawings from ${reference.isoCodes[cc]}`;
  }

  res.render('form', {
    countryCode: cc,
    category: cat,
    recognized: rec,
    state: 'query',
    title: title,
    util: util,
    ref: reference
  });
}

exports.initFilter = initFilter;
exports.filter = filter;
