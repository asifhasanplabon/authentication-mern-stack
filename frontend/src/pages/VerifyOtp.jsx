import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function VerifyOtp() {
  const { state } = useLocation();
  const email = state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verify = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const resend = async () => {
    try {
      const res = await api.post('/auth/resend-otp', { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12,
                    padding: 32, border: '1px solid var(--color-border-tertiary)', textAlign: 'center' }}>
        <h2>Verify Your Email</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          OTP sent to <strong>{email}</strong>
        </p>
        <input
          value={otp} onChange={e => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP" maxLength={6}
          style={{ width: '100%', padding: 12, fontSize: 22, letterSpacing: 12,
                   textAlign: 'center', borderRadius: 8, border: '1px solid var(--color-border-secondary)',
                   background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
        />
        <button onClick={verify} disabled={loading || otp.length < 6}
          style={{ ...btnStyle, marginTop: 16 }}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button onClick={resend}
          style={{ background: 'none', border: 'none', color: '#1a56db',
                   cursor: 'pointer', marginTop: 12, fontSize: 14 }}>
          Resend OTP
        </button>
      </div>
    </div>
  );
}
const btnStyle = { width: '100%', padding: 12, background: '#1a56db', color: '#fff',
  border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer' };