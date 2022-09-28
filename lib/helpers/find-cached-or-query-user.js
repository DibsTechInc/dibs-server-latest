const redisInterface = require('@dibs-tech/redis-interface');
const models = require('@dibs-tech/models');
const { userIncludeConfig } = require('../../config/passport/include-config');


module.exports = async function findCachedOrQueryUser(userid, dibsStudioId) {
  let user;
  const redisJSON = await redisInterface.retrieveJSON(`dibs_user-${userid}`);
  if (redisJSON) {
    user = models.dibs_user.build(redisJSON, {
      include: [{
        model: models.dibs_user_studio,
        as: 'userStudios',
        where: {
          dibs_studio_id: dibsStudioId,
        },
        required: false,
      }, ...userIncludeConfig(models)],
      isNewRecord: false,
    });
    user.userStudios = user.userStudios || await user.getUserStudios({
      where: {
        dibs_studio_id: dibsStudioId,
      },
    });
  } else {
    user = await models.dibs_user.findById(userid, {
      include: [{
        model: models.dibs_user_studio,
        as: 'userStudios',
        where: {
          dibs_studio_id: dibsStudioId,
        },
        required: false,
      }, ...userIncludeConfig(models)],
    });
  }
  return user;
};
