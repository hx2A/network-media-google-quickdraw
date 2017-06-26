var resolve = require('path').resolve
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('itp');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nedbstore = require('nedb-session-store')(session);

const config = require('_/config')

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
      maxAge: config.session.maxAge
    },
    store: new nedbstore({
      filename: config.session.filename
    }),
    resave: true,
    saveUninitialized: false
  })
);

app.use(require('./routes.js'));

module.exports = app;
