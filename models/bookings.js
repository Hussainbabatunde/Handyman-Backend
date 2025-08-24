'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
      foreignKey: "requestedBy",
      as: "requester"
    });

    // booking belongs to an artisan (user assigned to it)
    this.belongsTo(models.User, {
      foreignKey: "assignedArtisan",
      as: "artisan"
    });

    this.belongsTo(models.JobTypes, {
      foreignKey: "jobTypeKey",
      as: "jobType"
    });
    }
  }
  Bookings.init({
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false, // required
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false, // required
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false, // required
  },
  requestedBy: {
    type: DataTypes.INTEGER,
    allowNull: true, // optional
  },
  assignedArtisan: {
    type: DataTypes.INTEGER,
    allowNull: false, // required
  },
  jobTypeKey: {
    type: DataTypes.INTEGER,
    allowNull: false, // required
  },
  artisanStatus: {
    type: DataTypes.STRING,
    allowNull: true, // optional
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true, // optional
  }
}, {
  sequelize,
  modelName: 'Bookings',
});
  return Bookings;
};