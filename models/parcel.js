'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parcel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User,{as: 'user', foreignKey: 'UserId'});//nem biztos jó
    }
  }
  Parcel.init({
    parcel_number: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            checkLength(value) {
                if (value.length == 10) {
                    throw new Error("Length must be 10!");
                }
            },
        }
    },
    size: {
        type: DataTypes.ENUM('S', 'M', 'L', 'XL'),
        allowNull: false,
        validate: {
            notNull: true,
            isIn: [['S', 'M', 'L', 'XL']]
        }
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Parcel',
  });
  return Parcel;
};
