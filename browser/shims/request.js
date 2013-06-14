
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
          callback(errorBody, null, null);
      }
      , beforeSend: function (xhr) {
          var auth = options.auth;
          if (auth) {
            var basicAuth = new Buffer(
              auth.username + ':' + auth.password
            ).toString('base64');
            xhr.setRequestHeader('Authorization', 'Basic ' + basicAuth);
          }
      }
      , success: function(data) {
          callback(null, data, data);
      }
    }
  );
}
