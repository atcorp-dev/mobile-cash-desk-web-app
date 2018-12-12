'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`UPDATE "User" SET "name" = 'Administrator' WHERE "login" = 'admin'`);

  },

  down: (queryInterface, Sequelize) => {  }
};
