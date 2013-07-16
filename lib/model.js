
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , helper = require('./helper')
  , http = require('./http');

/**
 * Abstract Model that accepts an object of attributes.
 *
 * @param {Object} attrs
 * @return {Model}
 * @api public
 */

var Model = module.exports = function Model(attrs) {
  EventEmitter.call(this);

  this.attributes = {};
  this.changed = {};
  this.set(attrs || {});

  if(this.initialize) {
    this.initialize.apply(this, [].slice.call(arguments));
  }
};

helper.inherit(Model, EventEmitter);


/**
 * Contructor functions.
 */


/**
 * Build a model using the given attributes.
 *
 * @param {Object} attributes
 * @return {Model}
 * @api public
 */

Model.build = function(attributes) {
  var Ctor = this;
  return new Ctor(attributes);
};


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
};


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
  if (typeof callback == 'undefined') {
    callback = attributes;
    attributes = null;
  }

  return this.build(attributes).save(callback);
};


/**
 * Fetch a collection of models with the given options.
 *
 * @param {Function} callback
 * @callback {Model}
 * @api public
 */

Model.fetch = function(options, callback) {
  if (typeof callback === 'undefined') {
    callback = options;
    options = {};
  }

  var Ctor = this;
  this.client.request('get', Ctor.path, options, function(err, data) {
    if (err) { return callback(err); }
    callback(null, (data[Ctor.path] || []).map(Ctor.build.bind(Ctor)));
  });
};


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
};


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

  var changing = this._changing;
  this._changing = true;

  if (typeof key === 'object') {
    attrs = key instanceof Model ? key.attributes : key;
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
};


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
};


/**
 * Return the path of the model using the primary key.
 *
 * @return {String}
 * @api public
 */

Model.prototype.path = function() {
  return [this.constructor.path, this.get('id')].filter(Boolean).join('/');
};


/**
 * Make a request to the resource endpoint and handle response.
 *
 * @param {String} method
 * @param {Object} options
 * @param {Function} callback
 * @callback {Model}
 * @return {Model}
 * @api public
 */


Model.prototype.request = function(method, options, callback) {
  var self = this;

  this.client.request(method, this.path(), options, function(err, data) {
    if (err) { return callback(err); }
    self.refresh(data[self.constructor.rootKey] || data);
    callback(null, self);
  });

  return this;
};


/**
 * Persists the model's attributes to the server.
 *
 * @param {Function} callback
 * @callback {Model}
 * @return {Model}
 * @api public
 */

Model.prototype.save = function(callback) {
  var persisted = this.get('id');

  if (persisted && Object.keys(this.changed).length === 0) {
    callback(null, this);
    return this;
  }

  var method = persisted ? 'patch' : 'post';

  return this.request(method, { body: this.changed }, callback);
};


/**
 * Reloads the model's attributes from the server.
 *
 * @param {Function} callback
 * @callback {Model}
 * @return {Model}
 * @api public
 */

Model.prototype.reload = function(callback) {
  return this.request('get', callback);
};


/**
 * Returns a hash of attributes ready for JSON serialization.
 *
 * @return {Object}
 * @api public
 */

Model.prototype.toJSON = function() {
  return this.attributes;
};


/**
 * Returns a hash of attributes ready for JSON serialization.
 *
 * @return {Object}
 * @api public
 */

Model.prototype.toString = Model.prototype.inspect = function() {
  return '[' +
    this.constructor.name + ' ' +
    JSON.stringify(this.attributes) +
  ' ]';
};


/**
 * Create a model constructor that inherits from Model and applies
 * the Model constructor function when constructed.
 *
 * @param {String} name
 * @param {Object} properties
 * @callback {Model}
 * @api public
 */

Model.extend = function(name, properties) {
  properties = properties || {};
  properties.rootKey = properties.rootKey || name.toLowerCase();

  if (!properties.client) {
    properties.client = http;
    properties.bindClient = function(client) {
      return this.extend(name, helper.merge(properties, { client: client }));
    };
  }

  /* jshint evil: true */
  var modelCtor = new Function('Model', 'client',
    'function Dropmail' + name + '() {' +
      'Model.apply(this, [].slice.apply(arguments));' +
      'this.client = client;' +
    '};' +
    'return Dropmail' + name + ';'
  )(this, properties.client);

  helper.inherit(modelCtor, this);
  helper.merge(modelCtor, properties);

  return modelCtor;
};

