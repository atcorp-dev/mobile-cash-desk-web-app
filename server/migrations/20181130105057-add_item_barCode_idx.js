'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('Item', ['companyId', 'barCode'])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('Item', 'item_company_id_bar_code')
  }
};
