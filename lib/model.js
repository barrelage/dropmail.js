/**
 * Module dependancies.
 */

var EventEmitter = require('events').EventEmitter
  , helper = require('./helper')
  , http = require('./http');

/**
 * An abstract Model that accepts an object of attributes.
 *
 * @param {Object} attrs
 * @return {Model}
 * @api public
 */

var Model = module.exports = function Model(attrs) {
  EventEmitter.call(this);
  this.attributes = attrs || {};
}

helper.merge(Model.prototype, EventEmitter.prototype);

Model.baseURL = null;
Model.rootKey = null;

/**
 * Fetch a model from the server using its primary key.
 *
 * @param {Function} callback
 * @callback Model
 * @api public
 */

Model.fetch = function(id, callback) {
  instance = new this({ id: id });
  instance.reload(callback);
}

/**
 * Retrieve the attribute with the given name.
 *
 * @param {String} attr
 * @return {Object}
 * @api public
 */

Model.prototype.get = function(attr) {
  return this.attributes[attr];
}

/**
 * Set the attribute with the given name to a new value. If the first argument
 * is an object, all of the objects members are set as attributes.
 *
 * @param {String|Object} attr
 * @param {Object} value
 * @return {Object}
 * @api public
 */

Model.prototype.set = function(attr, value) {
  if (typeof attr === 'object') {
    for (var name in attr) { this.set(name, attr[name]) }
  } else {
    this.attributes[attr] = value;
    this.emit('change', attr, value);
  }
  return value;
}

/**
 * Return the url of the model.
 *
 * @return {String}
 * @api public
 */

Model.prototype.url = function() {
  return [Model.baseURL, this.path()].join('/') + '?key=' + Model.key
}

/**
 * Persists the model's attributes to the server.
 *
 * @param {Function} callback
 * @callback self
 * @api public
 */

Model.prototype.save = function(callback) {
  var method = this.get('id') ? 'patch' : 'post'
    , self = this
    , data = {};

  data[self.constructor.rootKey] = this.attributes;

  http[method](this.url(), data, callback);
}

/**
 * Reloads the model's attributes from the server.
 *
 * @param {Function} callback
 * @callback self
 * @api public
 */

Model.prototype.reload = function(callback) {
  var self = this;
  http.get(this.url(), null, function(err, response) {
    if(err) return callback(err);
    self.set(response[self.constructor.rootKey] || response)
    callback(null, self);
  });
}
