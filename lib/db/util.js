const mongojs = require('mongojs');

function toObjectId(str) {
  return mongojs.ObjectId(str);
}

exports.toObjectId = toObjectId;
