var fs = require('fs')

var isoCodesPath = './reference/iso_codes.json';
exports.isoCodes = JSON.parse(fs.readFileSync(isoCodesPath, 'UTF-8'));

var countriesPath = './reference/countries.json';
exports.countries = JSON.parse(fs.readFileSync(countriesPath, 'UTF-8'));

var categoriesPath = './reference/categories.json';
exports.categories = JSON.parse(fs.readFileSync(categoriesPath, 'UTF-8'));

exports.recognized = {true: 'Recognized', false: 'Not Recognized'}