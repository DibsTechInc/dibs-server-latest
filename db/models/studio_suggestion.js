module.exports = function linkStudioSuggestion(sequelize, DataTypes) {
  /**
   * studio_suggestion
   * @class studio_suggestions
   */
  const StudioSuggestion = sequelize.define('studio_suggestion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    times_suggested: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
  StudioSuggestion.prototype.getClientJSON = function getClientJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  };
  return StudioSuggestion;
};
