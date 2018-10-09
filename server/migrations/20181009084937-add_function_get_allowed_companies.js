'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION get_allowed_companies(company_id uuid)
          RETURNS TABLE(id uuid) 
          LANGUAGE 'plpgsql'
      AS $$
      BEGIN
        RETURN QUERY
        WITH RECURSIVE companies AS (
          SELECT m.id, m.name, m.type, m.code
          FROM "Company" m
          WHERE m.id = company_id
          UNION
          SELECT p.id, p.name, p.type, p.code
          FROM "Company" p
          INNER JOIN companies c ON c.id = p."parentId"
        )
        SELECT companies.id FROM companies;
      END;
      $$;
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP FUNCTION get_allowed_companies`);
  }
};
