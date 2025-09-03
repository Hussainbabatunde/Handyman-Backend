'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Chat, { foreignKey: "conversationId" });
      this.belongsTo(models.User, { as: "user1", foreignKey: "user1Id" });
      this.belongsTo(models.User, { as: "user2", foreignKey: "user2Id" });
    }
  }
  Conversation.init({
    user1Id: { type: DataTypes.INTEGER, allowNull: false },
    user2Id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};