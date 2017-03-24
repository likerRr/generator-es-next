module.exports = {
  camelize,
  humanize
  // combineFilters
};

/**
 * Glue string into camelizeString
 * @param str
 * @return {string}
 */
function camelize(str) {
  return str
    .trim()
    // find every letter followed after the -, _ or space character and uppercases it
    .replace(/[-_\s]+(.)?/g, (match, c) => c ? c.toUpperCase() : '');
}

/**
 * Make every word in string starts from uppercase letter
 * @param str
 * @return {string}
 */
function humanize(str) {
  return str
    .trim()
    // split by spaces, hyphens or underscores
    .split(/[-_\s]+/)
    .map(txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    .join(' ');
}

/*
function combineFilters(filters) {
  if (!Array.isArray(filters)) {
    filters = [filters];
  }

  return val => (filters.length > 0) ? filters.reduce((prev, cur) => cur(prev), filters[0](val)) : val
}
*/
