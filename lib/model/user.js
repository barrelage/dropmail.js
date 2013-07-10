var Model = require('../model');

var User = module.exports = Model.extend('User', { path: 'users' });

User.me = function(callback) {
  var Ctor = this;
  this.client.get('me', function(err, data){
    if (err) return Ctor.prototype._handleError(err, callback);
    callback(null, new Ctor(data.user));
  });
};
