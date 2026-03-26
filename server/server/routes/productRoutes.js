const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload } = require('../utils/cloudinary');

// ১. প্রোডাক্ট ডাটা পাওয়া (Get Product - এটি রিলোড সমস্যার সমাধান করবে)
router.get('/', async (req, res) => {
  try {
    const product = await Product.findOne(); // প্রথম প্রোডাক্টটি নিয়ে আসবে
    if (!product) {
      return res.status(404).json({ message: "কোনো প্রোডাক্ট পাওয়া যায়নি।" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ২. প্রোডাক্ট আপডেট করা (Update/Upsert Product)
router.put('/', upload.array('media', 10), async (req, res) => {
  try {
    const productData = { ...req.body };

    // ফিচারস ডাটা স্ট্রিং থেকে অবজেক্টে রূপান্তর
    if (productData.features) {
      try {
        productData.features = JSON.parse(productData.features);
      } catch (e) {
        console.error("Features parsing error:", e);
      }
    }

    // নতুন ফাইল আপলোড হলে হ্যান্ডেল করা
    if (req.files && req.files.length > 0) {
      const newFileUrls = req.files.map(file => file.path);
      
      // পুরাতন ইমেজগুলো খুঁজে বের করে তার সাথে নতুনগুলো যোগ করা (Merge)
      const existingProduct = await Product.findOne();
      if (existingProduct && existingProduct.images) {
        productData.images = [...existingProduct.images, ...newFileUrls];
      } else {
        productData.images = newFileUrls;
      }
    }

    // ডাটাবেসে আপডেট বা নতুন তৈরি করা (Upsert)
    const updatedProduct = await Product.findOneAndUpdate(
      {}, // ফিল্টার: প্রথম যে ডকুমেন্ট পাবে
      { $set: productData }, // শুধুমাত্র পাঠানো ডাটাগুলোই আপডেট হবে
      { 
        upsert: true, 
        new: true, // এটি 'returnDocument: after' এর মতো কাজ করে
        runValidators: true 
      }
    );

    console.log("✅ Product Updated Successfully");
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;