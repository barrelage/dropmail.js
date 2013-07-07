
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

exports.inherit = function(ctor, superCtor) {
  exports.merge(ctor, superCtor);
  ctor.prototype = new superCtor;
  ctor.prototype.constructor = ctor;
  ctor.__super__ = ctor.super_ = superCtor;
  return ctor;
};
