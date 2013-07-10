
/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     helper.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 */

exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};


/**
 * Inherit one constructor's members and prototype in another.
 *
 * @param {Function} ctor
 * @param {Function} _super
 * @return {Function}
 * @api public
 */

exports.inherit = function(ctor, SuperCtor) {
  exports.merge(ctor, SuperCtor);
  ctor.prototype = new SuperCtor();
  ctor.prototype.constructor = ctor;
  /* jshint camelcase: false */
  ctor.__super__ = ctor.super_ = SuperCtor;
  return ctor;
};
