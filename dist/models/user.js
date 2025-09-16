'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Bookings, {
                foreignKey: "requestedBy",
                as: "bookings"
            });
            User.hasOne(models.Kyc, { foreignKey: 'userId' });
        }
        // Method to compare passwords
        validPassword(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true, notEmpty: true },
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
        },
        userType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1, // 1 = customer, 2 = artisan
            validate: { isIn: [[1, 2]] },
        },
        userJobType: {
            type: DataTypes.JSON, // Stores an array of strings
            allowNull: true,
        },
        stars: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        profileImg: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "",
        },
        previousWork: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        completedKyc: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        sequelize,
        modelName: 'User',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const hash = await bcrypt.hash(user.password, 10);
                    user.password = hash;
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const hash = await bcrypt.hash(user.password, 10);
                    user.password = hash;
                }
            },
        },
    });
    return User;
};
