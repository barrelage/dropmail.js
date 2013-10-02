var Model = require('../model')
  , helper = require('../helper');

var Template = module.exports = Model.extend('Template', { path: 'templates' });

Template.preview = function(attributes, params, callback) {
  this.build(attributes).preview(params, callback);
};

Template.prototype.preview = function(callback) {
  var self = this
    , preview_path = this.path() + '/preview'
    , params = helper.merge(this.changed, { params: this.get('params') })
    , options = { body: params };

  this.client.request('put', preview_path, options, function(err, data) {
    if (err) { return callback(err); }

    var Email = self.client.Email;
    callback(null, Email.build(data[Email.rootKey] || data));
  });

  return this;
};

Template.prototype.revisions = function(options, callback) {
  if (typeof callback === 'undefined') {
    callback = options;
    options = {};
  }

  var self = this
    , revisions_path = this.path() + '/revisions';

  this.client.request('get', revisions_path, function(err, data) {
    if (err) { return callback(err); }

    var Template = self.client.Template;
    callback(null, (data['template_revisions'] || []).map(
      Template.build.bind(Template)
    ));
  });
};

Template.prototype.send = function(params, callback) {
  var self = this
    , send_path = this.path() + '/send'
    , options = { body: helper.merge(this.changed, { params: params }) };

  this.client.request('post', send_path, options, function(err, data) {
    if (err) { return callback(err); }

    var Email = self.client.Email;
    callback(null, Email.build(data[Email.rootKey] || data));
  });

  return this;
};
