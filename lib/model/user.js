var helper = require('../helper')
  , Model = require('../model');

var User = module.exports = function User() {
  Model.apply(this, [].slice.apply(arguments));
};

helper.merge(User, Model);
helper.merge(User.prototype, Model.prototype);

User.path    = 'users';
User.rootKey = 'user';

User.prototype.path = function() {
  return [User.path, this.get('id')].join('/')
}
