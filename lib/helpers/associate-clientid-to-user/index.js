const associateToMBStudio = require('./associate-to-mindbody-studio');
const associateToZFStudio = require('./associate-to-zingfit-studio');

module.exports = {
  assign(user, userStudio, studio) {
    switch (studio.source) {
      case 'mb':
        return associateToMBStudio(user, userStudio, studio);
      case 'zf':
        return associateToZFStudio(user, userStudio, studio);
      default:
        throw new Error('No Studio Source');
    }
  },
};
