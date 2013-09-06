var Model = require('../model');

var Template = module.exports = Model.extend('Template', { path: 'templates' });

Template.preview = function(attributes, params, callback) {
  this.build(attributes).preview(params, callback);
};

Template.prototype.preview = function(params, callback) {
  var self = this;

  var preview_path = this.path() + '/preview'
    , options = { body: { params: params } };
  this.client.request('put', preview_path, options, function(err, data) {
    if (err) { return callback(err); }
    var Message = self.client.Message;
    callback(null, Message.build(data[Message.rootKey] || data));
  });

  return this;
};
