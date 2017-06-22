var express = require('express');
var bodyParser = require('body-parser');
var bleach = require('bleach');
const debug = require('debug')('itp');
var mongojs = require('mongojs');
var options = require('./options');
var reference = require('./reference');

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
// var connectionString = String.format('{0}:{1}@ds163681.mlab.com:63681/network-media',
//   options.credentials.username, options.credentials.password);
var connectionString = "localhost:27017/network-media"
var db = mongojs(connectionString, ["google_sketches"]);

// input cleaning
var bleach_options = {
  mode: 'white',
  list: []
};

app.get('/filter', function(req, res) {
  res.render('form', {
    countryCode: 'us',
    category: 'butterfly',
    recognized: 'all',
    url: '',
    ref: reference
  });

});

app.get('/filter/:cc/:cat/:rec', function(req, res) {
  debug('Return sketches', req.params.cc, req.params.cat);

  var query = {};
  var cc = bleach.sanitize(req.params.cc, bleach_options).toLowerCase();
  var cat = bleach.sanitize(req.params.cat, bleach_options).toLowerCase();
  var rec = bleach.sanitize(req.params.rec, bleach_options).toLowerCase();

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
  
  var url = `/drawings/${cc}/${cat}/${rec}`

  res.render('form', {
    countryCode: cc,
    category: cat,
    recognized: rec,
    url: url,
    ref: reference
  });
});

app.get('/drawings/:cc/:cat/:rec', function(req, res) {
  debug('Return drawings', req.params.cc, req.params.cat);

  var query = {};
  var cc = bleach.sanitize(req.params.cc, bleach_options).toLowerCase();
  var cat = bleach.sanitize(req.params.cat, bleach_options).toLowerCase();
  var rec = bleach.sanitize(req.params.rec, bleach_options).toLowerCase();

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
    if (data.length == 0) {
      res.send('<p class="ui-state-error ui-corner-all error">No drawings found meeting this criteria</p>');
    } else {
      res.render('drawings', {
        data: data,
        svg_path: svg_path,
        ref: reference
      });
    }
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

const PORT = 8080;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
module.exports = app;
