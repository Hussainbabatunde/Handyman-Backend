'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kyc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kyc.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Kyc.init({
    name: DataTypes.STRING,
    document: DataTypes.TEXT,
    userId: {
  type: DataTypes.INTEGER,
  allowNull: false
}

  }, {
    sequelize,
    modelName: 'Kyc',
  });
  return Kyc;
};