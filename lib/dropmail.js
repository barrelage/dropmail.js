
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

Dropmail.Domain       = require('./model/domain');
Dropmail.Message      = require('./model/message');
Dropmail.Organization = require('./model/organization');
Dropmail.Template     = require('./model/template');
Dropmail.User         = require('./model/user');
