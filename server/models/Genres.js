module.exports = (sequelize, DataTypes) => {
    const Genres = sequelize.define("Genres", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    Genres.associate = (models) => {
        Genres.hasMany(models.Books);
    };
  
    return Genres;
  };