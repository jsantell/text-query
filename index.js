/**
 * Expose Query
 */
module.exports = Query;

/**
 * Constructor for Query -- takes a search query and internally tokenizes
 * it for future queries.
 *
 * @param {String} query
 */
function Query (query) {
  this.token = tokenize(query);
}

/**
 * Takes a text field and compares it to the Query instance's
 * internalized token. By default, just compares that the text contains
 * the token, but can pass an optional comparator to use instead.
 *
 * @param {String} text
 * @param {Function} fn
 * @return {Boolean}
 */
Query.prototype.matches = function (text, fn) {
  fn = fn || comparator;
  var conjunction = this.token;

  // If query was empty, it matches everything
  if (conjunction.length === 0) {
    return true;
  }

  // Check that all conjunction groups pass
  // via `every`
  return conjunction.every(function (disjunction) {
    return disjunction.some(function (token) {
      return fn(token, text);
    });
  });
};

/**
 * Takes a token ("red", "my umbrella") and a string or an array
 * to see if it matches. Default matching is done by the
 * entirety of the token being found in the text.
 *
 * @param {String} token
 * @param {String|Array} text
 * @return {Boolean}
 */
function comparator (token, text) {
  if (Array.isArray(text)) {
    return text.some(function (field) {
      if (field != null) {
        return !!~(field + "").indexOf(token);
      } else {
        return false;
      }
    });
  }
  return !!~(text || "").indexOf(token);
}

/**
 * Takes a search query string like `swedish, metal, guitar bass drums "drum machine"`
 * and splits it up into a multidimensional token array, where the top level
 * is conjunction comparisons (AND) and the next level being disjunction comparisons (OR).
 *
 * @param {String} text
 * @return {Array<Array<String>>}
 */
function tokenize (text) {
  // If empty string, return an empty array
  if (text === "") {
    return [];
  }

  // Split out text string by commas, into AND groups
  var conjunction = text.split(",")
                      .map(function (s) { return s.trim(); });

  // Take each conjunction string and split it into OR groups
  return conjunction.filter(function (s) {
    return s !== "";
  }).map(function (s) {
    s = s.replace(/'/g,'"') // normalize all quotes to double quotes
    return disjunctionTokenizer(s);
  });
}

function disjunctionTokenizer (s) {
  var tokens = s.match(/"[^"]*"|[^\s]+/g) || [];

  // Strip quotes inside of the double quoted tokens
  return tokens.map(function (token) {
    return token.replace(/['"]*/g, "");
  });
}
