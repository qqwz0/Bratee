module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define("Books", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0, // Default rating is 0
    },
  });

  Books.associate = (models) => {
    Books.belongsTo(models.Genres, {
      foreignKey: { allowNull: false },
    });
    Books.belongsTo(models.Authors, {
      foreignKey: { allowNull: false },
    });
    Books.hasMany(models.Reviews, {
      foreignKey: { allowNull: false },
    });
    Books.belongsTo(models.Users, {
      foreignKey: { allowNull: false },
    });
    Books.hasMany(models.LikedBooks, { foreignKey: 'bookId', as: 'likedBooks' });
  };

  return Books;
};