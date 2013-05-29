/**
 * Module dependancies.
 */

var request = require('request');

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

http.request = function(method, uri, body, callback) {
  request({
      method: method
    , uri: uri
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
  http[method] = function(uri, body, callback) {
    http.request(method, uri, body, callback);
  };
});
