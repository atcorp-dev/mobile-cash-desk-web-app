'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.sequelize.query('ALTER TABLE public."User" ALTER COLUMN id SET DEFAULT uuid_generate_v4();')
    ];
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
