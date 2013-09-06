
/**
 * Module dependencies.
 */

var Model = module.exports = require('../../lib/model');


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
};


/**
 * Set a record's attributes from a jQuery form object.
 *
 * @param {Element} form
 * @return {Model}
 * @api public
 */

var oldSet = Model.prototype.set;
Model.prototype.set = function(key, value, options) {
  if (key instanceof jQuery) {
    var $form = key;
    key = {};

    $.each($form.serializeArray(), function(){
      key[this.name] = this.value;
    });
  }

  return oldSet.call(this, key, value, options);
};
