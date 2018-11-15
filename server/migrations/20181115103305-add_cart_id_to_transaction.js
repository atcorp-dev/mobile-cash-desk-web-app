'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Transaction', 'cartId', { type: Sequelize.UUID }),
      queryInterface.addIndex('Transaction', ['cartId'])
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeIndex('Transaction', 'transaction_cart_id'),
      queryInterface.dropColumn('Transaction', 'cartId')
    ]
  }
};
