import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12,
                    padding: 32, border: '1px solid var(--color-border-tertiary)' }}>
        <h2 style={{ marginBottom: 24 }}>Login — JKKNIU LMS</h2>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com" style={inputStyle} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Your password" style={inputStyle} required />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: '#1a56db' }}>
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--color-text-secondary)' }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
const labelStyle = { display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 };
const inputStyle = { width: '100%', padding: 10, borderRadius: 8,
  border: '1px solid var(--color-border-secondary)', fontSize: 14,
  background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: 12, background: '#1a56db', color: '#fff',
  border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer' };