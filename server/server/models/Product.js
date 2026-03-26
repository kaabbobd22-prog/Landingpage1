const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  discountPrice: Number,
  shortDesc: String,
  longDesc: String,
  images: [String], // URL list
  features: [
    { title: String, desc: String, icon: String }
  ]
});

module.exports = mongoose.model('Product', ProductSchema);