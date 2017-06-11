var fs = require('fs')
var credentialsPath = './credentials.json.nogit';
var parsed = JSON.parse(fs.readFileSync(credentialsPath, 'UTF-8'));
exports.credentials = parsed;
