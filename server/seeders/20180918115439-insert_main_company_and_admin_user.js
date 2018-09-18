'use strict';

var companyId = '830d0596-41d1-47ea-851b-6fbe4655adfe';
var userId = '552fb3ea-9df3-47a1-a8fb-bc6dbc91fc76';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.bulkInsert('Company', [{
        id: companyId,
        name: 'AT CORP',
        code: 'atcorp',
        email: '',
        phone: '',
        address: '',
        type: 0
      }], { }),
      queryInterface.bulkInsert('User', [{
        id: userId,
        login: 'admin',
        password: '',
        email: 'atcorp.webapp@gmail.com',
        role: 1,
        companyId: companyId
      }], {}),
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.bulkDelete('User', { id: userId }),
      queryInterface.bulkDelete('Company', { id: companyId }),
    ];
  }
};
