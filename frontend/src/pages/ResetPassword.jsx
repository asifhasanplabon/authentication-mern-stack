import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function ResetPassword() {
  const { state } = useLocation();
  const email = state?.email || '';
  const [form, setForm] = useState({ otp: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, otp: form.otp, newPassword: form.newPassword });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12,
                    padding: 32, border: '1px solid var(--color-border-tertiary)' }}>
        <h2>Reset Password</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>OTP sent to <strong>{email}</strong></p>
        <form onSubmit={submit}>
          {['otp', 'newPassword', 'confirm'].map((field) => (
            <input key={field} value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              type={field === 'otp' ? 'text' : 'password'}
              placeholder={field === 'otp' ? 'Enter OTP' : field === 'newPassword' ? 'New password' : 'Confirm password'}
              maxLength={field === 'otp' ? 6 : undefined} required
              style={{ width: '100%', padding: 10, borderRadius: 8, marginBottom: 12,
                       border: '1px solid var(--color-border-secondary)', fontSize: 14,
                       background: 'var(--color-background-primary)', color: 'var(--color-text-primary)',
                       boxSizing: 'border-box' }} />
          ))}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 12, background: '#1a56db', color: '#fff',
                     border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}