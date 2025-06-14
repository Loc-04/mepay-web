import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [account_name, setAccountName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_name, email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      setTimeout(() => navigate('/login'), 1000); // Redirect after register
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #95E0E1 0%, #FFEAC2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: 40, width: 350, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📝</div>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Sign up with email</h2>
        <p style={{ color: '#888', marginBottom: 24 }}>Create your account to get started.</p>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Account Name" value={account_name} onChange={e => setAccountName(e.target.value)} required style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
          <button type="submit" style={{ width: '100%', background: '#FFEAC2', color: '#222', fontWeight: 700, border: 'none', borderRadius: 8, padding: 14, fontSize: 18, marginBottom: 12, cursor: 'pointer', transition: 'background 0.2s' }}>Sign Up</button>
        </form>
        <div style={{ color: '#e67e22', minHeight: 24, marginBottom: 8 }}>{message}</div>
        <div style={{ marginTop: 16 }}>
          <span style={{ color: '#888' }}>Already have an account?</span>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#FFEAC2', fontWeight: 700, marginLeft: 8, cursor: 'pointer', fontSize: 16 }}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
