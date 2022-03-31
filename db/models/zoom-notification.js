module.exports = function linkReceipt(sequelize, DataTypes) {
    /**
     * zoom_notification
     * @prop {number} id primary key
     * @prop {number} eventid of the class
     * @prop {string} email of the user
     * @prop {number} userid where available
     */
    const ZoomNotification = sequelize.define('zoom_notification', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventid: {
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
      },
      userid: {
        type: DataTypes.INTEGER,
      },
      dibs_studio_id: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    }, {});
  
    return ZoomNotification;
  };
  