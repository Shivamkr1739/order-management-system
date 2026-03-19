const express = require('express');
const cors = require('cors');

const pool = require('./config/db'); // 👈 ADD THIS

const ordersRoutes = require('./routes/orders');
const customersRoutes = require('./routes/customers');
const productsRoutes = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ CREATE TABLE (AUTO RUN)
(async () => {
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
    console.log("Orders table ready ✅");
  } catch (err) {
    console.error("Table error ❌", err);
  }
})();

// ✅ Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API running...');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});