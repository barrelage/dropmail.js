
/**
 * Module dependencies.
 */

var Dropmail = require('../../lib/dropmail')
  , cookies = require('cookies-js')
  , store = require('store');

/**
 * Persist a user's credentials in a cookie / local-storage session.
 *
 * @param {String|Object|Authorization|User} auth
 * @param {Function} callback
 * @return {Dropmail}
 * @api public
 */

var credentialsKey = 'dropmail.session.credentials'
  , userKey = 'dropmail.session.user';

Dropmail.prototype.startSession = function(auth, callback) {
  if (typeof auth == 'function') {
    callback = auth;
    auth = void(0);
  }

  if (typeof auth == 'undefined') {
    try { auth = JSON.parse(cookies.get(credentialsKey)); } catch(e) {}
  }

  var credentials = this.authenticate(auth).credentials
    , self = this
    , user;

  if (!credentials) {
    this.endSession();
    if (callback) callback(new Error('invalid credentials'));
    return;
  }

  if ((user = store.get(userKey))) {
    persistSession(user);
  }

  if (credentials.key) {
    refreshUser();
  } else {
    var authorization = { ttl: self.options.session.expires };
    this.Authorization.save(authorization, function(err, auth) {
      if (err) {
        self.endSession();
        if (callback) callback(err);
        return;
      }

      credentials = self.authenticate(auth).credentials;
      refreshUser();
    });
  }

  return this;

  function refreshUser() {
    self.User.me(function(err, user){
      if (err) {
        self.endSession();
        if (callback) callback(err);
        return;
      }

      persistSession(user);
      if (callback) callback(null, user);
    });
  }

  function persistSession(user) {
    var encoded = JSON.stringify(credentials);
    cookies.set(credentialsKey, encoded, self.options.session);
    store.set(userKey, user);
    self.authenticatedUser = self.authenticatedUser || new self.User();
    self.authenticatedUser.set(user);
  }
};

Dropmail.prototype.endSession = function() {
  cookies.expire(credentialsKey);
  store.remove(userKey);
  this.authenticatedUser = null;
};
