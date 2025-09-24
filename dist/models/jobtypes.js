'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class JobTypes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Bookings, {
                foreignKey: "jobTypeKey",
                as: "bookings"
            });
        }
    }
    JobTypes.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true },
        },
        image: {
            type: DataTypes.STRING, // store image URL or path
            allowNull: true, // make it optional
        },
    }, {
        sequelize,
        modelName: 'JobTypes',
    });
    return JobTypes;
};
