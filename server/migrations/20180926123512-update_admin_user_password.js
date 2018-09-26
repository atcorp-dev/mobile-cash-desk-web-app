'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var password = '$2a$10$2gI6kKWulp.TNB.IGMyZ6uvu1PgxLHoIjcnVGR/HtqQ4x6Nfrk3h2'; //admin1234
    var login = 'admin';
    return queryInterface.sequelize.query(`update "User" set "password" = '${password}' where "login" = '${login}'`);
  },

  down: (queryInterface, Sequelize) => {
    var login = 'admin';
    var password = '';
    return queryInterface.sequelize.query(`update "User" set "password" = '${password}' where "login" = '${login}'`);
  }
};
