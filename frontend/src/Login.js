import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.message || 'Lỗi đăng nhập');
        return;
      }
      const data = await res.json();
      setMessage(data.message);
      localStorage.setItem('token', data.token); // Save JWT token
      if (onLoginSuccess) onLoginSuccess(data.user, data.token);
      setTimeout(() => navigate('/home'), 500); // Redirect after login
    } catch (err) {
      setMessage('Lỗi kết nối server');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #95E0E1 0%, #FFEAC2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: 40, width: 350, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Sign in with email</h2>
        <p style={{ color: '#888', marginBottom: 24 }}>Welcome back! Please login to your account.</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
          <button type="submit" style={{ width: '100%', background: '#95E0E1', color: '#222', fontWeight: 700, border: 'none', borderRadius: 8, padding: 14, fontSize: 18, marginBottom: 12, cursor: 'pointer', transition: 'background 0.2s' }}>Get Started</button>
        </form>
        <div style={{ color: '#e74c3c', minHeight: 24, marginBottom: 8 }}>{message}</div>
        <div style={{ marginTop: 16 }}>
          <span style={{ color: '#888' }}>Don't have an account?</span>
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#95E0E1', fontWeight: 700, marginLeft: 8, cursor: 'pointer', fontSize: 16 }}>Let's sign up</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
