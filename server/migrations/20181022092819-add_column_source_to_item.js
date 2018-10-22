'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Item', 'source', { type: Sequelize.JSONB });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropColumn('Item', 'source');
  }
};
