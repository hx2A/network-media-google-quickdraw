const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('itp');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nedbstore = require('nedb-session-store')(session);

function setup(app) {
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
  
  app.use(require('./routes.js'));
  
  return app;
}

exports.setup = setup;
