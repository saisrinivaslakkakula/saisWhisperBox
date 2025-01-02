const { Pool } = require('pg');
require('dotenv').config();

// Initialize the database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the database connection and log success
pool.connect()
  .then(client => {
    console.log('Database connection successful ✅');
    client.release(); // Release the client back to the pool
  })
  .catch(err => {
    console.error('Database connection error ❌:', err.stack);
  });

// Export the query method for executing SQL queries
module.exports = {
  query: (text, params) => pool.query(text, params),
};
