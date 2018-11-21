'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('Transaction', ['dateTime'])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('Transaction', 'transaction_date_time')
  }
};
