import React, { useState, useRef } from 'react';
import axios from 'axios';

const Admin = ({ product, setProduct, orders, setOrders, refreshData }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pass, setPass] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const mediaInputRef = useRef(null);

  // ১. অর্ডার স্ট্যাটাস আপডেট (নতুন Mongoose নিয়ম অনুযায়ী)
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus });
      const updatedOrders = orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Status update failed!");
    }
  };

  // ২. মিডিয়া ফাইল হ্যান্ডলিং
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    if (mediaInputRef.current) mediaInputRef.current.value = "";
  };

  // ৩. প্রোডাক্ট এবং ইমেজ ডাটাবেসে সেভ করা
  const handleSaveProduct = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      // Optional Chaining ব্যবহার করা হয়েছে যেন product null থাকলেও এরর না দেয়
      formData.append('name', product?.name || '');
      formData.append('price', product?.price || 0);
      formData.append('discountPrice', product?.discountPrice || 0);
      formData.append('shortDesc', product?.shortDesc || '');
      formData.append('longDesc', product?.longDesc || '');
      formData.append('features', JSON.stringify(product?.features || []));

      if (mediaFiles.length > 0) {
        mediaFiles.forEach(file => {
          formData.append('media', file);
        });
      }

      const res = await axios.put('http://localhost:5000/api/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 200) {
        alert("Product & Media Updated Successfully!");
        setProduct(res.data);
        setMediaFiles([]);
        // সেভ হওয়ার পর মেইন অ্যাপের ডাটা রিফ্রেশ করা
        if (refreshData) await refreshData();
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to update product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h3 style={{ color: '#16a34a' }}>Admin Login</h3>
          <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} style={styles.input} />
          <button onClick={() => pass === 'gadget123' ? setIsLoggedIn(true) : alert('Wrong!')} style={styles.btnPrimary}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        
        {/* Left: Product Content */}
        <div style={styles.card}>
          <h3 style={styles.header}>Product Content</h3>
          
          <label style={styles.label}>Upload Videos/Images</label>
          <input type="file" multiple ref={mediaInputRef} onChange={handleMediaChange} style={styles.input} />
          
          {mediaFiles.length > 0 && (
            <div style={styles.gallery}>
              {mediaFiles.map((file, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={styles.thumbBox}>
                    {file.type.startsWith('video/') ? <div style={styles.videoIcon}>▶ Video</div> : 
                    <img src={URL.createObjectURL(file)} style={styles.thumbImg} alt="p" />}
                  </div>
                  <button onClick={() => removeMedia(i)} style={styles.removeBtn}>✕</button>
                </div>
              ))}
            </div>
          )}

          <input style={styles.input} placeholder="Product Name" value={product?.name || ''} onChange={e => setProduct({...product, name: e.target.value})} />
          <textarea style={{...styles.input, height: '80px'}} placeholder="Full Description" value={product?.longDesc || ''} onChange={e => setProduct({...product, longDesc: e.target.value})} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={styles.input} type="number" placeholder="Price" value={product?.price || 0} onChange={e => setProduct({...product, price: e.target.value})} />
            <input style={styles.input} type="number" placeholder="Discount" value={product?.discountPrice || 0} onChange={e => setProduct({...product, discountPrice: e.target.value})} />
          </div>
          
          <button onClick={handleSaveProduct} disabled={loading} style={{...styles.btnPrimary, background: loading ? '#ccc' : '#16a34a'}}>
            {loading ? "Uploading..." : "Save Product Details"}
          </button>
        </div>

        {/* Right: Features */}
        <div style={styles.card}>
          <h3 style={styles.header}>Feature Management</h3>
          {product?.features?.map((f, i) => (
            <div key={i} style={styles.featureItem}>
              <input style={styles.input} value={f.title} onChange={e => {
                const updated = [...product.features]; updated[i].title = e.target.value; setProduct({...product, features: updated});
              }} />
              <input style={styles.input} value={f.desc} onChange={e => {
                const updated = [...product.features]; updated[i].desc = e.target.value; setProduct({...product, features: updated});
              }} />
            </div>
          ))}
          <button onClick={handleSaveProduct} style={{...styles.btnPrimary, background: '#444'}}>Update Features</button>
        </div>
      </div>

      {/* Bottom: Orders */}
      <div style={{...styles.card, marginTop: '30px'}}>
        <h3 style={styles.header}>Orders ({orders.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{textAlign: 'left', padding: '10px'}}>Customer</th>
              <th style={{textAlign: 'left', padding: '10px'}}>Address</th>
              <th style={{textAlign: 'left', padding: '10px'}}>Total</th>
              <th style={{textAlign: 'left', padding: '10px'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={styles.td}><strong>{o.name}</strong><br/>{o.phone}</td>
                <td style={styles.td}>{o.address}</td>
                <td style={styles.td}>৳{o.total}</td>
                <td style={styles.td}>
                  <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} style={{...styles.select, background: getStatusColor(o.status)}}>
                    <option value="new">New</option>
                    <option value="seen">Seen</option>
                    <option value="in courier">In Courier</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusColor = (s) => {
  if(s === 'new') return '#16a34a';
  if(s === 'seen') return '#f8c102';
  if(s === 'in courier') return '#0288d1';
  return '#eee';
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' },
  card: { background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
  btnPrimary: { width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  gallery: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' },
  thumbBox: { width: '60px', height: '60px', borderRadius: '5px', overflow: 'hidden', border: '1px solid #ddd' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  videoIcon: { fontSize: '10px', textAlign: 'center', marginTop: '20px' },
  removeBtn: { position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '18px', height: '18px', fontSize: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  td: { padding: '10px', fontSize: '14px' },
  select: { padding: '5px', borderRadius: '5px', color: '#fff', fontWeight: 'bold', border: 'none' },
  loginContainer: { display: 'flex', justifyContent: 'center', padding: '100px' },
  loginBox: { background: '#fff', padding: '40px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  featureItem: { marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }
};

export default Admin;