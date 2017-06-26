function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

function format(format) {
  var args = Array.prototype.slice.call(arguments, 1);
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

function svg_path(d) {
  var out = '';
  for (i = 0; i < d.length; ++i) {
    out += `M ${d[i][0][0]},${d[i][1][0]} l `;
    for (j = 1; j < d[i][0].length; ++j) {
      out += `${d[i][0][j]},${d[i][1][j]} `;
    }
  }
  return out;
}

exports.svg_path = svg_path;
exports.toTitleCase = toTitleCase;
exports.format = format;
