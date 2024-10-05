module.exports = (sequelize, DataTypes) => {
    const Authors = sequelize.define("Authors", {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    Authors.associate = (models) => {
        Authors.hasMany(models.Books);
    };

    return Authors;
  };