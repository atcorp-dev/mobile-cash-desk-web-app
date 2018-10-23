'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Item', ['companyId', 'extCode'], {
      type: 'unique',
      name: 'unique_constraint_company_ext_code'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Item', 'unique_constraint_company_ext_code');
  }
};
