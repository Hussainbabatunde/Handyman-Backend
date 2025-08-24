'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add FK for requestedBy
    await queryInterface.changeColumn("Bookings", "requestedBy", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // table name
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });

    // Add FK for assignedArtisan
    await queryInterface.changeColumn("Bookings", "assignedArtisan", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback requestedBy
    await queryInterface.changeColumn("Bookings", "requestedBy", {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    // Rollback assignedArtisan
    await queryInterface.changeColumn("Bookings", "assignedArtisan", {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
