
/**
 * Browser shim for mikael/request
 *
 */

module.exports = function(options, callback) {
  $.ajax(options.uri, {
        type: options.method || 'GET'
      , data: options.body
      , error: function(xhr, text, err) {
          callback(text, null, null);
      }
      , success: function(data) {
          callback(null, data, data);
      }
    }
  );
}
