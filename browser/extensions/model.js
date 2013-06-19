
/**
 * Module dependencies.
 */

var Model = module.exports = require('../../lib/model');


/**
 * Serialize a record from a jQuery form object.
 *
 * @param {Element} form
 * @return {Model}
 * @api public
 */

Model.build = function(attributes) {
  var instance;

  if (attributes instanceof jQuery) {
    var $form = $(attributes);

    attributes = {};
    $.each($form.serializeArray(), function(){
      attributes[this.name] = this.value;
    });
  }

  return new this(attributes);
}


/**
 * Bind to the submit event on a jQuery form object and save the record.
 *
 * @param {Element} form
 * @param {Function} callback
 * @callback {Model}
 * @api public
 */

Model.form = function(form, callback) {
  var $form = $(form)
    , model = this;

  $form.on('submit', function(){
    model.save($form, callback);
    return false;
  });

  return $form;
}
