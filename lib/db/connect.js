const debug = require('debug')('itp.db');
const mongojs = require('mongojs');

const config = require('_/config')

// database connection
var connectionString = config.connectionString;
var db = mongojs(connectionString, [config.collection]);

debug('connecting...');

exports.drawingCollection = db[config.collection];
