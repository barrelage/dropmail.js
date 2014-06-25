var Model = require('../model')
  , helper = require('../helper');

var TemplateRevision = Model.extend('TemplateRevision', { path: 'templates' });

TemplateRevision.prototype.publish = function(callback) {
  var self = this;

  this.client.request('put', this.path('publish'), {}, function(err, data) {
    if (err) { return callback(err); }

    var Revision = self.client.TemplateRevision;
    callback(null, Revision.build(data['template']));
  });

  return this;
};

TemplateRevision.prototype.path = function() {
  var id = this.get('template_id') + '@' + this.get('id')
    , segments = [this.constructor.path, id];

  return segments.concat([].slice.call(arguments)).filter(Boolean).join('/');
}

module.exports = TemplateRevision;

