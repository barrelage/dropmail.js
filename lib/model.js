
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
  this.changed_attributes = {};
}

helper.merge(Model.prototype, EventEmitter.prototype);

Model.baseURL = null;
Model.rootKey = null;


/**
 * Fetch a model from the server using its primary key.
 *
 * @param {Function} callback
 * @callback {Model}
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
    var prev = this.attributes[attr];
    this.attributes[attr] = value;
    if(value !== prev) this.changed(attr);
  }
  return value;
}


/**
 * Marks the given attribute as changed.
 *
 * @return {String}
 * @api public
 */

Model.prototype.changed = function(attr) {
  var value = this.get(attr);
  this.changed_attributes[attr] = value;
  this.emit('change', attr, value);
}


/**
 * Set attributes to the given value and clear changes.
 *
 * @param {Object} attributes
 * @return {Model}
 * @api public
 */

Model.prototype.refresh = function(attributes) {
  this.set(attributes);
  this.changed_attributes = {};

  return this;
}


/**
 * Return the url of the model.
 *
 * @return {String}
 * @api public
 */

Model.prototype.url = function() {
  return [Model.baseURL, this.path()].join('/')
}


/**
 * Make a request to the model's path using the given method, params and body.
 *
 * @param {String} method
 * @param {Object} params
 * @param {Object} body
 * @param {Function} callback
 * @return {Model}
 * @api public
 */

Model.prototype.request = function(method, params, body, callback) {
  params = helper.merge(params || {}, { key: Model.key });
  http[method](this.url(), params, body, callback);
}


/**
 * Persists the model's attributes to the server.
 *
 * @param {Function} callback
 * @callback {Model}
 * @return {Model}
 * @api public
 */

Model.prototype.save = function(callback) {
  if(Object.keys(this.changed_attributes).length === 0) {
    callback(null, self);
    return this;
  }

  var method = this.get('id') ? 'patch' : 'post'
    , self = this
    , data = {};

  data[this.constructor.rootKey] = this.changed_attributes;

  this.request(method, null, data, function(err, data) {
    if(err) return callback(err);
    self.refresh(data[self.constructor.rootKey] || data)
    callback(null, self);
  });

  return this;
}


/**
 * Reloads the model's attributes from the server.
 *
 * @param {Function} callback
 * @callback {Model}
 * @return {Model}
 * @api public
 */

Model.prototype.reload = function(callback) {
  var self = this;
  this.request('get', null, null, function(err, data) {
    if(err) return callback(err);
    self.refresh(data[self.constructor.rootKey] || data)
    callback(null, self);
  });

  return this;
}
