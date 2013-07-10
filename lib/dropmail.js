
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
  // core models, bound to this as client
  this.Authorization = require('./model/authorization').bindClient(this);
  this.Domain        = require('./model/domain').bindClient(this);
  this.Message       = require('./model/message').bindClient(this);
  this.Organization  = require('./model/organization').bindClient(this);
  this.Template      = require('./model/template').bindClient(this);
  this.User          = require('./model/user').bindClient(this);

  // options
  this.options = options = options || {};
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

  if (!auth) return this;

  if (typeof auth == 'string') {
    credentials = { key: auth };
  } else if (auth instanceof this.Authorization) {
    credentials = { key: auth.get('key') };
  } else if (auth instanceof this.User) {
    credentials = {
      username: auth.get('email'),
      password: auth.get('password')
    };
  } else if (typeof auth == 'object') {
    if ('key' in auth) {
      credentials = { key: auth.key };
    } else if ('password' in auth) {
      credentials = {
        username: auth.email,
        password: auth.password
      };
    }
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
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  if (this.credentials && 'key' in this.credentials) {
    options.params = helper.merge(options.params || {}, this.credentials);
  } else {
    options.auth = this.credentials;
  }

  var uri = [this.baseURL, path].join('/');
  return http.request(method, uri, options, callback);
};
