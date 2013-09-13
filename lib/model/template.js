var Model = require('../model')
  , helper = require('../helper');

var Template = module.exports = Model.extend('Template', { path: 'templates' });

Template.preview = function(attributes, params, callback) {
  this.build(attributes).preview(params, callback);
};

Template.prototype.preview = function(params, callback) {
  var self = this
    , preview_path = this.path() + '/preview'
    , options = { body: helper.merge(this.changed, { params: params }) };

  this.client.request('put', preview_path, options, function(err, data) {
    if (err) { return callback(err); }

    var Message = self.client.Message;
    callback(null, Message.build(data[Message.rootKey] || data));
  });

  return this;
};

Template.prototype.send = function(params, callback) {
  var self = this
    , preview_path = this.path() + '/send'
    , options = { body: helper.merge(this.changed, { params: params }) };

  this.client.request('post', preview_path, options, function(err, data) {
    if (err) { return callback(err); }

    var Message = self.client.Message;
    callback(null, Message.build(data[Message.rootKey] || data));
  });

  return this;
};
