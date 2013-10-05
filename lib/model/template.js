var Model = require('../model')
  , helper = require('../helper');

var Template = module.exports = Model.extend('Template', { path: 'templates' });

Template.preview = function(attributes, params, callback) {
  this.build(attributes).preview(params, callback);
};

Template.prototype.preview = function(callback) {
  var self = this
    , params = helper.merge(this.changed, { params: this.get('params') })
    , options = { body: params, path: 'preview' };

  this.request('put', options, function(err, data) {
    if (err) { return callback(err); }

    var Email = self.client.Email;
    callback(null, Email.build(data[Email.rootKey] || data));
  });

  return this;
};

Template.prototype.revisions = function(callback) {
  var self = this;
  this.request('get', { path: 'revisions' }, function(err, data) {
    if (err) { return callback(err); }

    var Template = self.client.Template;
    callback(null, (data['template_revisions'] || []).map(
      Template.build.bind(Template)
    ));
  });
};

Template.prototype.send = function(to, params, callback) {
  var self = this
    , body = helper.merge(this.changed, { to: to, params: params })
    , options = { body: body, path: 'send' };

  this.request('post', options, function(err, data) {
    if (err) { return callback(err); }

    var Email = self.client.Email;
    callback(null, Email.build(data[Email.rootKey] || data));
  });

  return this;
};
