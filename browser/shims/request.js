
/**
 * Module dependencies.
 */

require('js-base64');


/**
 * Browser shim for mikael/request
 *
 */

module.exports = function(options, callback) {
  $.ajax(options.uri, {
        type: options.method || 'GET'
      , data: options.body
      , error: function(xhr, status, err) {
          var errorBody = xhr.responseText;
          if((xhr.getResponseHeader('Content-Type') || '').match(/json/)) {
            errorBody = JSON.parse(errorBody);
          }
          callback(errorBody || err || status, xhr);
      }
      , beforeSend: function (xhr) {
          var auth = options.auth;
          if (auth) {
            var basicAuth = Base64.encode(auth.username + ':' + auth.password);
            xhr.setRequestHeader('Authorization', 'Basic ' + basicAuth);
          }
      }
      , success: function(data, status, xhr) {
          callback(null, xhr, data);
      }
    }
  );
}
