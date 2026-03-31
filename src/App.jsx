import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, X, MapPin, Phone, User, Mail, Loader2 } from 'lucide-react';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({ name: '', number: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);

  // --- Meta Pixel Initialization (New ID: 750067381233776) ---
  useEffect(() => {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
      'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', '750067381233776'); // আপনার নতুন পিক্সেল আইডি
    window.fbq('track', 'PageView');
  }, []);

  // --- Image Array ---
  const slideImages = ["Slide-1.png", "Slide-2.png", "Slide-3.png"];

  // --- Updated Order Handling Logic ---
  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        name: formData.name,
        number: formData.number,
        email: formData.email,
        address: formData.address,
        product: "Deshi Chikhen 250gm"
      };

      const response = await axios.post('https://landingpage1-qknz.onrender.com/api/orders', orderData);

      if (response.data.success) {
        // --- Meta Pixel Purchase Event ---
        if (window.fbq) {
          window.fbq('track', 'Purchase', {
            value: 250.00,
            currency: 'BDT',
            content_name: 'Deshi Chikhen 250gm',
            content_type: 'product'
          });
        }

        alert(response.data.message || "ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।");
        setIsModalOpen(false);
        setFormData({ name: '', number: '', email: '', address: '' });
      }
    } catch (error) {
      console.error("Order Error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "অর্ডার পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* --- Navbar --- */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black italic tracking-tighter text-black">
            Fresh<span className="text-orange-600 font-normal">Click</span>
          </div>
          <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-gray-800 transition">
            MY CART <ShoppingCart size={16} />
          </button>
        </div>
      </header>

      {/* --- Product Section --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">

          {/* Left: Photos */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              {/* Main Image */}
              <img src="Main.png" alt="Main Product" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-4">
              {/* Slide Images */}
              {slideImages.map((imgName, i) => (
                <div key={i} className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-500 transition">
                  <img src={imgName} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 text-balance">Deshi Chikhen 250gm</h1>
            <div className="flex items-center mt-4 gap-2 text-orange-500">
              <div className="flex"><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /></div>
              <span className="text-gray-400 text-sm font-medium">(4.8 from 350 Reviews)</span>
            </div>
            <div className="mt-8">
              <span className="text-4xl font-black text-gray-900">৳250.00</span>
              <span className="ml-4 text-xl text-gray-400 line-through font-medium">৳299.00</span>
            </div>
            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              একদম ফ্রেশ এবং দেশি মুরগির মাংস। স্বাস্থ্যসম্মত ভাবে প্রসেস করা এবং রান্নার জন্য প্রস্তুত।
            </p>
            <div className="mt-10">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-orange-600 text-white px-16 py-5 rounded-full font-black text-sm tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95 uppercase">
                BUY IT NOW
              </button>
            </div>
          </div>
        </div>

        {/* --- Product Details Tabs --- */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex border-b gap-10 mb-8 overflow-x-auto no-scrollbar">
            {['details', 'reviews', 'discussion'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-bold capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'border-b-4 border-orange-600 text-black' : 'text-gray-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'details' && (
              <div className="max-w-3xl">
                <h3 className="text-2xl font-bold mb-4">Product Overview</h3>
                <p className="text-gray-600 leading-7 text-lg">
                  আমাদের এই দেশি মুরগি সরাসরি খামার থেকে সংগৃহীত। এতে কোনো প্রকার ক্ষতিকর অ্যান্টিবায়োটিক বা কেমিক্যাল ব্যবহার করা হয়নি।
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center gap-3 text-gray-700 font-medium">✅ 100% Organic & Fresh</li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">✅ Properly Cleaned and Cut</li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">✅ Vacuum Sealed Packaging</li>
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && <p className="text-gray-500 italic text-center py-10">No reviews yet.</p>}
            {activeTab === 'discussion' && <p className="text-gray-500 italic text-center py-10">Ask a question about this product.</p>}
          </div>
        </div>
      </main>

      {/* --- Order Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-8 text-gray-400 hover:text-black transition">
              <X size={30} />
            </button>

            <h2 className="text-3xl font-black mb-1">Confirm Order</h2>
            <p className="text-gray-500 mb-8 font-medium">নিচের তথ্যগুলো সঠিক ভাবে পূরণ করুন।</p>

            <form onSubmit={handleOrder} className="space-y-5">
              <div className="relative group">
                <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-500 transition" size={20} />
                <input
                  type="text" required placeholder="Full Name"
                  value={formData.name}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-orange-500 transition-all outline-none"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-500 transition" size={20} />
                <input
                  type="tel" required placeholder="Phone Number"
                  value={formData.number}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-orange-500 transition-all outline-none"
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-500 transition" size={20} />
                <input
                  type="email" required placeholder="Email Address"
                  value={formData.email}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-orange-500 transition-all outline-none"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-orange-500 transition" size={20} />
                <textarea
                  required placeholder="House no, road no, area, city." rows="3"
                  value={formData.address}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-orange-500 transition-all outline-none resize-none"
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 uppercase tracking-widest flex justify-center items-center gap-2">
                {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : "Confirm Order Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;