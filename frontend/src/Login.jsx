import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('intern@gmail.com');
  const [password, setPassword] = useState('my_strong_password');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, { email, password });
      
      if (data.success) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          setIsLogin(true); // Đăng ký xong chuyển sang tab login
          alert('Đăng ký thành công, vui lòng đăng nhập!');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="glass-panel" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Đăng Nhập SAAS' : 'Đăng Ký Tài Khoản'}
        </h2>
        
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer', color: 'var(--accent)' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
        </p>
      </div>
    </div>
  );
}
