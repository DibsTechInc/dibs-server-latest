/**
 * @param {Object} cls built in JavaScript class we want to extend
 * @returns {function} constructor for extended class
 */
function extendableBuiltin(cls) {
  /**
   * @param {Array<any>} args arguments for class constructor
   * @returns {undefined}
   */
  function innerExtendableBuiltin(...args) {
    cls.apply(this, args);
  }
  innerExtendableBuiltin.prototype = Object.create(cls.prototype);
  Object.setPrototypeOf(innerExtendableBuiltin, cls);

  return innerExtendableBuiltin;
}

module.exports = {
  extendableBuiltin,
};
