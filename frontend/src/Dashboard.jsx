import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, pkgRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/packages')
      ]);
      setUser(userRes.data.data);
      setPackages(pkgRes.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const handlePurchase = async (pkgId) => {
    try {
      await api.post('/transactions/purchase', { packageId: pkgId });
      alert('Mua gói thành công!');
      fetchData(); // Cập nhật lại số dư
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">SaaS Platform</div>
        <div>
          <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>
            💎 Credits: {user.current_credits}
          </span>
          <button onClick={handleLogout} style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h3>Tính năng đang sở hữu</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {user.unlocked_features?.length > 0 ? (
              user.unlocked_features.map(f => (
                <span key={f} style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem' }}>
                  ✓ {f}
                </span>
              ))
            ) : (
              <span style={{ color: '#94a3b8' }}>Chưa có tính năng nào. Hãy mua một gói bên dưới.</span>
            )}
          </div>
        </div>

        <h2>Các gói nâng cấp</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
          {packages.map(pkg => (
            <div key={pkg.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{pkg.name}</h3>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{pkg.description}</p>
              
              <div style={{ marginTop: 'auto' }}>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {Number(pkg.price).toLocaleString()}đ
                </p>
                <p style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                  +{pkg.credits} Credits
                </p>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => handlePurchase(pkg.id)}>
                  Mua Ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
