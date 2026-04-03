const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const https = require('https'); // সার্ভারকে সজাগ রাখার জন্য
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// Order Schema with Color & Email Sync
const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true }, // App.jsx থেকে আসা ইমেইলের জন্য
    address: { type: String, required: true },
    product: { type: String, required: true },
    selectedColor: { type: String, required: true },
    price: { type: Number, default: 899 },
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
    tls: { rejectUnauthorized: false }
});

// Ping Route (সার্ভার সজাগ রাখার জন্য)
app.get('/ping', (req, res) => {
    res.status(200).send("Server is awake!");
});

// Order API (POST)
app.post('/api/orders', async (req, res) => {
    try {
        // App.jsx থেকে পাঠানো ডাটা রিসিভ করা হচ্ছে
        const { name, number, email, address, product, selectedColor } = req.body;

        // Validation
        if (!name || !number || !email || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Save Order to DB
        const order = new Order({ 
            name, 
            number, 
            email, 
            address, 
            product, 
            selectedColor, 
            price: 899 
        });
        await order.save();
        console.log(`💾 New order saved: ${selectedColor} for ${email}`);

        res.status(201).json({ success: true, message: "Order Successful" });

        // Professional Email Template (Sending to Customer)
        const mailOptions = {
            from: `"KitchenPro BD" <${process.env.EMAIL_USER}>`,
            to: email, // কাস্টমারের ইমেইলে যাবে
            subject: `Order Confirmed: ${selectedColor} Utensil Set (৳899)`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                    <div style="background-color: #166534; padding: 25px; text-align: center; color: white;">
                        <h2 style="margin: 0; font-size: 20px;">Order Confirmed!</h2>
                    </div>
                    <div style="padding: 25px; color: #333;">
                        <p style="font-size: 16px;">Hi <strong>${name}</strong>, thank you for your order!</p>
                        
                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px dashed #166534; margin: 20px 0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 5px 0; color: #64748b;">Selected Color:</td><td style="text-align: right; font-weight: bold; color: #166534;">${selectedColor}</td></tr>
                                <tr><td style="padding: 5px 0; color: #64748b;">Amount:</td><td style="text-align: right; font-weight: bold;">৳899</td></tr>
                                <tr><td style="padding: 5px 0; color: #64748b;">Delivery:</td><td style="text-align: right; font-weight: bold; color: #16a34a;">FREE</td></tr>
                            </table>
                        </div>

                        <p style="font-size: 14px;"><strong>Shipping Details:</strong></p>
                        <p style="font-size: 13px; color: #475569; margin: 0;">Phone: ${number}</p>
                        <p style="font-size: 13px; color: #475569; margin: 5px 0;">Address: ${address}</p>
                        
                        <p style="font-size: 14px; margin-top: 15px; color: #166534; font-weight: bold;">We will call you shortly for verification.</p>
                    </div>
                    <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
                        KitchenPro BD | Keep your kitchen aesthetic!
                    </div>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) console.error("⚠️ Email error:", err.message);
            else console.log("📧 Order confirmation sent to customer!");
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // ==========================================
    // Render Keep-Alive Logic (Auto Ping)
    // ==========================================
    const RENDER_URL = "https://landingpage1-qknz.onrender.com"; // আপনার রেন্ডার ইউআরএল
    
    // প্রতি ১০ মিনিট (৬০০,০০০ মিলিসেকেন্ড) পর পর সার্ভার নিজেকে হিট করবে
    setInterval(() => {
        https.get(`${RENDER_URL}/ping`, (resp) => {
            if (resp.statusCode === 200) {
                console.log(`[Keep-Alive] Ping successful! Server is awake. (${new Date().toLocaleTimeString()})`);
            }
        }).on("error", (err) => {
            console.error("[Keep-Alive] Error:", err.message);
        });
    }, 10 * 60 * 1000); 
});