const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  total: Number,
  status: { type: String, default: 'new' }, // auto 'new' tag
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);