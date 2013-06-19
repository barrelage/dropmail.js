
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

var Model = function Model(attrs) {
  EventEmitter.call(this);

  this.attributes = {};
  this.changed = {};
  this.set(attrs || {});

  if(this.initialize) {
    this.initialize.apply(this, [].slice.call(arguments));
  }
}

helper.inherit(Model, EventEmitter);

module.exports = Model;

Model.baseURL = null;
Model.rootKey = null;


/**
 * Contructor functions.
 */


/**
 * Add authentication parameters to an options object.
 *
 * @param {Object} options
 * @return {Object}
 * @api public
 */

Model.authenticate = function(options) {
  options = options || {};
  if (Model.username) {
    options.auth = { username: Model.username, password: Model.password };
  } else if (Model.key) {
    options.params = helper.merge(options.params || {}, { key: Model.key });
  }
  return options;
}


/**
 * Build a model using the given attributes.
 *
 * @param {Object} attributes
 * @return {Model}
 * @api public
 */

Model.build = function(attributes) {
  return new this(attributes);
}


/**
 * Find a model from the server using its primary key.
 *
 * @param {Function} callback
 * @callback {Model}
 * @return {Model}
 * @api public
 */

Model.find = function(id, callback) {
  return this.build({ id: id }).reload(callback);
}


/**
 * Build and save a model using the given attributes.
 *
 * @param {Object} attributes
 * @param {Function} callback
 * @callback {Model}
 * @return {Model}
 * @api public
 */

Model.save = function(attributes, callback) {
  if (typeof callback == 'undefined') callback = attributes, attributes = null;
  return this.build(attributes).save(callback);
}


/**
 * Fetch a collection of models with the given options.
 *
 * @param {Function} callback
 * @callback {Model}
 * @api public
 */

Model.fetch = function(options, callback) {
  if (typeof callback === 'undefined') { callback = options, options = {}; }

  var url = [Model.baseURL, this.path].join('/')
    , self = this;

  http.get(url, this.authenticate(options), function(err, response) {
    if (err) return callback(err);
    var records = response[self.path]
      , collection = records.map(function(record) { return new self(record); });
    callback(null, collection);
  });
}


/**
 * Prototype functions.
 */


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

Model.prototype.set = function(key, value, options) {
  var attr, attrs = {}, changes = [], self = this;

  changing = this._changing;
  this._changing = true;

  if (typeof key === 'object') {
    attrs = key;
    options = value || {};
  } else {
    attrs[key] = value;
    options = options || {};
  }

  for (attr in attrs) {
    value = attrs[attr];
    var prev = this.attributes[attr];
    this.attributes[attr] = value;
    if (value !== prev) {
      changes.push(attr);
      this.changed[attr] = value;
    }
  }

  if (changing) return this;

  if (!options.silent) {
    changes.forEach(function(attr) {
      self.emit('change:' + attr, self, self.attributes[attr]);
    });
    this.emit('change', this);
  }

  this._changing = false;

  return this;
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
  this.changed = {};

  return this;
}


/**
 * Return the path of the model using the primary key.
 *
 * @return {String}
 * @api public
 */

Model.prototype.path = function() {
  return [this.constructor.path, this.get('id')].filter(Boolean).join('/');
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

Model.prototype.request = function(method, options, callback) {
  options = options || {};
  http[method](this.url(), Model.authenticate(options), callback);
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
  if (Object.keys(this.changed).length === 0) {
    callback(null, self);
    return this;
  }

  var method = this.get('id') ? 'patch' : 'post'
    , self = this
    , body = {};

  body[this.constructor.rootKey] = this.changed;

  this.request(method, { body: body }, function(err, data) {
    if (err) return self._handleError(err.error, callback);
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
  this.request('get', null, function(err, data) {
    if (err) return self._handleError(err.error, callback);
    self.refresh(data[self.constructor.rootKey] || data)
    callback(null, self);
  });

  return this;
}


/**
 * Create a model constructor that inherits from Model and applies
 * the Model constructor function when constructed.
 *
 * @param {String} name
 * @param {String} path
 * @param {Function} init
 * @callback {Model}
 * @api public
 */

Model.createModel = function(name, extend) {
  model = new Function('Model',
    'return function Dropmail' + name + '() {' +
      'Model.apply(this, [].slice.apply(arguments));' +
    '}'
  )(Model);

  helper.inherit(model, Model);

  extend = extend || {};
  if (!extend.rootKey) extend.rootKey = name.toLowerCase();
  helper.merge(model, extend);

  return model;
}


/**
 * Emit the given error and pass it to the callback if provided.
 *
 * @param {Error} error
 * @api private
 */

Model.prototype._handleError = function(err, callback) {
  if (err.invalid) err = new ValidationError(err);
  // this.emit('error', err);
  if (callback) callback(err);
}


var ValidationError = function ValidationError(options) {
  options = options || {};
  Error.call(this, options.message);
  Model.call(this, options.invalid || {});
}

helper.inherit(ValidationError, Model);

module.exports.ValidationError = ValidationError;
