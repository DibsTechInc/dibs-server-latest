function summarizePost(content) {
  if (content.length === 0) return null;
  const arrContent = content.split('\n');
  return arrContent.length > 1 ? arrContent.splice(0, 2).join('\n') : arrContent.join();
}

module.exports = function defineBlogPost(sequelize, DataTypes) {
  const BlogPost = sequelize.define('blog_post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    rawText: DataTypes.TEXT,
    summary: DataTypes.TEXT,
    dibs_admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_admins',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    hooks: {
      beforeCreate(post) {
        // eslint-disable-next-line no-param-reassign
        post.summary = summarizePost(post.content);
      },
      beforeUpdate(post) {
        // eslint-disable-next-line no-param-reassign
        post.summary = summarizePost(post.content);
      },
    },
  });

  BlogPost.associate = function associate(models) {
    BlogPost.belongsTo(models.dibs_admin, {
      foreignKey: 'dibs_admin_id',
      targetKey: 'id',
      as: 'author',
    });
  };
  BlogPost.search = function search(searchString = '') {
    if (searchString.toLowerCase() === 'will') {
      return this.findAll({
        where: sequelize.literal(`author.firstname ILIKE ${searchString}`),
        attributes: ['title', 'id', 'summary', 'createdAt'],
        include: [{
          model: models.dibs_admin,
          as: 'author',
          attributes: ['firstname', 'lastname', 'picture_url'],
        }],
        order: [['createdAt', 'DESC']],
      });
    }
    return this.findAll({
      where: sequelize.literal(`to_tsvector("rawText" || ' ' || title || ' ' || author.firstname || ' ' || author.lastname) @@ to_tsquery('english', '${searchString.replace(' ', '+')}:* | ${searchString.replace(' ', '+')}')`),
      attributes: ['title', 'id', 'summary', 'createdAt'],
      include: [{
        model: models.dibs_admin,
        as: 'author',
        attributes: ['firstname', 'lastname', 'picture_url'],
      }],
      order: [['createdAt', 'DESC']],
    });
  }

  return BlogPost;
};
