const debug = require('debug')('itp.user');

const util = require('_/util');
const reference = require('_/reference');
const db = require('_/db');

function drawings(req, res) {
  var cc = util.sanitize(req.body.cc).toLowerCase();
  var cat = util.sanitize(req.body.cat).toLowerCase();
  var rec = util.sanitize(req.body.rec).toLowerCase();
  var last = undefined;
  if (req.body.last != undefined) {
    var last = util.sanitize(req.body.last);
  }

  // build name link urls
  links = {};
  if (cc == 'all') {
    links.cc = `/drawings/filter/{0}/${cat}/${rec}`
  }
  if (cat == 'all') {
    links.cat = `/drawings/filter/${cc}/{0}/${rec}`
  }
  if (rec == 'all') {
    links.rec = `/drawings/filter/${cc}/${cat}/{0}`
  }

  debug('Return drawings', cc, cat, rec);

  var query = {};
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

  if (last) {
    query._id = {
      $gt: db.toObjectId(last)
    };
  }

  // filter out flagged or inappropriate content
  query.i = {
    $ne: true
  };
  query.f = {
    $ne: true
  };

  db.google_sketches.find(query).sort('_id').limit(50, function(err, data) {
    if (data.length == 0) {
      res.send('');
    } else {
      res.render('drawings', {
        data: data,
        links: links,
        util: util,
        ref: reference
      });
    }
  });
}

exports.drawings = drawings;
