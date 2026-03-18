const { Pool } = require('pg');

const pool = new Pool({
  user: 'shivamkumar',
  host: 'localhost',
  database: 'orders_db',
  password: '',
  port: 5432,
});

module.exports = pool;