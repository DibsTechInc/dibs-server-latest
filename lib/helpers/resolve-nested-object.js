/**
 * @param {Object} obj with deep nested properties
 * @param {Array<String>} keys that you want to access
 * @returns {Object} nested object
 */
module.exports = function resolveNestedObject(obj, ...keys) {
    if (!obj) return null;
    return keys.reduce((acc, key) => (acc ? acc[key] : acc), obj) || null;
};
