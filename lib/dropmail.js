
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , helper = require('./helper')
  , http = require('./http');


/**
 * Client for Dropmail with Model constructors bound to itself.
 *
 * @param {Object} options
 * @return {Dropmail}
 * @api public
 */

var Dropmail = module.exports = function Dropmail(options) {
  // core models, bound to this client
  this.Authorization = require('./model/authorization').withClient(this);
  this.Domain        = require('./model/domain').withClient(this);
  this.Message       = require('./model/message').withClient(this);
  this.Organization  = require('./model/organization').withClient(this);
  this.Template      = require('./model/template').withClient(this);
  this.User          = require('./model/user').withClient(this);

  // options
  options = options || {}
  this.baseURL = options.baseURL || Dropmail.baseURL || 'https://dropmail.io';
  this.authenticate(options.credentials || Dropmail.credentials);
};

helper.inherit(Dropmail, EventEmitter);
helper.merge(Dropmail.prototype, http);


/**
 * Set the client credentials using the given credential object.
 *
 * @param {String|Object|Authorization|User} auth
 * @return {Dropmail}
 * @api public
 */

Dropmail.prototype.authenticate = function(auth) {
  var credentials = this.credentials = null;

  if (typeof auth == 'string') {
    credentials = { key: auth };
  } else if (auth instanceof this.Authorization) {
    credentials = { key: auth.get('key') };
  } else if (typeof auth === 'object' && 'password' in auth) {
    credentials = {
      username: auth.username,
      password: auth.password
    };
  } else if (auth instanceof this.User) {
    credentials = {
      username: auth.get('email'),
      password: auth.get('password')
    };
  }

  this.credentials = credentials;

  return this;
};


/**
 * Make a request with the given method to given path using options.
 *
 * @param {String} method
 * @param {Object} path
 * @param {Object} options
 * @param {Function} callback
 * @return {Model}
 * @api public
 */

Dropmail.prototype.request = function(method, path, options, callback) {
  var uri = [this.baseURL, path].join('/');
  options = options || {};
  options.auth = this.credentials;
  return http.request(method, uri, options, callback);
}
