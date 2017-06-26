const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('itp');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nedbstore = require('nedb-session-store')(session);
const uuidV1 = require('uuid/v1');

const util = require('_/util');
const reference = require('_/reference');
const db = require('_/db');
const user = require('_/user');

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

// *** routes ***
app.get('/filter', user.initFilter);
app.get('/filter/:cc/:cat/:rec', user.filter);

app.post('/drawings', function(req, res) {
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
});

app.post('/flag', user.flag);

// finally, launch the server
const PORT = 8080;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
module.exports = app;