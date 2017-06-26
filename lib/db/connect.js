const mongojs = require('mongojs');

// database connection
var connectionString = "localhost:27017/network-media";
var db = mongojs(connectionString, ["google_sketches"]);

exports.google_sketches = db.google_sketches;
