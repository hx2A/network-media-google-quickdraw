const express = require('express');

const server = require('./server');

var app = express();

app = server.setup(app);

module.exports = app;
