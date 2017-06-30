const debug = require('debug')('itp.db');
const mongojs = require('mongojs');

const config = require('_/config');

// database connection
var connectionString = config.mongo.connectionString;
var db = mongojs(connectionString, [config.mongo.collection]);

exports.drawingCollection = db[config.mongo.collection];
