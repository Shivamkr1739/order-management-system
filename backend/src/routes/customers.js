const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all customers
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM customers');
  res.json(result.rows);
});

// Search customers
router.get('/search', async (req, res) => {
  const { name } = req.query;

  const result = await db.query(
    'SELECT * FROM customers WHERE name ILIKE $1',
    [`%${name}%`]
  );

  res.json(result.rows);
});

// Create customer
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  const result = await db.query(
    'INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
    [name, email, phone]
  );

  res.json(result.rows[0]);
});

module.exports = router;