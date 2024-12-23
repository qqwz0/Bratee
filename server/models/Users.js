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
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default to false for non-admin users
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Books, { foreignKey: { allowNull: false } });
    Users.associate = (models) => {
      Users.hasMany(models.LikedBooks, { foreignKey: 'userId', as: 'likedBooks', onDelete: 'CASCADE' });
    };
  };

  return Users;
};