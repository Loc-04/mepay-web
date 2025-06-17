import React, { useEffect, useState } from 'react';
import axios from 'axios';

const lightPalette = {
  blue: '#3B4CB8',
  lightBlue: '#95E0E1',
  yellow: '#FFEAC2',
  white: '#fff',
  gray: '#F5F6FA',
  dark: '#222',
  accent: '#4F8CFF',
  bg: '#F5F8FE',
  text: '#222',
  faded: '#bbb',
};
const darkPalette = {
  blue: '#4F8CFF',
  lightBlue: '#222E50',
  yellow: '#FFEAC2',
  white: '#23283A',
  gray: '#2B3146',
  dark: '#fff',
  accent: '#4F8CFF',
  bg: '#23283A',
  text: '#fff',
  faded: '#5A6170',
};

const LoginActivity = ({ token }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  const palette = mode === 'dark' ? darkPalette : lightPalette;

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activities/all-login-activities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data)
        setActivities(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const toggleButton = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
      <span style={{ fontWeight: 700, fontSize: 24, color: mode === 'light' ? palette.text : palette.faded, transition: 'color 0.6s' }}>Light</span>
      <button
        aria-label="Toggle dark mode"
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        style={{
          width: 80,
          height: 40,
          borderRadius: 24,
          border: 'none',
          background: mode === 'dark'
            ? 'linear-gradient(90deg, #23283A 60%, #23283A 100%)'
            : 'linear-gradient(90deg, #95E0E1 60%, #4F8CFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: mode === 'dark' ? 'flex-end' : 'flex-start',
          padding: '0 8px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.6s',
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: mode === 'dark' ? '0 0 8px #fff8' : '0 0 8px #95E0E1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'background 0.6s, box-shadow 0.6s',
        }}>
          {mode === 'dark' ? (
            <svg width="24" height="24" fill="#23283A" viewBox="0 0 24 24"><path d="M21.75 15.5A9.75 9.75 0 0 1 8.5 2.25a.75.75 0 0 0-.75.75v.5A9.25 9.25 0 1 0 20.5 16.25h.5a.75.75 0 0 0 .75-.75Z" /></svg>
          ) : (
            <svg width="24" height="24" fill="#FFD700" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
          )}
        </div>
      </button>
      <span style={{ fontWeight: 700, fontSize: 24, color: mode === 'dark' ? palette.text : palette.faded, transition: 'color 0.6s' }}>Dark</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: palette.bg, color: palette.text, transition: 'background 0.6s, color 0.6s', padding: 32 }}>
      {toggleButton}
      <div style={{ maxWidth: 700, margin: '0 auto', background: palette.white, borderRadius: 16, boxShadow: mode === 'dark' ? '0 2px 12px rgba(79,140,255,0.08)' : '0 2px 12px rgba(59,76,184,0.06)', padding: 32 }}>
        <h2 style={{ marginBottom: 24, color: palette.blue }}>Login Activity</h2>
        {loading ? (
          <div>Loading...</div>
        ) : activities.length === 0 ? (
          <div>No login activity found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ background: palette.gray }}>
                <th style={{ padding: 12, textAlign: 'left' }}>Session</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td style={{ padding: 12 }}>{activity.session_id}</td>
                  <td style={{ padding: 12 }}>{formatDate(activity.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LoginActivity; 