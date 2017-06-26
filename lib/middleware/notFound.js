const debug = require('debug')('itp.middleware');

module.exports = function (req, res, next) {
  debug('page not found', req.url)
  res.status(404).render('code404')
}
