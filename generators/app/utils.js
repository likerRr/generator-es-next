module.exports = {
  camelize,
  humanize
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
