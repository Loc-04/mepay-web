import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import LoginActivity from './pages/LoginActivity';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={
          <Login onLoginSuccess={(userData, jwtToken) => {
            setUser(userData);
            setToken(jwtToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', jwtToken);
          }} />
        } />
        <Route path="/home" element={user && token ? <Home user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/login-activity" element={user && token ? <LoginActivity token={token} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
