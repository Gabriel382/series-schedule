'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'password', 'password_hash');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'password_hash', 'password');
  }
};
