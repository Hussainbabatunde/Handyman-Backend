'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Kycs');
    if (!table.userId) {
      await queryInterface.addColumn('Kycs', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Kycs');
    if (table.userId) {
      await queryInterface.removeColumn('Kycs', 'userId');
    }
  }
};
