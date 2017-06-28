const bleach = require('bleach');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

var bleach_options = {
  mode: 'white',
  list: []
};

function sanitize(str) {
  return bleach.sanitize(str, bleach_options)
}

exports.toTitleCase = toTitleCase;
exports.sanitize = sanitize;
