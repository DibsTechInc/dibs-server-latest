const associateClientToUser = require('./associate-clientid-to-user');

module.exports = {
  /**
   * @param {Object} user the user who the user_studio is for
   * @param {number} dibsStudioId id of the studio user_studio is for
   * @returns {Object} new dibs_user_studio instance
   */
  async build(user, dibsStudioId) {
    const studio = await models.dibs_studio.findById(+dibsStudioId, {
      include: [{
        model: models.dibs_config,
        as: 'dibs_config',
      }],
    });
    const [userStudio, created] = await models.dibs_user_studio.findOrCreate({
      where: {
        userid: user.id,
        dibs_studio_id: studio.id,
      },
      defaults: {
        source: studio.source,
        studioid: studio.studioid,
      },
    });
    if (!created && userStudio.clientid) return userStudio;
    return associateClientToUser.assign(user, userStudio, studio);
  },
};
