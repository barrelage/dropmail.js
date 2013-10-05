var Model = require('../model');

var Domain = module.exports = Model.extend('Domain', { path: 'domains' });

Domain.prototype.verify = function(callback) {
  return this.request('put', { path: 'verify' }, callback);
}
