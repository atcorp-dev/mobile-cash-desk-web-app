'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Company', 'active', { type: Sequelize.BOOLEAN }),
      queryInterface.sequelize.query('UPDATE "Company" SET "active" = true')
    ];
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropColumn('Company', 'active');
  }
};
