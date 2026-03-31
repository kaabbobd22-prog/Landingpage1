const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// Order Schema
const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    product: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request received at ${req.url}`);
    next();
});

// Root Route
app.get('/', (req, res) => res.send("GadgetHub Backend Running"));

// ১. সব অর্ডার দেখার জন্য API (Admin/Compass এর বিকল্প)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "অর্ডার আনতে সমস্যা হয়েছে।" });
    }
});

// ২. Order API (POST) - নতুন অর্ডার তৈরি
app.post('/api/orders', async (req, res) => {
    try {
        const { name, number, email, address, product } = req.body;

        if (!name || !number || !email || !address || !product) {
            return res.status(400).json({ success: false, message: "সবগুলো তথ্য প্রদান করুন!" });
        }

        // ডাটাবেসে সেভ করা
        const order = new Order({ name, number, email, address, product });
        await order.save();
        console.log("💾 Order saved to DB");

        // ফ্রন্টএন্ডকে সাথে সাথে রেসপন্স দেওয়া
        res.status(201).json({
            success: true,
            message: `ধন্যবাদ ${name}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।`
        });

        // ব্যাকগ্রাউন্ডে ইমেইল পাঠানোর লজিক (Updated Price & Template)
        const productPrice = 250; // আপনার অফার প্রাইস অনুযায়ী
        const deliveryCharge = 60; // ডেলিভারি চার্জ (আপনি চাইলে পরিবর্তন করতে পারেন)
        const totalPrice = productPrice + deliveryCharge;

        const mailOptions = {
            from: `"FreshClick" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Order Confirmation - Gadget Hub',
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #ea580c; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 22px;">অর্ডার কনফার্ম হয়েছে!</h1>
                    </div>
                    <div style="padding: 25px; color: #333;">
                        <p style="font-size: 16px;">প্রিয় <strong>${name}</strong>,</p>
                        <p style="color: #666;">আপনার অর্ডারটি আমরা পেয়েছি। খুব শীঘ্রই আমাদের প্রতিনিধি কল দিয়ে অর্ডারটি কনফার্ম করবেন।</p>
                        
                        <div style="background: #fef2f2; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #ea580c;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 5px 0;">পণ্য:</td><td style="text-align: right; font-weight: bold;">${product}</td></tr>
                                <tr><td style="padding: 5px 0;">মূল্য:</td><td style="text-align: right; font-weight: bold;">${productPrice} TK</td></tr>
                                <tr><td style="padding: 5px 0;">ডেলিভারি:</td><td style="text-align: right; font-weight: bold;">${deliveryCharge} TK</td></tr>
                                <tr style="border-top: 1px solid #ddd;"><td style="padding: 10px 0 0; font-weight: bold; color: #ea580c;">মোট:</td><td style="padding: 10px 0 0; text-align: right; font-weight: bold; color: #ea580c;">${totalPrice} TK</td></tr>
                            </table>
                        </div>

                        <p style="font-size: 13px; color: #888;">ঠিকানা: ${address}</p>
                    </div>
                    <div style="background: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #eee;">
                        <p style="margin: 0; font-size: 12px; color: #999;">Gadget Hub Team | All Rights Reserved</p>
                    </div>
                </div>
            `
        };

        // ব্যাকগ্রাউন্ড ইমেইল সেন্ডিং
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.error("⚠️ Email Error:", err.message);
            else console.log("📧 Email sent successfully");
        });

    } catch (error) {
        console.error("❌ Server Error:", error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "সার্ভারে সমস্যা হয়েছে।" });
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));