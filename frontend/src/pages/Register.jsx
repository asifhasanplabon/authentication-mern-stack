import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axios';

const DEPTS = ['CSE','EEE','BBA','English','Mathematics','Economics','Physics','Chemistry'];

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'photo') fd.append(k, v[0]);
        else fd.append(k, v);
      });
      const res = await api.post('/auth/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.message);
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12,
                    padding: 32, border: '1px solid var(--color-border-tertiary)' }}>
        <h2 style={{ marginBottom: 24, color: 'var(--color-text-primary)' }}>
          JKKNIU LMS — Student Registration
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <Field label="Full Name" error={errors.name?.message}>
            <input {...register('name', { required: 'Name is required' })} placeholder="Your full name" />
          </Field>
          {/* Roll */}
          <Field label="Roll Number" error={errors.roll?.message}>
            <input {...register('roll', { required: 'Roll is required' })} placeholder="e.g. 2021331001" />
          </Field>
          {/* Email */}
          <Field label="Email" error={errors.email?.message}>
            <input type="email" {...register('email', { required: 'Email is required' })} placeholder="student@jkkniu.ac.bd" />
          </Field>
          {/* Password */}
          <Field label="Password" error={errors.password?.message}>
            <input type="password" {...register('password', { required: true, minLength: { value: 6, message: 'Min 6 chars' } })} placeholder="Min 6 characters" />
          </Field>
          {/* Phone */}
          <Field label="Phone" error={errors.phone?.message}>
            <input {...register('phone', { required: 'Phone is required' })} placeholder="01XXXXXXXXX" />
          </Field>
          {/* Gender */}
          <Field label="Gender" error={errors.gender?.message}>
            <select {...register('gender', { required: 'Select gender' })}>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </Field>
          {/* Session */}
          <Field label="Session" error={errors.session?.message}>
            <input {...register('session', { required: 'Session is required' })} placeholder="e.g. 2021-22" />
          </Field>
          {/* Department */}
          <Field label="Department" error={errors.dept?.message}>
            <select {...register('dept', { required: 'Select department' })}>
              <option value="">Select department</option>
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          {/* Photo */}
          <Field label="Profile Photo" error={errors.photo?.message}>
            <input type="file" accept="image/*" {...register('photo')} />
          </Field>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: 16, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

// Reusable field wrapper
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', marginBottom: 6, fontWeight: 500,
                      color: 'var(--color-text-primary)', fontSize: 14 }}>{label}</label>
      <div style={{ '& input, & select': { width: '100%' } }}>
        {children}
      </div>
      {error && <p style={{ color: 'var(--color-text-danger)', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

const btnStyle = {
  width: '100%', padding: '12px', background: '#1a56db', color: '#fff',
  border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500,
  cursor: 'pointer', marginTop: 8,
};