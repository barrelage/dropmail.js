
/**
 * Module dependencies.
 */

var cookies = require('cookies-js')
  , helper = require('../../lib/helper')
  , Dropmail = require('../../lib/dropmail');

// expose the cookies module

Dropmail.prototype.cookies = cookies;

// the key to use when persisting the session

var sessionKey = 'dropmail.session.authorization';


/**
 * Start a session by looking up any existing one,
 * then creating one if needed.
 *
 * @param {String|Object|Authorization|User} auth
 * @param {Function} callback
 * @return {Dropmail}
 * @api public
 */

Dropmail.prototype.startSession = function(auth, callback) {
  if (typeof auth == 'function') {
    callback = auth;
    auth = void(0);
  }

  if (typeof auth !== 'undefined') {
    this.authenticate(auth);
  }

  var authorization = this._resumeSession()
    , credentials = this.credentials
    , self = this;

  if (!authorization && !credentials) {
    this.endSession();
    if (callback) callback(new Error('invalid credentials'));
    return this;
  }

  if (authorization) {
    refreshAuthorization(authorization);
  } else if (credentials) {
    if (credentials.key) {
      refreshAuthorization(new this.Authorization(credentials));
    } else {
      this.createSession(callback);
    }
  }

  return this;

  function refreshAuthorization(authorization) {
    self.persistSession(authorization);
    authorization.reload(self._handleSession.bind(self, callback));
  }
};


/**
 * Force a new session to be created.
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Dropmail}
 * @api public
 */

Dropmail.prototype.createSession = function(options, callback) {
  options = options || {};

  if (typeof options == 'function') {
    callback = options;
    options = {};
  }

  var defaults = helper.merge({ ttl: 3600 }, options)
    , attrs = helper.merge(defaults, options);

  this.Authorization.save(attrs, this._handleSession.bind(this, callback));

  return this;
};


/**
 * Save an existing authorization as the session.
 *
 * @param {Authorization} authorization
 * @return {Dropmail}
 * @api public
 */

Dropmail.prototype.persistSession = function(auth) {
  var user = auth.get('user')
    , organization  = auth.get('organization');

  var data = {
    key: auth.get('key'),
    expires_at: auth.get('expires_at'),
    organization: { },
    user: {
      id:    user.get('id'),
      name:  user.get('name'),
      email: user.get('email')
    }
  };

  if (organization) {
    data.organization = {
      id: organization.get('id'),
      name: organization.get('name')
    };
  }

  cookies(sessionKey, JSON.stringify(data), { expires: 3600 });

  this.authenticate(auth);
  this.session = this.session || new this.Authorization();
  this.session.set(auth);
  this.emit('change:session', auth);
};


/**
 * End any existing session.
 *
 * @param {Function} callback
 * @return {Dropmail}
 * @api public
 */

Dropmail.prototype.endSession = function(err) {
  cookies.expire(sessionKey);
  this.session = null;
  this.emit('change:session', null, err);
};


/**
 * Resume a session from a cookie.
 *
 * @return {Authorization}
 * @api private
 */

Dropmail.prototype._resumeSession = function() {
  var authorization;
  try {
    authorization = JSON.parse(cookies(sessionKey));
    this.credentials = { key: authorization.key };
  } catch(e) {}
  return authorization && new this.Authorization(authorization);
};


/**
 * Handle the response when receiving a new session.
 *
 * @param {Function} callback
 * @param {Error} err
 * @param {Authorization} auth
 * @api private
 */

Dropmail.prototype._handleSession = function(callback, err, auth) {
  if (err) {
    this.endSession();
    if (callback) callback(err, auth);
    return;
  }

  this.persistSession(auth);
  if (callback) callback(null, auth);
};
