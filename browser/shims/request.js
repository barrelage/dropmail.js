
/**
 * Module dependancies.
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
      , error: function(xhr, text, err) {
          var errorBody = xhr.responseText;
          if((xhr.getResponseHeader('Content-Type') || '').match(/json/)) {
            errorBody = JSON.parse(errorBody);
          }
          if (!errorBody) errorBody = err ? err : new Error(text);
          callback(errorBody, null, null);
      }
      , beforeSend: function (xhr) {
          var auth = options.auth;
          if (auth) {
            var basicAuth = Base64.encode(auth.username + ':' + auth.password);
            xhr.setRequestHeader('Authorization', 'Basic ' + basicAuth);
          }
      }
      , success: function(data) {
          callback(null, data, data);
      }
    }
  );
}
