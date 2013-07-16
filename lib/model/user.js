var Model = require('../model');

var User = module.exports = Model.extend('User', { path: 'users' });

User.me = function(callback) {
  var Ctor = this;
  this.client.get('me', function(err, data){
    if (err) { return callback(err); }

    callback(null, new Ctor(data.user));
  });
};
