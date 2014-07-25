var Model = require('../model');

var Authorization = Model.extend('Authorization', { path: 'authorizations' });

Authorization.prototype.isSignedIn = function() {
  return this.get('key') !== undefined;
};

module.exports = Authorization;
