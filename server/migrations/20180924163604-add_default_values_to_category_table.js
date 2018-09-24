'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.sequelize.query('ALTER TABLE public."Category" ALTER COLUMN id SET DEFAULT uuid_generate_v4();'),
      queryInterface.sequelize.query('ALTER TABLE public."Category" ALTER COLUMN "createdOn" SET DEFAULT now();'),
      queryInterface.sequelize.query('ALTER TABLE public."Category" ALTER COLUMN "modifiedOn" SET DEFAULT now();'),
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
