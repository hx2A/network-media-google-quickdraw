const express = require('express');
const bodyParser = require('body-parser');
const bleach = require('bleach');
const debug = require('debug')('itp');
const mongojs = require('mongojs');
const reference = require('./reference');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nedbstore = require('nedb-session-store')(session);
const uuidV1 = require('uuid/v1');

// setup express
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.set('views', 'templates/');
app.use(express.static('static'));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    cookie: {
      maxAge: 5 * 60 * 1000
    },
    store: new nedbstore({
      filename: 'sessions.db'
    }),
    resave: true,
    saveUninitialized: true
  })
);

// database connection
var connectionString = "localhost:27017/network-media";
var db = mongojs(connectionString, ["google_sketches"]);

// input cleaning
var bleach_options = {
  mode: 'white',
  list: []
};

// *** routes ***
app.get('/filter', function(req, res) {
  res.render('form', {
    countryCode: 'all',
    category: 'all',
    recognized: 'all',
    state: 'init',
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

  res.render('form', {
    countryCode: cc,
    category: cat,
    recognized: rec,
    state: 'query',
    ref: reference
  });
});

app.post('/drawings', function(req, res) {
  var cc = bleach.sanitize(req.body.cc, bleach_options).toLowerCase();
  var cat = bleach.sanitize(req.body.cat, bleach_options).toLowerCase();
  var rec = bleach.sanitize(req.body.rec, bleach_options).toLowerCase();
  var last = undefined;
  if (req.body.last != undefined) {
    var last = bleach.sanitize(req.body.last, bleach_options);
  }

  // build name link urls
  links = {};
  if (cc == 'all') {
    links.cc = `/filter/{0}/${cat}/${rec}`
  }
  if (cat == 'all') {
    links.cat = `/filter/${cc}/{0}/${rec}`
  }
  if (rec == 'all') {
    links.rec = `/filter/${cc}/${cat}/{0}`
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
      $gt: mongojs.ObjectId(last)
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
        svg_path: svg_path,
        links: links,
        ref: reference
      });
    }
  });
});

app.post('/flag', function(req, res) {
  var _id = bleach.sanitize(req.body._id, bleach_options);

  debug('flag drawing', _id);
  
  var query = {_id: mongojs.ObjectId(_id)};
  db.google_sketches.update(
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
});

// util functions
if (!String.toTitleCase) {
  String.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
};

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

function svg_path(d) {
  var out = '';
  for (i = 0; i < d.length; ++i) {
    out += `M ${d[i][0][0]},${d[i][1][0]} l `;
    for (j = 1; j < d[i][0].length; ++j) {
      out += `${d[i][0][j]},${d[i][1][j]} `;
    }
  }
  return out;
}

// finally, launch the server
const PORT = 8080;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
module.exports = app;