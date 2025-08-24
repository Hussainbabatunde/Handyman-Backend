'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scheduledAt: {
        type: Sequelize.DATE
      },
      location: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      requestedBy: {
        type: Sequelize.INTEGER
      },
      assignedArtisan: {
        type: Sequelize.INTEGER
      },
      jobTypeKey: {
        type: Sequelize.INTEGER
      },
      artisanStatus: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};