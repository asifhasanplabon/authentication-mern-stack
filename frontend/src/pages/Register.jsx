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
        headers: { 'Content-Type': 'multipart/form-data' },
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Lora:ital@0;1&display=swap');
        .reg-input:focus { outline: none; border-color: var(--color-border-primary, #888); }
        .reg-input::placeholder { color: var(--color-text-tertiary); }
        .reg-file { cursor: pointer; }
      `}</style>

      <div style={s.root}>
        <div style={s.card}>
          <p style={s.eyebrow}>JKKNIU Library Management</p>
          <h2 style={s.title}>
            Create your <em style={{ fontStyle: 'italic' }}>account</em>
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={s.grid}>
              <Field label="Full Name" error={errors.name?.message} full>
                <input className="reg-input" style={s.input}
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your full name" />
              </Field>

              <Field label="Roll Number" error={errors.roll?.message}>
                <input className="reg-input" style={s.input}
                  {...register('roll', { required: 'Roll is required' })}
                  placeholder="e.g. 2021331001" />
              </Field>

              <Field label="Session" error={errors.session?.message}>
                <input className="reg-input" style={s.input}
                  {...register('session', { required: 'Session is required' })}
                  placeholder="e.g. 2021-22" />
              </Field>

              <Field label="Email" error={errors.email?.message} full>
                <input type="email" className="reg-input" style={s.input}
                  {...register('email', { required: 'Email is required' })}
                  placeholder="student@jkkniu.ac.bd" />
              </Field>

              <Field label="Password" error={errors.password?.message}>
                <input type="password" className="reg-input" style={s.input}
                  {...register('password', { required: true, minLength: { value: 8, message: 'Min 8 chars' } })}
                  placeholder="Min 6 characters" />
              </Field>

              <Field label="Phone" error={errors.phone?.message}>
                <input className="reg-input" style={s.input}
                  {...register('phone', { required: 'Phone is required' })}
                  placeholder="01XXXXXXXXX" />
              </Field>

              <Field label="Gender" error={errors.gender?.message}>
                <select className="reg-input" style={s.input}
                  {...register('gender', { required: 'Select gender' })}>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </Field>

              <Field label="Department" error={errors.dept?.message}>
                <select className="reg-input" style={s.input}
                  {...register('dept', { required: 'Select department' })}>
                  <option value="">Select department</option>
                  {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>

              <Field label="Profile Photo" error={errors.photo?.message} full>
                <input type="file" accept="image/*" className="reg-file"
                  style={s.fileInput} {...register('photo')} />
              </Field>
            </div>

            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <hr style={s.divider} />
          <p style={s.footer}>
            Already have an account? <Link to="/login" style={s.footerLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

function Field({ label, error, children, full }) {
  return (
    <div style={{ ...s.field, ...(full ? { gridColumn: '1 / -1' } : {}) }}>
      <label style={s.label}>{label}</label>
      {children}
      {error && <p style={s.error}>{error}</p>}
    </div>
  );
}

const s = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem 1rem',
    minHeight: '100vh',
    background: 'var(--color-background-tertiary)',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: 520,
    background: 'var(--color-background-primary)',
    border: '0.5px solid var(--color-border-tertiary)',
    borderRadius: 12,
    padding: '2.5rem 2rem',
    alignSelf: 'flex-start',
    marginTop: 40,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-text-secondary)',
    margin: '0 0 8px',
  },
  title: {
    fontFamily: "'Lora', serif",
    fontSize: 22,
    fontWeight: 400,
    color: 'var(--color-text-primary)',
    margin: '0 0 2rem',
    lineHeight: 1.3,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0 1.25rem',
  },
  field: { marginBottom: '1.25rem' },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--color-text-secondary)',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: 'var(--color-text-primary)',
    background: 'var(--color-background-secondary)',
    border: '0.5px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    boxSizing: 'border-box',
  },
  fileInput: {
    width: '100%',
    padding: '9px 12px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: 'var(--color-text-secondary)',
    background: 'var(--color-background-secondary)',
    border: '0.5px dashed var(--color-border-secondary)',
    borderRadius: 8,
    boxSizing: 'border-box',
  },
  error: {
    fontSize: 12,
    color: 'var(--color-text-danger)',
    margin: '4px 0 0',
  },
  btn: {
    width: '100%',
    padding: 11,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.03em',
    background: 'var(--color-text-primary)',
    color: 'var(--color-background-primary)',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: 8,
  },
  divider: {
    border: 'none',
    borderTop: '0.5px solid var(--color-border-tertiary)',
    margin: '1.5rem 0 1.25rem',
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: 'var(--color-text-secondary)',
    margin: 0,
  },
  footerLink: {
    color: 'var(--color-text-primary)',
    fontWeight: 500,
    textDecoration: 'none',
  },
};