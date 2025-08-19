'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'userType', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'userType', {
      type: Sequelize.ENUM('customer', 'artisan'),
      allowNull: false,
      defaultValue: 'customer'
    });
  }
};