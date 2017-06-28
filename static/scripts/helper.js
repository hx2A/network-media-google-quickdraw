var util = {};

util.toTitleCase = function(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

util.format = function(format) {
  var args = Array.prototype.slice.call(arguments, 1);
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

util.svg_path = function(d) {
  var out = '';
  for (i = 0; i < d.length; ++i) {
    out += `M ${d[i][0][0]},${d[i][1][0]} l `;
    for (j = 1; j < d[i][0].length; ++j) {
      out += `${d[i][0][j]},${d[i][1][j]} `;
    }
  }
  return out;
}

ref = {};

ref.recognized = {
  true: 'Recognized',
  false: 'Not Recognized'
};

ref.recognizedURL = {
  true: 'recognized',
  false: 'unrecognized'
};