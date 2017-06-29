var env = process.env.NODE_ENV || 'development';

var urls = require('./urls');

var cfg = require('./env/' + env);
cfg.env = env;

module.exports = Object.assign({}, cfg, urls);
