const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('itp');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nedbstore = require('nedb-session-store')(session);

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
app.post('/drawings', user.drawings);
app.post('/flag', user.flag);

// finally, launch the server
const PORT = 8080;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
module.exports = app;