import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      toast.success(res.data.message);
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12,
                    padding: 32, border: '1px solid var(--color-border-tertiary)' }}>
        <h2>Forgot Password</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
          Enter your registered email to receive an OTP.
        </p>
        <form onSubmit={submit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" required
            style={{ width: '100%', padding: 10, borderRadius: 8, marginBottom: 16,
                     border: '1px solid var(--color-border-secondary)', fontSize: 14,
                     background: 'var(--color-background-primary)', color: 'var(--color-text-primary)',
                     boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 12, background: '#1a56db', color: '#fff',
                     border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' }}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}