import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      console.log("API DATA:", res.data);

      // ✅ Handle different API response formats safely
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.students || [];

      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load students');
      setStudents([]); // fallback
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;

    try {
      await api.delete(`/students/${id}`);
      toast.success('Deleted');
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  // ✅ SAFE FILTER (no crash)
  const filtered = (students || []).filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.roll || '').includes(search) ||
    (s.dept || '').toLowerCase().includes(search.toLowerCase())
  );

  // ⏳ Optional loading state
  if (!Array.isArray(students)) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>JKKNIU Library — Student Portal</h1>
          <p style={{ margin: 0, color: 'gray', fontSize: 14 }}>
            Welcome, {user?.name || 'User'}
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          style={{
            padding: '8px 18px',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, roll, or department..."
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
          border: '1px solid #ccc',
          fontSize: 14
        }}
      />

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              {['Photo','Name','Roll','Email','Dept','Session','Gender','Phone','Actions'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #ddd'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map(s => (
              <tr key={s._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 12px' }}>
                  <img
                    src={s.photo || 'https://via.placeholder.com/40'}
                    alt={s.name || 'student'}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </td>

                <td style={{ padding: '10px 12px' }}>{s.name || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{s.roll || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{s.email || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{s.dept || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{s.session || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{s.gender || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{s.phone || '-'}</td>

                <td style={{ padding: '10px 12px' }}>
                  <Link
                    to={`/students/${s._id}/edit`}
                    style={{ marginRight: 8, color: '#1a56db' }}
                  >
                    Edit
                  </Link>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(s._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: 40 }}>
            No students found.
          </p>
        )}
      </div>
    </div>
  );
}