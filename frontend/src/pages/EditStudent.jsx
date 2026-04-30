import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', gender:'', session:'', dept:'', phone:'' });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/students/${id}`).then(res => {
      const { name, gender, session, dept, phone, photo } = res.data;
      setForm({ name, gender, session, dept, phone });
      setPreview(photo);
    }).catch(() => toast.error('Failed to load'));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      await api.put(`/students/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Updated successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12,
                    padding: 32, border: '1px solid var(--color-border-tertiary)' }}>
        <h2 style={{ marginBottom: 24 }}>Edit Student Profile</h2>
        {preview && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <img src={preview} alt="current" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        )}
        <form onSubmit={submit}>
          {[['name','Name'],['session','Session'],['phone','Phone']].map(([field, label]) => (
            <div key={field} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>{label}</label>
              <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={inputStyle} required />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>Gender</label>
            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={inputStyle}>
              <option>Male</option><option>Female</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>New Photo (optional)</label>
            <input type="file" accept="image/*" onChange={e => {
              setPhoto(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 12, background: '#1a56db', color: '#fff',
                     border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
const inputStyle = { width: '100%', padding: 10, borderRadius: 8, fontSize: 14,
  border: '1px solid var(--color-border-secondary)', background: 'var(--color-background-primary)',
  color: 'var(--color-text-primary)', boxSizing: 'border-box' };