const debug = require('debug')('itp.user');

const util = require('_/util');
const db = require('_/db');

function flag(req, res) {
  var _id = util.sanitize(req.body._id);

  debug('flag drawing', _id);
  
  var query = {_id: db.toObjectId(_id)};
  db.drawingCollection.update(
    query,
    { $set: {f: true }},
    function(err, data) {
      if (data.ok == 1 && data.n == 1) {
        res.send(true);
      } else {
        debug('error flagging drawing', err, data);
        res.send(false);
      }
    }
  );
}

exports.flag = flag;
