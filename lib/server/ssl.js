var fs = require('fs');

var credentials = {
  key: fs.readFileSync('./secrets/privkey.pem.nogit'),
  cert: fs.readFileSync('./secrets/fullchain.pem.nogit')
};

exports.credentials = credentials
