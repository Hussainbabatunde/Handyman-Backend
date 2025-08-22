'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('JobTypes', 'description', {
      type: Sequelize.STRING, // or Sequelize.TEXT
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('JobTypes', 'description');
  }
};
