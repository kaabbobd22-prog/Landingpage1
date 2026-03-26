const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ১. নতুন অর্ডার সেভ করা (Customer Side)
router.post('/', async (req, res) => {
  try {
    const { name, phone, address, location, total } = req.body;

    // ডাটা ভ্যালিডেশন (নিশ্চিত করা যে সব তথ্য এসেছে)
    if (!name || !phone || !address) {
      return res.status(400).json({ message: "নাম, মোবাইল এবং ঠিকানা অবশ্যই দিতে হবে।" });
    }

    const newOrder = new Order({
      name,
      phone,
      address,
      location,
      total,
      status: 'new', // ডিফল্ট স্ট্যাটাস
      date: new Date()
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ error: "অর্ডার সেভ করতে সমস্যা হয়েছে।" });
  }
});

// ২. সব অর্ডার দেখা (Admin Side)
router.get('/', async (req, res) => {
  try {
    // .sort({ createdAt: -1 }) ব্যবহার করা ভালো যদি আপনার স্কিমাতে timestamps থাকে
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ৩. অর্ডার স্ট্যাটাস আপডেট করা (Admin Side)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // নির্দিষ্ট অর্ডারের স্ট্যাটাস আপডেট
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status } }, // শুধু স্ট্যাটাস আপডেট হবে
      { new: true, runValidators: true } // নতুন ডাটা রিটার্ন করবে এবং ভ্যালিডেশন চেক করবে
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "অর্ডারটি পাওয়া যায়নি।" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ৪. অর্ডার ডিলিট করা (অপশনাল - এডমিন যদি কোনো ফেক অর্ডার মুছতে চায়)
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "অর্ডারটি সফলভাবে ডিলিট করা হয়েছে।" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;