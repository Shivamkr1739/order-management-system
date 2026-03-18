const express = require('express');
const cors = require('cors');

const ordersRoutes = require('./routes/orders');
const customersRoutes = require('./routes/customers');
const productsRoutes = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);

app.get('/', (req, res) => {
  res.send('API running...');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});