const https = require('https');

module.exports = {
  camelize,
  humanize,
  objValues,
  isRepoExists
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

/**
 * Returns array of object's values
 * @param obj
 * @return {Array}
 */
function objValues(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

/**
 * Checks if author/module repo exists on github
 * @param repo
 * @param cb
 */
function isRepoExists(repo, cb) {
  const options = {
    headers: {
      'User-Agent': 'Awesome-Octocat-App'
    },
    host: 'api.github.com',
    path: `/repos/${repo}`,
    protocol: 'https:'
  };

  https.get(options, res => cb(res.statusCode === 200));
}

/*
function combineFilters(filters) {
  if (!Array.isArray(filters)) {
    filters = [filters];
  }

  return val => (filters.length > 0) ? filters.reduce((prev, cur) => cur(prev), filters[0](val)) : val
}
*/
