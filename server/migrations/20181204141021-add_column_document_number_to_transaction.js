'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Transaction', 'documentNumber', {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      }),
      queryInterface.addIndex('Transaction', ['documentNumber'])
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeIndex('Transaction', 'transaction_document_number'),
      queryInterface.dropColumn('Transaction', 'documentNumber')
    ]
  }
};
