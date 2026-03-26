const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (MongoDB Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.log("❌ DB Error:", err));

// Test Route
app.get('/', (req, res) => {
  res.send("GadgetHub Server is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server starting on port ${PORT}`);
});

// Routes
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/product', require('./routes/productRoutes'));