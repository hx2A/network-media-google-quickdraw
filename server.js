var express = require('express');
var bodyParser = require('body-parser');
var bleach = require('bleach');
const debug = require('debug')('itp');
var mongojs = require('mongojs');
var options = require('./options');
var reference = require('./reference');

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
};
if (!String.toTitleCase) {
  String.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
};

// setup express
var app = express();
var urlencodedParser = bodyParser.urlencoded({
  extended: true
});
app.use(urlencodedParser);
app.set('view engine', 'ejs');
app.set('views', 'templates/');
app.use(express.static('static'));

// database connection
var connectionString = String.format('{0}:{1}@ds163681.mlab.com:63681/network-media',
  options.credentials.username, options.credentials.password);
// var connectionString = "localhost:27017/network-media"
var db = mongojs(connectionString, ["google_sketches"]);

// input cleaning
var bleach_options = {
  mode: 'white',
  list: []
};

app.get('/sketches/:cc/:cat/:rec', function(req, res) {
  debug('Return sketches', req.params.cc, req.params.cat);

  var query = {};
  var cc = bleach.sanitize(req.params.cc.toUpperCase(), bleach_options);
  var cat = bleach.sanitize(req.params.cat.toLowerCase(), bleach_options);
  var rec = bleach.sanitize(req.params.rec.toLowerCase(), bleach_options);

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

  db.google_sketches.find(query, function(err, data) {
    res.render('svg_table', {
      data: data,
      svg_path: svg_path,
      ref: reference
    });
  });
});

function svg_path(d) {
  var out = '';
  for (i = 0; i < d.length; ++i) {
    out += String.format('M {0},{1} l ', d[i][0][0], d[i][1][0])
    for (j = 1; j < d[i][0].length; ++j) {
      out += String.format('{0},{1} ', d[i][0][j], d[i][1][j])
    }
  }
  return out;
}



var port = 8080;
app.listen(port)
debug("Server is running on port %d", port);