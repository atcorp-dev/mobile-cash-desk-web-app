'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'extras', { type: Sequelize.JSONB });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropColumn('User', 'extras');
  }
};
