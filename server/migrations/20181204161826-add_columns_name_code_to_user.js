'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('User', 'name', { type: Sequelize.TEXT }),
      queryInterface.addColumn('User', 'code', { type: Sequelize.TEXT }),
      queryInterface.addIndex('User', ['code'])
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeIndex('User', 'user_code'),
      queryInterface.dropColumn('User', 'code'),
      queryInterface.dropColumn('User', 'name')
    ]
  }
};
