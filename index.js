const debug = require('debug')('itp');
var https = require('https');

const config = require('_/config')
const server = require('_/server');

const PORT = config.portNumber;
server.app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});

if (config.useSSL) {
  var httpsServer = https.createServer(server.ssl.credentials, server.app);
  httpsServer.listen(443);
}
