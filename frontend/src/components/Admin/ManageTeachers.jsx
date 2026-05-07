import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../Common/Modal';
import { FiAward, FiPlus, FiTrash2, FiMail, FiUser, FiCode } from 'react-icons/fi';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [ld, setLd] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', teacher_id: '', department: '', designation: '' });
  const [busy, setBusy] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const load = async () => {
    setLd(true);
    try { const r = await teacherAPI.getAll(); setTeachers(r.data.teachers || []); }
    catch { toast.error('Failed to load teachers'); }
    finally { setLd(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password || !form.teacher_id) {
      toast.error('Fill all required fields'); return;
    }
    setBusy(true);
    try {
      await teacherAPI.create(form);
      toast.success('Teacher added!');
      setModal(false);
      setForm({ full_name: '', email: '', password: '', teacher_id: '', department: '', designation: '' });
      load();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
    finally { setBusy(false); }
  };

  const del = async (t) => {
    if (!window.confirm(`Delete teacher ${t.full_name}?`)) return;
    try { await teacherAPI.delete(t.id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fade">
      <div className="ph">
        <div><h1><FiAward style={{ marginRight: 10, color: 'var(--m500)' }} /> Manage Teachers</h1>
          <p className="ph-sub">{teachers.length} {teachers.length === 1 ? 'teacher' : 'teachers'} registered</p></div>
        <button className="btn btn-p btn-add-teacher" onClick={() => setModal(true)}><FiPlus size={18} /> Add Teacher</button>
      </div>

      {ld ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto', marginBottom: 20 }} />
          <p style={{ color: 'var(--g400)', fontSize: 14 }}>Loading teachers...</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="card empty-teachers">
          <div style={{ textAlign: 'center', padding: 50 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍🏫</div>
            <h3 style={{ color: 'var(--g700)', marginBottom: 8 }}>No Teachers Yet</h3>
            <p style={{ color: 'var(--g500)', marginBottom: 24 }}>Get started by adding your first teacher</p>
            <button className="btn btn-p" onClick={() => setModal(true)}><FiPlus size={16} /> Add First Teacher</button>
          </div>
        </div>
      ) : (
        <div className="teachers-grid">
          {teachers.map((t, idx) => (
            <div 
              key={t.id} 
              className="teacher-card"
              style={{
                animationDelay: `${idx * 0.08}s`,
                borderLeft: `4px solid ${hoveredId === t.id ? 'var(--m500)' : 'var(--g200)'}`
              }}
              onMouseEnter={() => setHoveredId(t.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="teacher-header">
                <div className="teacher-avatar">{t.full_name.charAt(0).toUpperCase()}</div>
                <div className="teacher-info">
                  <h4>{t.full_name}</h4>
                  <span className="teacher-id-badge">{t.teacher_id}</span>
                </div>
                <button 
                  className="btn btn-delete" 
                  onClick={() => del(t)}
                  title="Delete teacher"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              
              <div className="teacher-details">
                <div className="detail-item">
                  <FiMail size={14} />
                  <div>
                    <span className="detail-label">Email</span>
                    <p className="detail-value">{t.email}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <FiCode size={14} />
                  <div>
                    <span className="detail-label">Department</span>
                    <p className="detail-value">{t.department || 'Not specified'}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <FiUser size={14} />
                  <div>
                    <span className="detail-label">Designation</span>
                    <p className="detail-value">{t.designation || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add New Teacher" width="520px">
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="fg">
              <label className="fl"><FiUser size={12} style={{ marginRight: 4, display: 'inline' }} />Full Name *</label>
              <input className="fi" value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Dr. Smith" />
            </div>
            <div className="fg">
              <label className="fl"><FiCode size={12} style={{ marginRight: 4, display: 'inline' }} />Teacher ID *</label>
              <input className="fi" value={form.teacher_id} onChange={e => set('teacher_id', e.target.value)} placeholder="TCH001" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="fg">
              <label className="fl"><FiMail size={12} style={{ marginRight: 4, display: 'inline' }} />Email *</label>
              <input className="fi" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="teacher@college.edu" />
            </div>
            <div className="fg">
              <label className="fl">Password *</label>
              <input className="fi" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="fg">
              <label className="fl">Department</label>
              <input className="fi" value={form.department} onChange={e => set('department', e.target.value)} placeholder="Computer Science" />
            </div>
            <div className="fg">
              <label className="fl">Designation</label>
              <input className="fi" value={form.designation} onChange={e => set('designation', e.target.value)} placeholder="Professor" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button 
              type="submit" 
              className="btn btn-p btn-lg" 
              style={{ flex: 1 }} 
              disabled={busy}
            >
              {busy ? 'Adding...' : 'Add Teacher'}
            </button>
            <button 
              type="button" 
              className="btn btn-cancel btn-lg" 
              onClick={() => setModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageTeachers;
