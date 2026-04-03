import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, X, MapPin, Phone, User, CheckCircle, Loader2, ShieldCheck, Flame, Award, Package, Mail } from 'lucide-react';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  
  // Gallery Logic: 1 Main + 5 Gallery Images
  const allImages = ["Main.png", "Slide-1.png", "Slide-2.png", "Slide-3.png", "Slide-4.png", "Slide-5.png"];
  const [mainImage, setMainImage] = useState(allImages[0]);

  // Form State with Color Selection AND Email Field
  const [formData, setFormData] = useState({ 
    name: '', 
    number: '', 
    email: '', 
    address: '', 
    selectedColor: 'Mint Green' 
  });

  // Available Colors
  const colors = [
    { name: 'Mint Green', class: 'bg-[#A8E6CF]' },
    { name: 'Pastel Pink', class: 'bg-[#FFD1DC]' },
    { name: 'Classic Grey', class: 'bg-[#D3D3D3]' },
    { name: 'Off White', class: 'bg-[#F5F5F5]' }
  ];

  // Meta Pixel Initialization
  useEffect(() => {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    
    window.fbq('init', '750067381233776'); 
    window.fbq('track', 'PageView');
  }, []);

  // Handle Order Submission
  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        ...formData,
        product: "Premium Silicone Kitchen Utensil Set (12 Pcs)",
        price: 899
      };

      const response = await axios.post('https://landingpage1-qknz.onrender.com/api/orders', orderData);

      if (response.data.success) {
        // Meta Pixel Purchase Tracking
        if (window.fbq) {
          window.fbq('track', 'Purchase', {
            value: 899.00,
            currency: 'BDT',
            content_name: `Silicone Set - ${formData.selectedColor}`,
            content_type: 'product'
          });
        }
        alert(`Order Successful! A confirmation email has been sent to ${formData.email}. We will call you soon.`);
        setIsModalOpen(false);
        setFormData({ name: '', number: '', email: '', address: '', selectedColor: 'Mint Green' });
      }
    } catch (error) {
      alert("Order failed. Please check your network and try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      
      {/* --- Header --- */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black italic text-green-700 uppercase tracking-tighter">KITCHENPRO</div>
          <button className="bg-green-600 text-white px-6 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition shadow-lg hover:bg-green-700">
            MY CART <ShoppingCart size={16} />
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Product Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
          
          {/* Gallery Switcher */}
          <div className="space-y-6">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-inner">
              <img src={mainImage} alt="Selected" className="w-full h-full object-cover transition-all duration-500" />
            </div>
            <div className="grid grid-cols-6 gap-3">
              {allImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? 'border-green-500 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details & Pricing */}
          <div className="flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-4">
               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Limited Offer</span>
               <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1"><Award size={14}/> Top Quality</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Premium Silicone Kitchen Utensil Set</h1>
            
            <div className="mt-8 flex items-baseline gap-4">
              <span className="text-6xl font-black text-green-700">৳899</span>
              <span className="text-2xl text-gray-400 line-through font-medium">৳1,399</span>
            </div>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              Elevate your cooking experience with our 12-piece BPA-free silicone set. Heat resistant up to 230°C with elegant natural wooden handles. Scratch-free cooking guaranteed.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-10 w-full bg-green-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-green-700 transition shadow-2xl active:scale-95 uppercase tracking-widest">
              Order Now - ৳899
            </button>
          </div>
        </div>

        {/* Info Tabs Section */}
        <div className="mt-12 bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex border-b gap-10 mb-8 overflow-x-auto no-scrollbar">
            {['details', 'specifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xl font-bold capitalize transition-all ${activeTab === tab ? 'border-b-4 border-green-600 text-black' : 'text-gray-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in duration-500">
            {activeTab === 'details' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Why choose our set?</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-gray-700 font-medium italic"><CheckCircle className="text-green-500 shrink-0" /> 100% Food Grade Silicone</li>
                    <li className="flex gap-3 text-gray-700 font-medium italic"><CheckCircle className="text-green-500 shrink-0" /> Non-Stick Friendly (No Scratches)</li>
                    <li className="flex gap-3 text-gray-700 font-medium italic"><CheckCircle className="text-green-500 shrink-0" /> Ergonomic Wooden Grip</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
                   <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2"><Flame size={20}/> HEAT PROOF</h4>
                   <p className="text-green-700 text-sm">Safe for high-heat cooking up to 230°C. Durable and long-lasting material that won't melt.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                 <div className="p-4 bg-gray-50 rounded-2xl border">
                    <p className="text-gray-400 text-xs font-bold uppercase">Pieces</p>
                    <p className="font-bold">12 Pcs Set</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl border">
                    <p className="text-gray-400 text-xs font-bold uppercase">Material</p>
                    <p className="font-bold">Silicone/Wood</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl border">
                    <p className="text-gray-400 text-xs font-bold uppercase">Warranty</p>
                    <p className="font-bold">7 Days Replacement</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl border">
                    <p className="text-gray-400 text-xs font-bold uppercase">Delivery</p>
                    <p className="font-bold">Free Nationwide</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- Order Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-8 text-gray-400 hover:text-black transition">
              <X size={30} />
            </button>

            <h2 className="text-3xl font-black mb-1 text-gray-900">Confirm Order</h2>
            <p className="text-gray-500 mb-8 font-medium italic">Your kitchen upgrade is just a step away!</p>

            <form onSubmit={handleOrder} className="space-y-5">
              
              {/* Color Plate Selection */}
              <div>
                <label className="text-xs font-black text-gray-400 mb-3 block uppercase tracking-widest">Select Your Color: <span className="text-green-600">{formData.selectedColor}</span></label>
                <div className="flex gap-4">
                  {colors.map((color) => (
                    <div 
                      key={color.name}
                      onClick={() => setFormData({...formData, selectedColor: color.name})}
                      className={`w-12 h-12 rounded-full cursor-pointer border-4 transition-all ${color.class} ${formData.selectedColor === color.name ? 'border-green-600 scale-110 shadow-lg' : 'border-white shadow-sm hover:scale-105'}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="relative group">
                <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-green-600 transition" size={20} />
                <input
                  type="text" required placeholder="Full Name" value={formData.name}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-green-500 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-green-600 transition" size={20} />
                <input
                  type="tel" required placeholder="Mobile Number" value={formData.number}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-green-500 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>

              {/* Added Email Input Field back for Confirmation Mail */}
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-green-600 transition" size={20} />
                <input
                  type="email" required placeholder="Email Address (For Invoice)" value={formData.email}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-green-500 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-green-600 transition" size={20} />
                <textarea
                  required placeholder="Shipping Address (House, Road, Area, City)" rows="2" value={formData.address}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-green-500 outline-none resize-none transition-all"
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>

              {/* Order Summary */}
              <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                 <p className="flex justify-between font-black text-green-800 text-xl">
                    <span>Grand Total:</span>
                    <span>৳899.00</span>
                 </p>
                 <p className="text-xs text-green-600 mt-1 font-bold italic tracking-wide uppercase flex items-center gap-1"><Package size={14}/> Free Delivery Enabled</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 flex justify-center items-center gap-2 shadow-xl shadow-green-100 transition-all">
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