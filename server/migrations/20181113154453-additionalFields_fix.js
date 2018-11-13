'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`update "Item" set "additionalFields" = '[]' where "additionalFields" is null`);
  },

  down: (queryInterface, Sequelize) => { }
};
