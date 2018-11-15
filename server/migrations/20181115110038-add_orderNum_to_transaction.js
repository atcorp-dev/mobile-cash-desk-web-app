'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Transaction', 'orderNum', { type: Sequelize.TEXT }),
      queryInterface.addIndex('Transaction', ['orderNum'])
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeIndex('Transaction', 'transaction_orderNum'),
      queryInterface.dropColumn('Transaction', 'order_num')
    ]
  }
};
