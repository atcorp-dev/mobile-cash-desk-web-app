'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Company', 'extras', { type: Sequelize.JSONB });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropColumn('Company', 'extras');
  }
};
