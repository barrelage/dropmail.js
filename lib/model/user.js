var Model = require('../model')
  , http = require('../http');

var User = module.exports = Model.createModel('User', { path: 'users' });

User.me = function(callback){
  var url = [Model.baseURL, 'me'].join('/');
  http.get(url, Model.authenticate(), function(err, data){
    if (err) return callback(err);
    callback(null, new User(data.user));
  });
}
