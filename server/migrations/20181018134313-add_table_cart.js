'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cart', {
      id: Sequelize.UUID,
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
      dateTime: Sequelize.DATE,
      status: Sequelize.SMALLINT,
      ownerId: {
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      itemList: Sequelize.JSONB
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cart');
  }
};
