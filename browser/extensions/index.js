
/**
 * Module dependencies.
 */

var Dropmail = require('../../lib/dropmail');

// load other extensions

require('./model');
require('./session');


/**
 * Add form-parsing support to Dropmail#authenticate.
 *
 * @param {String|Object|Authorization|User|jQuery} auth
 * @param {Function} callback
 * @return {Dropmail}
 * @api public
 */

var _authenticate = Dropmail.prototype.authenticate;

Dropmail.prototype.authenticate = function(auth) {
  if (auth instanceof jQuery) { auth = this.User.build(auth); }
  return _authenticate.call(this, auth);
};
