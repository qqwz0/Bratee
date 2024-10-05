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
        type: DataTypes.BLOB('long'),
        allowNull: true,
      },
    });
  
    Books.associate = (models) => {
        Books.belongsTo(models.Genres, {
            foreignKey: {allowNull: false}
        });
        Books.belongsTo(models.Authors, {
            foreignKey: {allowNull: false}
        })
    };

    return Books;
  };