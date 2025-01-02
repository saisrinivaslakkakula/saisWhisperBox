const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the query method for executing SQL queries
module.exports = {
  query: (text, params) => pool.query(text, params),
};
