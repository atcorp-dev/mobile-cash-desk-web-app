'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var createTableQuery = queryInterface.createTable('Cart', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdOn: Sequelize.DATE,
      createdById: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      modifiedOn: Sequelize.DATE,
      modifiedById: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      companyId: {
        type: Sequelize.UUID,
        references: {
          model: 'Company',
          key: 'id'
        }
      },
      type: Sequelize.SMALLINT,
      clientInfo: Sequelize.TEXT,
      items: Sequelize.JSONB,
      extras: Sequelize.JSONB,
      history: Sequelize.JSONB,
    });
    return [
      createTableQuery,
      queryInterface.sequelize.query('ALTER TABLE "Cart" ALTER COLUMN id SET DEFAULT uuid_generate_v4();'),
      queryInterface.sequelize.query('ALTER TABLE "Cart" ALTER COLUMN "createdOn" SET DEFAULT now();'),
      queryInterface.sequelize.query('ALTER TABLE "Cart" ALTER COLUMN "modifiedOn" SET DEFAULT now();'),
    ]
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cart');
  }
};
