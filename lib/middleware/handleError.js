const debug = require('debug')('itp.middleware');

module.exports = function (err, req, res, next) {
  debug(err);
  res.locals.error = err;
  res.status(500).render('code500');
}
