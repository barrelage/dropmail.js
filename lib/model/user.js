var Model = require('../model')
  , http = require('../http');

var User = module.exports = Model.createModel('User', { path: 'users' });

User.me = function(callback){
  var url = [Model.baseURL, 'me'].join('/');
  http.get(url, Model.authenticate(), callback);
}
