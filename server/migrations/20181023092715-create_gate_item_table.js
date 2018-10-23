'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('GateItem', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      key: Sequelize.UUID,
      createdById: Sequelize.UUID,
      createdOn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE
      },
      modifiedById: Sequelize.UUID,
      modifiedOn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE
      },
      name: Sequelize.TEXT,
      code: Sequelize.TEXT,
      extCode: Sequelize.TEXT,
      barCode: Sequelize.TEXT,
      description: Sequelize.TEXT,
      available: Sequelize.BOOLEAN,
      categoryId: Sequelize.UUID,
      companyId: Sequelize.UUID,
      price: Sequelize.DECIMAL,
      image: Sequelize.TEXT({ length: 'long' }),
      additionalFields: Sequelize.JSONB,
      source: Sequelize.JSONB
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('GateItem');
  }
};
