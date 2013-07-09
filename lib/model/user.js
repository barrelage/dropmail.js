var Model = require('../model')
  , http = require('../http');

var User = module.exports = Model.extend('User', { path: 'users' });

User.me = function(callback) {
  var ctor = this;
  this.client.get('me', function(err, data){
    if (err) return ctor.prototype._handleError(err, callback);
    callback(null, new ctor(data.user));
  });
};
