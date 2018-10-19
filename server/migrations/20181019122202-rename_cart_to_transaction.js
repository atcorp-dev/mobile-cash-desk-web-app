'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.renameTable('Cart', 'Transaction'),
      queryInterface.addColumn('Transaction', 'totalPrice', { type: Sequelize.DOUBLE })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.renameTable('Transaction', 'Cart'),
      queryInterface.removeColumn('Transaction', 'totalPrice')
    ];
  }
};
