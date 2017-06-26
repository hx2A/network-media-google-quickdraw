var resolve = require('path').resolve
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('itp');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nedbstore = require('nedb-session-store')(session);

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, '../templates'));
app.use(express.static('static'));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    cookie: {
      maxAge: 5 * 60 * 1000
    },
    store: new nedbstore({
      filename: '/tmp/sessions.db'
    }),
    resave: true,
    saveUninitialized: true
  })
);

app.use(require('./routes.js'));

module.exports = app;
