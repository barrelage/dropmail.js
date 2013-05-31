
var Dropmail = module.exports = function Dropmail() {};

// core modules

Dropmail.http         = require('./http');
Dropmail.Model        = require('./model');

// models

Dropmail.Domain       = require('./model/domain');
Dropmail.Message      = require('./model/message');
Dropmail.Organization = require('./model/organization');
Dropmail.Template     = require('./model/template');
Dropmail.User         = require('./model/user');
