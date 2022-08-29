'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }

    toJSON() {
        let data = Object.assign({}, this.get());
        if (data.hasOwnProperty("password")) {
            delete data.password;
        }
        return data;
    }

    static associate(models) {
      // define association here
      this.hasMany(models.Parcel);
    }
  }
  User.init({
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email_address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            isEmail: true,
        },
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notNull: false,
            is: ["^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$"],
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            len: [4, 128],
        },
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: (user) => {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        },
    },
  });
  return User;
};
