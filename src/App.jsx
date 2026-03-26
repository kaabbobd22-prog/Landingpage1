import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './components/Home';
import Admin from './components/Admin';

const API_BASE_URL = "http://localhost:5000/api";

function App() {
  const [product, setProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(true);

  // ১. ডাটাবেস থেকে প্রোডাক্ট এবং অর্ডার লোড করা
  const refreshData = async () => {
    try {
      // setLoading(true); // রিলোড দিলে যেন ডাটা আসা পর্যন্ত অপেক্ষা করে
      const prodRes = await axios.get(`${API_BASE_URL}/product`);
      if (prodRes.data) {
        setProduct(prodRes.data);
      }

      const orderRes = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(orderRes.data || []);
    } catch (err) {
      console.error("Backend Connection Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // ২. নতুন অর্ডার সেভ করার ফাংশন (যা Home.jsx থেকে কল হবে)
  const handleNewOrder = async (orderData) => {
    try {
      // ব্যাকেন্ডে অর্ডার পাঠানো
      const res = await axios.post(`${API_BASE_URL}/orders`, orderData);
      
      if (res.status === 201 || res.status === 200) {
        alert("আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!");
        // অর্ডার সেভ হওয়ার পর ডাটা রিফ্রেশ করা যাতে এডমিন প্যানেলে দেখা যায়
        await refreshData(); 
      }
    } catch (err) {
      console.error("Order Post Error:", err);
      alert("অর্ডার দিতে সমস্যা হয়েছে। সার্ভার চেক করুন।");
    }
  };

  if (loading) return (
    <div style={{textAlign: 'center', marginTop: '100px', fontSize: '20px'}}>
      GadgetHub লোড হচ্ছে...
    </div>
  );

  return (
    <div style={{ background: '#f4f7f6', minHeight: '100vh' }}>
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => setView('home')}>GadgetHub</div>
        <div>
          <button 
            onClick={() => setView('home')} 
            style={{...styles.navBtn, color: view === 'home' ? '#16a34a' : '#555'}}
          >Shop</button>
          <button 
            onClick={() => setView('admin')} 
            style={{...styles.navBtn, color: view === 'admin' ? '#16a34a' : '#555'}}
          >Admin Panel</button>
        </div>
      </nav>

      {/* কন্টেন্ট রেন্ডারিং */}
      <main style={{ padding: '20px' }}>
        {view === 'home' ? (
          // এখানে refreshData এর বদলে handleNewOrder পাঠানো হয়েছে
          <Home product={product} onOrder={handleNewOrder} />
        ) : (
          <Admin 
            product={product} 
            setProduct={setProduct} 
            orders={orders} 
            setOrders={setOrders} 
            refreshData={refreshData} 
          />
        )}
      </main>
    </div>
  );
}

const styles = {
  nav: { 
    background: '#fff', 
    padding: '15px 50px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  logo: { fontWeight: 'bold', fontSize: '24px', color: '#16a34a', cursor: 'pointer' },
  navBtn: { 
    background: 'none', 
    border: 'none', 
    marginLeft: '25px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '16px',
    transition: '0.3s'
  }
};

export default App;