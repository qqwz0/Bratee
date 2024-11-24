module.exports = (sequelize, DataTypes) => {
    const LikedBooks = sequelize.define("LikedBooks", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true, // automatically incrementing primary key
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              isIn: [['currently reading', 'in plan', 'abandoned', 'completed', 'favourite']] // Define the valid categories
            }
        }
    });

    LikedBooks.associate = (models) => {
      LikedBooks.belongsTo(models.Books, { foreignKey: 'bookId', as: 'book', onDelete: 'CASCADE', });
      LikedBooks.belongsTo(models.Users, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', });
    };
  
    return LikedBooks;
  };