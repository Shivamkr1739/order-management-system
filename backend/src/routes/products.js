const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM products');
  res.json(result.rows);
});

module.exports = router;