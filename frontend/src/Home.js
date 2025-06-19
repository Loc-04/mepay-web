import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

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

function Home({ user, token, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: '', type: 'income', category: '', date: '', description: '' });
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const navigate = useNavigate();

  const palette = mode === 'dark' ? darkPalette : lightPalette;

  // Persist mode in localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Fetch transactions on mount
  useEffect(() => {
    fetch(`http://localhost:3001/api/transactions/${user.id}`)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(() => setMessage('Lỗi tải giao dịch.'));
  }, [user.id]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add transaction
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user_id: user.id })
    });
    const data = await res.json();
    if (res.ok) {
      setTransactions([data.transaction, ...transactions]);
      setForm({ amount: '', type: 'income', category: '', date: '', description: '' });
      setMessage('Thêm giao dịch thành công!');
    } else {
      setMessage(data.message || 'Lỗi thêm giao dịch.');
    }
  };

  // Pie chart data
  const typeCounts = transactions.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + parseFloat(t.amount);
    return acc;
  }, {});
  const pieData = {
    labels: Object.keys(typeCounts),
    datasets: [{
      data: Object.values(typeCounts),
      backgroundColor: [palette.lightBlue, palette.yellow],
    }]
  };

  // Bar chart data (statistics by day)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const statsByDay = days.map(day => {
    const dayTrans = transactions.filter(t => {
      const d = new Date(t.date);
      return d && d.getDay() === (days.indexOf(day) + 1) % 7;
    });
    return {
      income: dayTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0),
      expense: dayTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0),
    };
  });
  const barData = {
    labels: days,
    datasets: [
      {
        label: 'Income',
        backgroundColor: palette.blue,
        data: statsByDay.map(d => d.income),
        borderRadius: 6,
      },
      {
        label: 'Expense',
        backgroundColor: palette.yellow,
        data: statsByDay.map(d => d.expense),
        borderRadius: 6,
      },
    ],
  };

  // Table totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const total = totalIncome - totalExpense;

  // Toggle button UI
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
          {mode === 'dark' ? <FaMoon size={24} color="#23283A" /> : <FaSun size={24} color="#FFD700" />}
        </div>
      </button>
      <span style={{ fontWeight: 700, fontSize: 24, color: mode === 'dark' ? palette.text : palette.faded, transition: 'color 0.6s' }}>Dark</span>
    </div>
  );

  // Export to Excel handler
  const handleExport = () => {
    // Prepare data rows
    const data = transactions.map(t => ({
      Date: t.date,
      Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
      Category: t.category,
      Amount: parseFloat(t.amount),
      Description: t.description
    }));
    // Add a total row
    data.push({
      Date: '',
      Type: '',
      Category: 'TOTAL',
      Amount: data.reduce((sum, row) => sum + (typeof row.Amount === 'number' ? row.Amount : 0), 0),
      Description: ''
    });
    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(data, { header: ['Date', 'Type', 'Category', 'Amount', 'Description'] });
    // Format header row bold
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (cell) cell.s = { font: { bold: true } };
    }
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    // Export
    XLSX.writeFile(wb, 'transactions.xlsx');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: palette.bg, color: palette.text, transition: 'background 0.6s, color 0.6s' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: palette.white, borderTopRightRadius: 32, borderBottomRightRadius: 32, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'background 0.6s, color 0.6s' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 28, color: palette.blue, marginBottom: 32, transition: 'color 0.6s' }}>Track.</div>
          <div style={{ color: palette.dark, fontWeight: 700, marginBottom: 24, transition: 'color 0.6s' }}>Dashboard</div>
          <button
            onClick={() => navigate('/login-activity')}
            style={{
              background: palette.accent,
              color: palette.white,
              border: 'none',
              borderRadius: 12,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: 16,
              marginBottom: 16,
              cursor: 'pointer',
              width: '100%',
              transition: 'background 0.6s, color 0.6s',
            }}
          >
            Login Activity
          </button>
          <div style={{ color: palette.faded, marginBottom: 16, transition: 'color 0.6s' }}>Graphical</div>
          <div style={{ color: palette.faded, marginBottom: 16, transition: 'color 0.6s' }}>Cloud Store</div>
          <div style={{ color: palette.faded, marginBottom: 16, transition: 'color 0.6s' }}>Research</div>
          <div style={{ color: palette.faded, marginBottom: 16, transition: 'color 0.6s' }}>Analysis</div>
        </div>
        <div>
          <button style={{ background: palette.accent, color: palette.white, border: 'none', borderRadius: 12, padding: '12px 0', fontWeight: 700, fontSize: 16, marginTop: 16, cursor: 'pointer', transition: 'background 0.6s, color 0.6s', width: '100%' }}>Upgrade</button>
        </div>
      </div>
      {/* Main content */}
      <div style={{ flex: 1, background: palette.gray, borderRadius: 32, margin: 24, padding: 32, display: 'flex', flexDirection: 'column', transition: 'background 0.6s, color 0.6s' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: palette.dark, transition: 'color 0.6s' }}>Expenso</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 600 }}>{user.account_name || user.email}</span>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.account_name || user.email)}&background=95E0E1&color=222`} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <button onClick={onLogout} style={{ background: palette.blue, color: palette.white, border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, marginLeft: 8, cursor: 'pointer', transition: 'background 0.6s, color 0.6s' }}>Logout</button>
          </div>
        </div>
        {/* Toggle button */}
        {toggleButton}
        {/* Summary cards */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 1, background: palette.white, borderRadius: 20, padding: 24, boxShadow: mode === 'dark' ? '0 2px 12px rgba(79,140,255,0.08)' : '0 2px 12px rgba(59,76,184,0.06)' }}>
            <div style={{ color: palette.blue, fontWeight: 700, fontSize: 18 }}>INCOME</div>
            <div style={{ fontWeight: 900, fontSize: 28, margin: '8px 0' }}>${totalIncome.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1, background: palette.white, borderRadius: 20, padding: 24, boxShadow: mode === 'dark' ? '0 2px 12px rgba(255,234,194,0.08)' : '0 2px 12px rgba(59,76,184,0.06)' }}>
            <div style={{ color: palette.yellow, fontWeight: 700, fontSize: 18 }}>EXPENSE</div>
            <div style={{ fontWeight: 900, fontSize: 28, margin: '8px 0' }}>${totalExpense.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1, background: palette.blue, borderRadius: 20, padding: 24, color: palette.white, boxShadow: mode === 'dark' ? '0 2px 12px rgba(79,140,255,0.08)' : '0 2px 12px rgba(59,76,184,0.06)' }}>
            <div style={{ color: palette.white, fontWeight: 700, fontSize: 18 }}>BALANCE</div>
            <div style={{ fontWeight: 900, fontSize: 28, margin: '8px 0' }}>${total.toLocaleString()}</div>
          </div>
        </div>
        {/* Statistics and Pie chart */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
          <div style={{ flex: 2, background: palette.white, borderRadius: 20, padding: 24, boxShadow: mode === 'dark' ? '0 2px 12px rgba(79,140,255,0.08)' : '0 2px 12px rgba(59,76,184,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Statistics</div>
            <Bar data={barData} options={{
              plugins: { legend: { display: true, position: 'top' } },
              responsive: true,
              scales: { y: { beginAtZero: true } },
              borderRadius: 8,
            }} />
          </div>
          <div style={{ flex: 1, background: palette.white, borderRadius: 20, padding: 24, boxShadow: mode === 'dark' ? '0 2px 12px rgba(255,234,194,0.08)' : '0 2px 12px rgba(59,76,184,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Transaction Types</div>
            <Pie data={pieData} />
          </div>
        </div>
        {/* Add transaction form and card payments */}
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 2, background: palette.white, borderRadius: 20, padding: 24, boxShadow: mode === 'dark' ? '0 2px 12px rgba(79,140,255,0.08)' : '0 2px 12px rgba(59,76,184,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Add Transaction</div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <input name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={handleChange} required style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16, background: palette.gray, color: palette.text }} />
              <select name="type" value={form.type} onChange={handleChange} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16, background: palette.gray, color: palette.text }}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16, background: palette.gray, color: palette.text }} />
              <input name="date" type="date" value={form.date} onChange={handleChange} required style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16, background: palette.gray, color: palette.text }} />
              <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ flex: 2, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16, background: palette.gray, color: palette.text }} />
              <button type="submit" style={{ background: palette.accent, color: palette.white, fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 16, cursor: 'pointer', marginLeft: 8 }}>Add</button>
            </form>
            <div style={{ color: palette.blue, minHeight: 24, marginBottom: 8 }}>{message}</div>
            {/* Export Button */}
            <button onClick={handleExport} style={{ background: palette.accent, color: palette.white, fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 16, cursor: 'pointer', marginBottom: 16 }}>
              Export to Excel
            </button>
            <div style={{ maxHeight: 220, overflowY: 'auto', marginTop: 16 }}>
              <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', fontSize: 15 }}>
                <thead>
                  <tr style={{ background: palette.gray }}>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td style={{ color: t.type === 'income' ? palette.blue : palette.yellow, fontWeight: 700 }}>{t.type === 'income' ? 'Income' : 'Expense'}</td>
                      <td>{t.category}</td>
                      <td>{parseFloat(t.amount).toLocaleString()}</td>
                      <td>{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Card Payments (recent transactions) */}
          <div style={{ flex: 1, background: palette.white, borderRadius: 20, padding: 24, boxShadow: mode === 'dark' ? '0 2px 12px rgba(79,140,255,0.08)' : '0 2px 12px rgba(59,76,184,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Recent Transactions</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {transactions.slice(0, 5).map(t => (
                <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{t.type === 'income' ? '💰' : '💸'}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.category}</div>
                      <div style={{ color: palette.faded, fontSize: 13 }}>{t.date}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: t.type === 'income' ? palette.blue : palette.yellow }}>
                    {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 