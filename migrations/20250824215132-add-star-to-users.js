'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "stars", {
      type: Sequelize.INTEGER,
      allowNull: true, // user may not have a rating yet
      defaultValue: 0, // optional default
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "stars");
  },
};
