var async = require('asyncawait/async');
var await = require('asyncawait/await');

const db = require('_/db');

var isoCodes = require('./json/iso_codes.json');
exports.isoCodes = isoCodes;

exports.recognized = {
  true: 'Recognized',
  false: 'Not Recognized'
};
exports.recognizedURL = {
  true: 'recognized',
  false: 'unrecognized'
};

function getDistinctValues(key) {
  return new Promise((resolve, reject) => {
    db.drawingCollection.distinct(key, {}, function(err, data) {
      if (err) {
        throw Error('mongodb problem - unable to load distinct values');
      } else {
        resolve(data);
      }
    });
  });
};

// this makes sure the lookup values are loaded (once) and available when the
// reference module is used by other parts of the code.
async(function() {
  exports.countries = await (getDistinctValues('c')).sort(
    function(a, b) {
      if (isoCodes[a] < isoCodes[b]) {
        return -1;
      } else if (isoCodes[a] > isoCodes[b]) {
        return 1;
      } else {
        return 0;
      }
    }
  );
  exports.categories = await (getDistinctValues('w'));
})();