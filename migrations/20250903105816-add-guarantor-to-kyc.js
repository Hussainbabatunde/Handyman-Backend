'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Kycs', 'guarantorFirstName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Kycs', 'guarantorLastName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Kycs', 'guarantorPhoneNumber', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Kycs', 'guarantorFirstName');
    await queryInterface.removeColumn('Kycs', 'guarantorLastName');
    await queryInterface.removeColumn('Kycs', 'guarantorPhoneNumber');
  },
};
