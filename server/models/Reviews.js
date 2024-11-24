module.exports = (sequelize, DataTypes) => {
    const Reviews = sequelize.define('Reviews', {
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 5, 
          },
        },
        review_text: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        nickname: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      });

    
      Reviews.associate = (models) => {
        Reviews.belongsTo(models.Books, {
            foreignKey: {allowNull: false},
            onDelete: 'CASCADE',
        });
        Reviews.belongsTo(models.Users, { // Establish the association with Users
          foreignKey: { allowNull: false },
          onDelete: 'CASCADE',
      });
      };

    return Reviews;
  };