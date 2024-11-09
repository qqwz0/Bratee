module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      nickname: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      profilePicture: {
          type: DataTypes.STRING, // Path to the profile picture
          allowNull: true, // Can be null initially
          defaultValue: 'pfps/311e7ad01e414f0821610c9c4f7a48ae.jpg'
      },
  });

  Users.associate = (models) => {
      Users.hasMany(models.Books, { foreignKey: { allowNull: false } });
  };

  return Users;
};