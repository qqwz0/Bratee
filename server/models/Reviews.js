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
      });

    
      Reviews.associate = (models) => {
        Reviews.belongsTo(models.Books, {
            foreignKey: {allowNull: false} 
        });
      };

    return Reviews;
  };