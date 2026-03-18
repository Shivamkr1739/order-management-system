const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, c.name AS customer_name, c.email AS customer_email,
             p.name AS product_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create Order (with transaction + stock validation)
router.post('/', async (req, res) => {
  const { customer_id, product_id, quantity, shipping_address } = req.body;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Get product
    const productRes = await client.query(
      'SELECT * FROM products WHERE id = $1',
      [product_id]
    );

    const product = productRes.rows[0];

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.inventory_count < quantity) {
      throw new Error('Not enough stock');
    }

    const total_amount = product.price * quantity;

    // Insert order
    const orderRes = await client.query(
      `INSERT INTO orders (customer_id, product_id, quantity, total_amount, shipping_address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_id, product_id, quantity, total_amount, shipping_address]
    );

    // Update stock
    await client.query(
      'UPDATE products SET inventory_count = inventory_count - $1 WHERE id = $2',
      [quantity, product_id]
    );

    await client.query('COMMIT');

    res.json(orderRes.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ✅ Update Order Status (including cancel)
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;