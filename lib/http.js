/**
 * Module dependancies.
 */

var request = require('request')
  , querystring = require('querystring');

/**
 * An HTTP request singleton.
 */

var http = module.exports = {};

/**
 * Make a generic HTTP request with the method to the given uri.
 *
 * @param {String} method
 * @param {String} uri
 * @param {String} body
 * @return undefined
 * @api public
 */

http.request = function(method, uri, options, callback) {
  if (typeof options === 'function') callback = options, options = {};

  request({
      method: method
    , uri: uri + '?' + querystring.stringify(options.params || {})
    , body: options.body
    , json: true
    , auth: options.auth
    }
  , function(err, response, body){
      callback(err, body);
  });
};

/**
 * Helper methods for GET, DELETE, POST and PATCH requests.
 *
 * @param {String} uri
 * @param {String} body
 * @return undefined
 * @api public
 */

['get', 'delete', 'post', 'patch'].forEach(function(method) {
  http[method] = function(uri, options, callback) {
    this.request(method, uri, options, callback);
  };
});
