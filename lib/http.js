/**
 * Module dependancies.
 */

var request = require('request')
  , querystring = require('querystring');

/**
 * An HTTP request singleton.
 *
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

http.request = function(method, uri, params, body, callback) {
  request({
      method: method
    , uri: uri + '?' + querystring.stringify(params || {})
    , body: body
    , json: true
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

['get', 'del', 'post', 'patch'].forEach(function(method) {
  http[method] = function(uri, params, body, callback) {
    http.request(method, uri, params, body, callback);
  };
});
