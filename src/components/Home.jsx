import React, { useState, useEffect } from 'react';

const Home = ({ product, onOrder }) => {
  // ১. ডাটা না আসা পর্যন্ত সেফটি চেক
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px', color: '#666' }}>
        প্রোডাক্ট লোড হচ্ছে... একটু অপেক্ষা করুন।
      </div>
    );
  }
<div style={styles.productSection} className="product-section-responsive"></div>
  // ২. মিডিয়া লিস্ট সেট করা (WebP সাপোর্ট সহ)
  const mediaList = product?.images?.length > 0 
    ? product.images 
    : ["https://via.placeholder.com/800x600?text=No+Media+Available"];

  const [selectedMedia, setSelectedMedia] = useState(mediaList[0]);
  const [showPopup, setShowPopup] = useState(false);

  // ৩. প্রোডাক্ট আপডেট হলে ডিফল্ট ইমেজ রিসেট করা
  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedMedia(product.images[0]);
    }
  }, [product]);

  // ৪. ভিডিও ফাইল চেক (WebP বাদে অন্য ভিডিও ফরম্যাট চেক)
  const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || (url.includes("res.cloudinary.com") && url.includes("/video/upload/"));
  };

  return (
    <div style={styles.container}>
      <div style={styles.productSection}>
        {/* Left: Media Gallery */}
        <div style={styles.mediaContainer}>
          <div style={styles.mainMedia}>
            {isVideo(selectedMedia) ? (
              <video 
                src={selectedMedia} 
                controls 
                autoPlay 
                muted 
                loop 
                key={selectedMedia} // সোর্স চেঞ্জ হলে ভিডিও রিলোড হওয়ার জন্য
                style={styles.mediaElement} 
              />
            ) : (
              <img src={selectedMedia} alt="Product" style={styles.mediaElement} />
            )}
          </div>
          
          <div style={styles.thumbnailGrid}>
            {mediaList.map((media, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedMedia(media)}
                style={{ 
                  ...styles.thumbWrapper, 
                  border: selectedMedia === media ? '2px solid #16a34a' : '2px solid #eee' 
                }}
              >
                {isVideo(media) ? (
                  <div style={styles.videoThumb}>▶ Video</div>
                ) : (
                  <img src={media} style={styles.thumbImg} alt={`thumb-${i}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div style={styles.detailsContainer}>
          <h1 style={styles.title}>{product.name}</h1>
          <div style={styles.priceTag}>
            <span style={styles.currentPrice}>৳{product.discountPrice || product.price}</span>
            {product.discountPrice && (
              <span style={styles.oldPrice}>৳{product.price}</span>
            )}
          </div>

          <p style={styles.shortDesc}>{product.shortDesc}</p>
          
          <button onClick={() => setShowPopup(true)} style={styles.orderBtn}>
            অর্ডার করতে এখানে ক্লিক করুন
          </button>

          <div style={styles.longDescBox}>
            <h4 style={{ marginBottom: '10px', color: '#333' }}>পণ্যটি সম্পর্কে বিস্তারিত:</h4>
            <p style={{ whiteSpace: 'pre-line', color: '#555', lineHeight: '1.6' }}>
              {product.longDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresGrid}>
        {product?.features?.map((f, i) => (
          <div key={i} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon || "✨"}</div>
            <h4 style={{ margin: '10px 0' }}>{f.title}</h4>
            <p style={styles.featureText}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Order Popup */}
      {showPopup && (
        <OrderPopup 
          product={product} 
          onClose={() => setShowPopup(false)} 
          onOrder={onOrder} 
        />
      )}
    </div>
  );
};

// --- Order Popup Component ---
const OrderPopup = ({ product, onClose, onOrder }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [location, setLocation] = useState('inside');
  
  const deliveryCharge = location === 'inside' ? 60 : 120;
  const totalPrice = (Number(product.discountPrice) || Number(product.price)) + deliveryCharge;

  const handleSubmit = (e) => {
    e.preventDefault(); // ফর্ম রিলোড বন্ধ করা
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert("দয়া করে আপনার নাম, মোবাইল নম্বর এবং ঠিকানা সঠিকভাবে দিন।");
      return;
    }
    
    // মেইন অ্যাপের ফাংশন কল করা (পুরো ডাটা পাঠানো হচ্ছে)
    onOrder({ 
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        location: location, 
        total: totalPrice,
        productName: product.name 
    });
    
    onClose(); // পপআপ বন্ধ করা
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <form onSubmit={handleSubmit} style={styles.modalContent}>
          <div style={styles.formSide}>
            <h3>অর্ডার কনফার্ম করুন</h3>
            <input 
              style={styles.input} 
              placeholder="আপনার নাম লিখুন" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <input 
              style={styles.input} 
              type="tel"
              placeholder="মোবাইল নাম্বার" 
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
            <textarea 
              style={{...styles.input, height: '80px'}} 
              placeholder="আপনার সম্পূর্ণ ঠিকানা দিন" 
              required
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})} 
            />
            
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              <button 
                type="button" 
                onClick={() => setLocation('inside')}
                style={location === 'inside' ? styles.locBtnActive : styles.locBtn}
              >ঢাকা সিটির ভিতরে</button>
              <button 
                type="button" 
                onClick={() => setLocation('outside')}
                style={location === 'outside' ? styles.locBtnActive : styles.locBtn}
              >ঢাকার বাইরে</button>
            </div>
          </div>

          <div style={styles.summarySide}>
            <h3>অর্ডার সামারি</h3>
            <div style={styles.summaryRow}>
              <span>প্রোডাক্ট প্রাইস:</span> <span>৳{product.discountPrice || product.price}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>ডেলিভারি চার্জ:</span> <span>৳{deliveryCharge}</span>
            </div>
            <hr style={{ border: '0.5px solid #eee' }} />
            <div style={{...styles.summaryRow, fontWeight: 'bold', fontSize: '18px', color: '#16a34a'}}>
              <span>সর্বমোট:</span> <span>৳{totalPrice}</span>
            </div>
            <button type="submit" style={styles.confirmBtn}>অর্ডার কনফার্ম করুন</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles অবজেক্টটি আগের মতোই থাকবে...
const styles = {
  container: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '10px', 
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box'
  },
  productSection: { 
    display: 'flex', 
    flexDirection: 'column', // মোবাইলে ওপর-নিচে হবে
    gap: '20px', 
    background: '#fff', 
    padding: '15px', 
    borderRadius: '15px', 
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    // পিসির জন্য গ্রিড লেআউট (নিচে মিডিয়া কুয়েরি স্টাইলে কন্ডিশন দেওয়া হবে)
  },
  mediaContainer: { 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px' 
  },
  mainMedia: { 
    width: '100%', 
    aspectRatio: '1 / 1', // স্কয়ার শেপ থাকবে সব ডিভাইসে
    maxHeight: '450px', 
    borderRadius: '12px', 
    overflow: 'hidden', 
    background: '#f0f0f0' 
  },
  mediaElement: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  thumbnailGrid: { 
    display: 'flex', 
    gap: '8px', 
    overflowX: 'auto', 
    paddingBottom: '5px',
    scrollbarWidth: 'none' // স্ক্রলবার হাইড করা
  },
  thumbWrapper: { 
    width: '60px', 
    height: '60px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    overflow: 'hidden', 
    flexShrink: 0 
  },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  videoThumb: { 
    width: '100%', height: '100%', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', background: '#333', color: '#fff', fontSize: '10px' 
  },
  detailsContainer: { 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    padding: '5px'
  },
  title: { fontSize: '22px', margin: '10px 0', color: '#333', lineHeight: '1.3' },
  priceTag: { marginBottom: '15px' },
  currentPrice: { fontSize: '28px', fontWeight: 'bold', color: '#16a34a' },
  oldPrice: { textDecoration: 'line-through', color: '#999', marginLeft: '10px', fontSize: '18px' },
  shortDesc: { fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '20px' },
  orderBtn: { 
    padding: '15px', 
    fontSize: '18px', 
    fontWeight: 'bold', 
    background: '#ff4d4d', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer',
    width: '100%', // মোবাইলে পুরোটা জুড়ে থাকবে
    boxShadow: '0 4px 10px rgba(255, 77, 77, 0.3)'
  },
  longDescBox: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' },
  featuresGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', // ছোট কার্ড সব ডিভাইসে ফিট হবে
    gap: '15px', 
    marginTop: '30px' 
  },
  featureCard: { 
    background: '#fff', 
    padding: '15px', 
    borderRadius: '12px', 
    textAlign: 'center', 
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)' 
  },
  featureIcon: { fontSize: '30px' },
  featureText: { fontSize: '12px', color: '#777' },

  // --- Popup (Mobile Friendly) ---
  overlay: { 
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
    background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', zIndex: 2000, padding: '10px' 
  },
  modal: { 
    background: '#fff', width: '100%', maxWidth: '500px', 
    borderRadius: '15px', position: 'relative', overflowY: 'auto', 
    maxHeight: '90vh' 
  },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', border: 'none', background: '#eee', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' },
  modalContent: { display: 'flex', flexDirection: 'column' },
  formSide: { padding: '20px' },
  summarySide: { padding: '20px', background: '#f9f9f9', borderTop: '1px solid #eee' },
  input: { width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  locBtn: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', fontSize: '12px' },
  locBtnActive: { flex: 1, padding: '10px', border: '1px solid #16a34a', borderRadius: '8px', background: '#16a34a', color: '#fff', fontSize: '12px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },
  confirmBtn: { width: '100%', padding: '15px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }
};
export default Home;