'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns or other schema changes here if needed
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'birthday');
    await queryInterface.removeColumn('Users', 'state');
    await queryInterface.removeColumn('Users', 'email');
  }
};
