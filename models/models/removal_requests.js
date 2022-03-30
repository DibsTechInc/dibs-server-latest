module.exports = function linkRemovalRequests(sequelize, DataTypes) {
  return sequelize.define('removal_requests', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    classDate: {
      type: DataTypes.STRING,
    },
    classTime: {
      type: DataTypes.STRING,
    },
    locationName: {
      type: DataTypes.STRING,
    },
    locationid: {
      type: DataTypes.INTEGER,
    },
    studioClassName: {
      type: DataTypes.STRING,
    },
    trainerName: {
      type: DataTypes.STRING,
    },
    trainerid: {
      type: DataTypes.INTEGER,
    },
    employeeName: {
      type: DataTypes.STRING,
    },
    employeeEmail: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {

  });
};
