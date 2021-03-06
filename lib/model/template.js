var Model = require('../model')
  , helper = require('../helper');

var Template = module.exports = Model.extend('Template', { path: 'templates' });

Template.preview = function(attributes, params, callback) {
  this.build(attributes).preview(params, callback);
};

Template.prototype.preview = function(callback) {
  var self = this
    , preview_path = this.path('preview')
    , params = helper.merge(this.changed, { params: this.get('params') })
    , options = { body: params };

  this.client.request('put', preview_path, options, function(err, data) {
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

    var TemplateRevision = self.client.TemplateRevision;
    callback(null, (data.get('template_revisions') || []).map(
      TemplateRevision.build.bind(TemplateRevision)
    ));
  });
};

Template.prototype.send = function(to, params, callback) {
  var self = this;

  this.save(function(err, template){
    if (err) { return callback(err); }

    var options = { to: to, params: params }
      , Email = self.client.Email.build(options)
      , revision = template.get('id') + '@' + template.get('revision');

    Email.set('template', revision);

    Email.save(callback);
  });

  return this;
};
