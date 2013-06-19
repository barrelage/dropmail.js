
/**
 * Module dependancies.
 */

var EventEmitter = require('events').EventEmitter
  , helper = require('./helper');

var Dropmail = module.exports = function Dropmail() {};

helper.merge(Dropmail, EventEmitter.prototype);

// core modules

Dropmail.http         = require('./http');
Dropmail.Model        = require('./model');

// models

Dropmail.Authorization = require('./model/authorization');
Dropmail.Domain        = require('./model/domain');
Dropmail.Message       = require('./model/message');
Dropmail.Organization  = require('./model/organization');
Dropmail.Template      = require('./model/template');
Dropmail.User          = require('./model/user');

Dropmail.authenticate = function(auth) {
  Dropmail.Model.key = null;
  Dropmail.Model.username = null;
  Dropmail.Model.password = null;

  if (typeof auth == 'string') {
    Dropmail.Model.key = auth;
  } else if (auth instanceof Dropmail.Authorization) {
    Dropmail.Model.key = auth.get('key');
  } else if (typeof auth === 'object' && 'email' in auth) {
    Dropmail.Model.username = auth.email
    Dropmail.Model.password = auth.password
  } else if (auth instanceof Dropmail.User) {
    Dropmail.Model.username = auth.get('email');
    Dropmail.Model.password = auth.get('password');
  }
};
