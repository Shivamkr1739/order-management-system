const express = require('express');
const cors = require('cors');

const pool = require('./config/db');

const ordersRoutes = require('./routes/orders');
const customersRoutes = require('./routes/customers');
const productsRoutes = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    // ✅ Orders Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(255),
        quantity INT,
        price DECIMAL(10,2),
        customer_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ✅ Customers Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ✅ Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ✅ Fix missing column (important)
    await pool.query(`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS customer_id INT
    `);

    console.log("All tables ready ✅");
  } catch (err) {
    console.error("Table error ❌", err);
  }
});

// ✅ Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API running 🚀');
});