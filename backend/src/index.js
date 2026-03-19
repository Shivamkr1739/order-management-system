const express = require('express');
const cors = require('cors');

const pool = require('./config/db');

const ordersRoutes = require('./routes/orders');
const customersRoutes = require('./routes/customers');
const productsRoutes = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Safe table creation AFTER server starts
app.listen(process.env.PORT || 3001, async () => {
  console.log(`Server running`);

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(255),
        quantity INT,
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("All tables ready ✅");
  } catch (err) {
    console.error("Table error ❌", err);
  }
});

// Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);

app.get('/', (req, res) => {
  res.send('API running...');
});