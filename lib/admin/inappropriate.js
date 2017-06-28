const debug = require('debug')('itp.admin');

const util = require('_/util');
const db = require('_/db');

function inappropriate(req, res) {
  var _id = util.sanitize(req.body._id);

  debug('marking drawing as inappropriate', _id);
  
  var query = {_id: db.toObjectId(_id)};
  db.drawingCollection.update(
    query,
    { $set: {i: true }},
    function(err, data) {
      if (data.ok == 1 && data.n == 1) {
        res.send(true);
      } else {
        debug('error marking drawing as inappropriate', err, data);
        res.send(false);
      }
    }
  );
}

function acceptable(req, res) {
  var _id = util.sanitize(req.body._id);

  debug('marking drawing as acceptable', _id);
  
  var query = {_id: db.toObjectId(_id)};
  db.drawingCollection.update(
    query,
    { $set: {i: false, f: false }},
    function(err, data) {
      if (data.ok == 1 && data.n == 1) {
        res.send(true);
      } else {
        debug('error marking drawing as acceptable', err, data);
        res.send(false);
      }
    }
  );
}

exports.inappropriate = inappropriate;
exports.acceptable = acceptable;