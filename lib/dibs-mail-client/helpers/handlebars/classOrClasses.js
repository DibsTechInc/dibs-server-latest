module.exports = function classOrClasses(handlebars) {
  return handlebars.registerHelper(
    'classOrClasses', length => (length > 1 ? 'classes' : 'class'));
};
