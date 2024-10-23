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
    });
  
    Books.associate = (models) => {
        Books.belongsTo(models.Genres, {
            foreignKey: {allowNull: false}
        });
        Books.belongsTo(models.Authors, {
            foreignKey: {allowNull: false}
        })
        ;
        Books.hasMany(models.Reviews, {
            foreignKey: {allowNull: false}
        });
    };

    return Books;
  };